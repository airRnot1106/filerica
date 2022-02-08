import fs from 'fs';

export interface Board {
    name: string;
    path: string;
    isSelected: boolean;
}

export interface SettingFile {
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
        if (!existsSettingDir) {
            fs.mkdirSync(this._SETTING_DIR_PATH);
            const existsTmpDir = fs.existsSync(this._SETTING_TMP_DIR_PATH);
            if (!existsTmpDir) fs.mkdirSync(this._SETTING_TMP_DIR_PATH);
            const initJson: SettingFile = { inputPath: 'hoge', boards: [] };
            await this._write(initJson).catch(() => {
                throw new Error('Fatal Error');
            });
        }
        this._cache = await this._read();
    }

    private static _checkIsInitialized() {
        if (!this._isInitialized)
            throw new Error('Setting has not been initialized');
    }

    private static _isValidSettingFile(object: object): object is SettingFile {
        const properties: (keyof SettingFile)[] = ['inputPath', 'boards'];
        for (const property of properties) {
            if (!Object.prototype.hasOwnProperty.call(object, property))
                return false;
        }
        return true;
    }

    private static _validateDirPath(path: string) {
        const isValidPath = fs.existsSync(path);
        if (!isValidPath) throw new Error(`Invalid path '${path}'`);
        const stat = fs.statSync(path);
        if (!stat.isDirectory()) throw Error(`Not a directory path '${path}'`);
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
                        throw new Error('Invalid Setting File');
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

            ws.on('finish', () => {
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
                    ws.emit('error', error);
                });
            });

            ws.on('error', (error) => {
                reject(error);
            });
        });
    }

    static async save() {
        await this._write(this._cache);
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
        if (!target) throw new Error(`Board '${name}' is does not exist`);
        return { ...target };
    }

    static getBoardIndexByName(name: string) {
        const boards = this.getBoards();
        const targetIndex = boards.findIndex((board) => board.name === name);
        if (targetIndex === -1)
            throw new Error(`Board '${name}' is does not exist`);
        return targetIndex;
    }

    static getSelectedBoard() {
        const boards = this.getBoards();
        const target = boards.find((board) => board.isSelected);
        if (!target) throw new Error('No Board Selected');
        return { ...target };
    }

    static appendBoard(newBoard: Board) {
        const boards = this.getBoards();
        const isAlreadyExists = boards.some(
            (board) => board.name === newBoard.name
        );
        if (isAlreadyExists)
            throw new Error(`Board '${newBoard.name}' already exists`);
        this._validateDirPath(newBoard.path);
        this._cache.boards.push(newBoard);
    }

    static removeBoard(target: Board) {
        const targetIndex = this.getBoardIndexByName(target.name);
        const selected = this.getSelectedBoard();
        if (target.name === selected.name)
            throw new Error(
                `You cannot remove the currently selected board '${this._cache.boards[targetIndex].name}'`
            );
        this._cache.boards.splice(targetIndex, 1);
    }

    static selectBoard(target: Board) {
        const selected = this.getSelectedBoard();
        selected.isSelected = false;
        target.isSelected = true;
        this.updateBoards([selected, target]);
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
