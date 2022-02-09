import fs from 'fs';
import { Board, Setting } from '../setting';
import { AbsCommand } from './absCommand';
import { Selector } from './selector';

export class BoardRegister extends AbsCommand {
    private _name;
    private _path;
    private _separator;
    private _isSelect;

    constructor(name: string, path: string, separator = ' ', isSelect = false) {
        super();
        this._name = name;
        this._path = path;
        this._separator = separator;
        this._isSelect = isSelect;
    }

    execute(): void {
        const board: Board = {
            name: this._name,
            path: this._path,
            separator: this._separator,
            isSelected: false,
        };
        Setting.appendBoard(board);
        console.log(`Board '${this._name}' has been created`);
        if (!this._isSelect) return;
        new Selector(this._name).execute();
    }
}
