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

    static async initialize() {
        this._isInitialized = true;
        const existsSettingDir = fs.existsSync(this._SETTING_DIR_PATH);
        if (!existsSettingDir) {
            fs.mkdirSync(this._SETTING_DIR_PATH);
            const existsTmpDir = fs.existsSync(this._SETTING_TMP_DIR_PATH);
            if (!existsTmpDir) fs.mkdirSync(this._SETTING_TMP_DIR_PATH);
            const initJson: SettingFile = { inputPath: 'hoge', boards: [] };
            await this.write(initJson).catch(() => {
                throw new Error('Fatal Error');
            });
        }
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

    static read() {
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

    static write(json: SettingFile) {
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

    static async appendBoard(board: Board) {
        const json = await this.read();
        json.boards.push(board);
        await this.write(json);
    }
}
