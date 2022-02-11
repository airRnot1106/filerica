import fs from 'fs';
import { Logger } from './logger';
import { Reader } from './reader';

export interface Board {
    name: string;
    path: string;
    separator: string;
    isSelected: boolean;
}

export interface SettingFile {
    language: 'en' | 'ja';
    inputPath: string;
    boards: Board[];
}

export class Setting {
    private static _SETTING_FILE_NAME = 'setting.json';
    private static _SETTING_DIR_PATH = __dirname + '/../setting/';
    private static _SETTING_TMP_DIR_PATH = this._SETTING_DIR_PATH + '.tmp/';
    private static _SETTING_FILE_PATH =
        this._SETTING_DIR_PATH + this._SETTING_FILE_NAME;
    private static _SETTING_TMP_FILE_PATH =
        this._SETTING_TMP_DIR_PATH + this._SETTING_FILE_NAME;

    private static _isInitialized = false;

    private static _cache: SettingFile;

    static async initialize() {
        this._isInitialized = true;
        const existsSettingDir = fs.existsSync(this._SETTING_DIR_PATH);
        if (!existsSettingDir) fs.mkdirSync(this._SETTING_DIR_PATH);
        const existsTmpDir = fs.existsSync(this._SETTING_TMP_DIR_PATH);
        if (!existsTmpDir) fs.mkdirSync(this._SETTING_TMP_DIR_PATH);
        const existsSettingFile = fs.existsSync(this._SETTING_FILE_PATH);
        if (!existsSettingFile) {
            const DOWNLOADS_DIR_PATH =
                process.env[
                    process.platform == 'win32' ? 'USERPROFILE' : 'HOME'
                ];
            const initJson: SettingFile = {
                language: 'en',
                inputPath: `${DOWNLOADS_DIR_PATH}/downloads`,
                boards: [],
            };
            await this._write(initJson).catch(() => {
                throw new Error('Fatal Error');
            });
        }
        this._cache = await this._read().catch(async () => {
            return await this._restoreSettingFile().catch((error) => {
                Logger.error(error);
                process.exit(1);
            });
        });
    }

    private static _checkIsInitialized() {
        if (!this._isInitialized) throw ['ST_INIT_ERROR'];
    }

    private static _isValidSettingFile(object: object): object is SettingFile {
        const properties: (keyof SettingFile)[] = [
            'language',
            'inputPath',
            'boards',
        ];
        for (const property of properties) {
            if (!Object.prototype.hasOwnProperty.call(object, property))
                return false;
        }
        return true;
    }

    private static _validateDirPath(path: string) {
        const isValidPath = fs.existsSync(path);
        if (!isValidPath) throw ['ST_INVALID_PATH_ERROR', path];
        const stat = fs.statSync(path);
        if (!stat.isDirectory()) throw ['ST_INVALID_DIR_ERROR', path];
    }

    private static _read() {
        this._checkIsInitialized();
        return new Promise<SettingFile>((resolve, reject) => {
            let cache = '';

            const rs = fs.createReadStream(this._SETTING_FILE_PATH, {
                highWaterMark: 64,
            });

            rs.on('data', (chunk) => {
                cache += chunk;
            });

            rs.on('end', () => {
                try {
                    const json = JSON.parse(cache);
                    if (!this._isValidSettingFile(json))
                        throw ['ST_INVALID_ST_FILE_ERROR'];
                    resolve(json);
                } catch (error) {
                    //If the JSON parsing fails
                    rs.emit('error', error);
                }
            });

            rs.on('error', (error) => {
                reject(error);
            });
        });
    }

    private static _write(json: SettingFile) {
        this._checkIsInitialized();
        return new Promise<void>((resolve, reject) => {
            const ws = fs.createWriteStream(this._SETTING_TMP_FILE_PATH);

            ws.write(JSON.stringify(json, null, 4));
            ws.end();

            ws.on('finish', async () => {
                await this._copy().catch((error) => {
                    ws.emit('error', error);
                });
                resolve();
            });

            ws.on('error', (error) => {
                reject(error);
            });
        });
    }

    private static _copy() {
        return new Promise<void>((resolve, reject) => {
            const ts = fs.createReadStream(this._SETTING_TMP_FILE_PATH, {
                highWaterMark: 64,
            });
            const ds = fs.createWriteStream(this._SETTING_FILE_PATH);
            ts.pipe(ds);

            ds.on('finish', () => {
                resolve();
            });

            ts.on('error', (error) => {
                ds.destroy(error);
            });

            ds.on('error', (error) => {
                reject(error);
            });
        });
    }

    private static async _restoreSettingFile() {
        Logger.log('ST_RESTORE_HEADER');
        const answer = await Reader.select(['Yes', 'No']);
        if (answer === 1) throw ['ST_INVALID_ST_FILE_ERROR'];
        await this._copy().catch(() => {
            throw ['ST_RESTORE_FAILURE'];
        });
        const tmp = await this._read().catch(() => {
            throw ['ST_RESTORE_FAILURE'];
        });
        if (!this._isValidSettingFile(tmp)) throw ['ST_INVALID_ST_FILE_ERROR'];
        Logger.log('ST_RESTORE_SUCCESSFUL');
        return tmp;
    }

    static async save() {
        await this._write(this._cache);
    }

    static getLanguage() {
        return this._cache?.language ?? 'en';
    }

    static changeLanguage(newLang: SettingFile['language']) {
        this._cache.language = newLang;
    }

    static getInputPath() {
        return this._cache.inputPath;
    }

    static changeInputPath(newPath: string) {
        this._validateDirPath(newPath);
        this._cache.inputPath = newPath;
    }

    static getBoards() {
        return this._cache.boards.map((board) => {
            return { ...board };
        });
    }

    static getBoardByName(name: string) {
        const boards = this.getBoards();
        const target = boards.find((board) => board.name === name);
        if (!target) throw ['ST_NOT_EXISTS_BOARD_ERROR', name];
        return { ...target };
    }

    static getBoardIndexByName(name: string) {
        const boards = this.getBoards();
        const targetIndex = boards.findIndex((board) => board.name === name);
        if (targetIndex === -1) throw ['ST_NOT_EXISTS_BOARD_ERROR', name];
        return targetIndex;
    }

    static getSelectedBoard() {
        const boards = this.getBoards();
        const target = boards.find((board) => board.isSelected);
        if (!target) throw ['ST_NOT_SELECTED_BOARD_ERROR'];
        return { ...target };
    }

    static appendBoard(newBoard: Board) {
        const boards = this.getBoards();
        const isAlreadyExists = boards.some(
            (board) => board.name === newBoard.name
        );
        if (isAlreadyExists)
            throw ['ST_ALREADY_EXISTS_BOARD_ERROR', newBoard.name];
        this._validateDirPath(newBoard.path);
        this._cache.boards.push(newBoard);
    }

    static removeBoard(target: Board) {
        const targetIndex = this.getBoardIndexByName(target.name);
        const selected = this.getSelectedBoard();
        if (target.name === selected.name)
            throw [
                'ST_REMOVE_CURT_BOARD_ERROR',
                this._cache.boards[targetIndex].name,
            ];
        this._cache.boards.splice(targetIndex, 1);
    }

    static selectBoard(target: Board) {
        try {
            const selected = this.getSelectedBoard();
            selected.isSelected = false;
            target.isSelected = true;
            this.updateBoards([selected, target]);
        } catch (error) {
            target.isSelected = true;
            this.updateBoard(target);
        }
    }

    static changeSeparator(separator: string) {
        const selected = this.getSelectedBoard();
        selected.separator = separator;
        this.updateBoard(selected);
    }

    static updateBoard(newBoard: Board) {
        const targetIndex = this.getBoardIndexByName(newBoard.name);
        this._cache.boards.splice(targetIndex, 1, newBoard);
    }

    static updateBoards(boards: Board[]) {
        for (const board of boards) {
            this.updateBoard(board);
        }
    }
}
