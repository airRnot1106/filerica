import fs from 'fs';
import { Board, Setting } from '../setting';
import { AbsCommand } from './absCommand';
import { Selector } from './selector';

export class BoardRegister extends AbsCommand {
    private _name;
    private _path;
    private _isSelect;

    constructor(name: string, path: string, isSelect = false) {
        super();
        this._name = name;
        this._path = path;
        this._isSelect = isSelect;
    }

    execute(): void {
        const board: Board = {
            name: this._name,
            path: this._path,
            isSelected: false,
        };
        Setting.appendBoard(board);
        console.log(`Board '${this._name}' has been created.`);
        if (!this._isSelect) return;
        new Selector(this._name).execute();
    }
}
