import { Setting } from '../setting';
import { AbsCommand } from './absCommand';

export class Remover extends AbsCommand {
    private _name;

    constructor(name: string) {
        super();
        this._name = name;
    }

    execute(): void {
        const target = Setting.getBoardByName(this._name);
        Setting.removeBoard(target);
    }
}
