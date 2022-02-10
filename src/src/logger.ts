import { Setting, SettingFile } from './setting';

export type LogIntent =
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
    | 'IR_RESULT'
    | 'BR_RESULT'
    | 'SP_RESULT'
    | 'DP_LIST'
    | 'SL_HEAD'
    | 'SL_RESULT'
    | 'FL_PER_ITEM_RESULT'
    | 'FL_TOTAL_ITEM_RESULT'
    | 'FL_FAILED_ITEM_RESULT_HEADER'
    | 'FL_FAILED_ITEM_RESULT_BODY';

type LogTable = {
    [intent in LogIntent]: {
        [lang in SettingFile['language']]: string;
    };
};

export class Logger {
    private static _symbol = '&&';
    private static _currentLanguage: SettingFile['language'];

    private static _logTable: LogTable = {
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
            ja: '',
        },
        ST_INVALID_PATH_ERROR: {
            en: `Invalid path '${this._symbol}0'`,
            ja: ``,
        },
        ST_INVALID_DIR_ERROR: {
            en: `Not a directory path '${this._symbol}0'`,
            ja: ``,
        },
        ST_INVALID_ST_FILE_ERROR: {
            en: 'Invalid Setting File',
            ja: '',
        },
        ST_NOT_EXISTS_BOARD_ERROR: {
            en: `Board '${this._symbol}0' is does not exist`,
            ja: ``,
        },
        ST_NOT_SELECTED_BOARD_ERROR: {
            en: 'No Board Selected',
            ja: '',
        },
        ST_ALREADY_EXISTS_BOARD_ERROR: {
            en: `Board '${this._symbol}0' already exists`,
            ja: ``,
        },
        ST_REMOVE_CURT_BOARD_ERROR: {
            en: `You cannot remove the currently selected board '${this._symbol}0'`,
            ja: ``,
        },
        BR_RESULT: {
            en: `Board '${this._symbol}0' has been created`,
            ja: ``,
        },
        IR_RESULT: {
            en: `Changed the InputPath to '${this._symbol}0'`,
            ja: ``,
        },
        SP_RESULT: {
            en: `Changed the separator of board '${this._symbol}0' to '${this._symbol}1'`,
            ja: ``,
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
            ja: ``,
        },
        FL_PER_ITEM_RESULT: {
            en: `'${this._symbol}0' has been successfully moved`,
            ja: ``,
        },
        FL_TOTAL_ITEM_RESULT: {
            en: `${this._symbol}0 items have been successfully moved`,
            ja: ``,
        },
        FL_FAILED_ITEM_RESULT_HEADER: {
            en: 'Failed to move the following items',
            ja: '',
        },
        FL_FAILED_ITEM_RESULT_BODY: {
            en: `${this._symbol}0`,
            ja: `${this._symbol}0`,
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
