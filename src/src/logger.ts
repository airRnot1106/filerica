import { Setting, SettingFile } from './setting';

export type LogIntent =
    | 'BR'
    | 'HR'
    | 'CANCEL'
    | 'ST_INIT_ERROR'
    | 'ST_INVALID_PATH_ERROR'
    | 'ST_INVALID_DIR_ERROR'
    | 'ST_INVALID_ST_FILE_ERROR'
    | 'ST_NOT_EXISTS_BOARD_ERROR'
    | 'ST_NOT_SELECTED_BOARD_ERROR'
    | 'ST_ALREADY_EXISTS_BOARD_ERROR'
    | 'ST_REMOVE_CURT_BOARD_ERROR'
    | 'ST_RESTORE_HEADER'
    | 'ST_RESTORE_SUCCESSFUL'
    | 'ST_RESTORE_FAILURE'
    | 'IR_RESULT'
    | 'BR_RESULT'
    | 'SP_RESULT'
    | 'DP_LIST'
    | 'SL_HEAD'
    | 'SL_RESULT'
    | 'FL_HEADER'
    | 'FL_PER_ITEM_RESULT'
    | 'FL_TOTAL_ITEM_RESULT'
    | 'FL_FAILED_ITEM_RESULT_HEADER'
    | 'FL_FAILED_ITEM_RESULT_BODY'
    | 'LA_RESULT';

type LogTable = {
    [intent in LogIntent]: {
        [lang in SettingFile['language']]: string;
    };
};

export class Logger {
    private static _symbol = '&&';
    private static _currentLanguage: SettingFile['language'];

    private static _logTable: LogTable = {
        BR: {
            en: '',
            ja: '',
        },
        HR: {
            en: '----------------',
            ja: '----------------',
        },
        CANCEL: {
            en: 'Canceled',
            ja: 'キャンセルしました',
        },
        ST_INIT_ERROR: {
            en: 'Setting has not been initialized',
            ja: 'Settingがイニシャライズされていません',
        },
        ST_INVALID_PATH_ERROR: {
            en: `Invalid path '${this._symbol}0'`,
            ja: `'${this._symbol}0'は無効なパスです`,
        },
        ST_INVALID_DIR_ERROR: {
            en: `Not a directory path '${this._symbol}0'`,
            ja: `パス'${this._symbol}0'はディレクトリではありません`,
        },
        ST_INVALID_ST_FILE_ERROR: {
            en: 'Invalid Setting File',
            ja: '設定ファイルが破損しています',
        },
        ST_NOT_EXISTS_BOARD_ERROR: {
            en: `Board '${this._symbol}0' is does not exist`,
            ja: `ボード'${this._symbol}0'は存在しません`,
        },
        ST_NOT_SELECTED_BOARD_ERROR: {
            en: 'No Board Selected',
            ja: 'ボードがアクティブではありません',
        },
        ST_ALREADY_EXISTS_BOARD_ERROR: {
            en: `Board '${this._symbol}0' already exists`,
            ja: `ボード'${this._symbol}0'はすでに選択されています`,
        },
        ST_REMOVE_CURT_BOARD_ERROR: {
            en: `You cannot remove the currently selected board '${this._symbol}0'`,
            ja: `選択中のボード'${this._symbol}0'は削除することができません`,
        },
        ST_RESTORE_HEADER: {
            en: 'Setting File is corrupted. Do you want to try to restore it from a temporary file?',
            ja: '設定ファイルが破損しています。一時ファイルから復元を試みますか？',
        },
        ST_RESTORE_SUCCESSFUL: {
            en: 'Successfully restored',
            ja: '復元に成功しました',
        },
        ST_RESTORE_FAILURE: {
            en: 'Failed to restore',
            ja: '復元に失敗しました',
        },
        BR_RESULT: {
            en: `Board '${this._symbol}0' has been created`,
            ja: `ボード'${this._symbol}0'を作成しました`,
        },
        IR_RESULT: {
            en: `Changed the InputPath to '${this._symbol}0'`,
            ja: `インプットを'${this._symbol}0'に変更しました`,
        },
        SP_RESULT: {
            en: `Changed the separator of board '${this._symbol}0' to '${this._symbol}1'`,
            ja: `ボード'${this._symbol}0'のセパレータを'${this._symbol}1'に変更しました`,
        },
        DP_LIST: {
            en: `${this._symbol}0`,
            ja: `${this._symbol}0`,
        },
        SL_HEAD: {
            en: 'Select a board:',
            ja: 'ボードを選択:',
        },
        SL_RESULT: {
            en: `Board '${this._symbol}0' was selected`,
            ja: `ボード'${this._symbol}0'が選択されました`,
        },
        FL_HEADER: {
            en: 'Launch filing...',
            ja: 'ファイリングを実行します...',
        },
        FL_PER_ITEM_RESULT: {
            en: `\t'${this._symbol}0' has been successfully moved`,
            ja: `\t'${this._symbol}0'の移動に成功しました`,
        },
        FL_TOTAL_ITEM_RESULT: {
            en: `${this._symbol}0 items have been successfully moved`,
            ja: `${this._symbol}0個のアイテムの移動に成功しました`,
        },
        FL_FAILED_ITEM_RESULT_HEADER: {
            en: 'Failed to move the following items',
            ja: '以下のアイテムの移動に失敗しました',
        },
        FL_FAILED_ITEM_RESULT_BODY: {
            en: `\t'${this._symbol}0'`,
            ja: `\t'${this._symbol}0'`,
        },
        LA_RESULT: {
            en: `Changed language to '${this._symbol}0'`,
            ja: `言語を'${this._symbol}0'に変更しました`,
        },
    };

    static log(logIntent: LogIntent, ...args: string[]) {
        if (!this._currentLanguage)
            this._currentLanguage = Setting.getLanguage();
        const rawScript = this._logTable[logIntent][this._currentLanguage];
        let formalScript = rawScript;
        args.forEach((arg, index) => {
            formalScript = formalScript.replace(`${this._symbol}${index}`, arg);
        });
        console.log(formalScript);
    }

    static error(logIntent: LogIntent, ...args: string[]) {
        if (!this._currentLanguage)
            this._currentLanguage = Setting.getLanguage();
        const rawScript = this._logTable[logIntent][this._currentLanguage];
        let formalScript = rawScript;
        args.forEach((arg, index) => {
            formalScript = formalScript.replace(`${this._symbol}${index}`, arg);
        });
        console.log('Error:', formalScript);
    }
}
