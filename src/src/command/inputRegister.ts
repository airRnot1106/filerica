import { Logger } from '../logger';
import { Setting } from '../setting';
import { AbsCommand } from './absCommand';

export class InputRegister extends AbsCommand {
    private _path;

    constructor(path: string) {
        super();
        this._path = path;
    }

    execute(): void {
        Setting.changeInputPath(this._path);
        Logger.log('IR_RESULT', this._path);
    }
}
