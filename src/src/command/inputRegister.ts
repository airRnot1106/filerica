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
        console.log(`Changed the InputPath to '${this._path}'`);
    }
}
