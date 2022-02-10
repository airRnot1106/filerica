import { Logger } from '../logger';
import { Setting } from '../setting';
import { AbsCommand } from './absCommand';

export class SeparatorRegister extends AbsCommand {
    private _separator;

    constructor(separator: string) {
        super();
        this._separator = separator;
    }

    execute(): void {
        Setting.changeSeparator(this._separator);
        const selected = Setting.getSelectedBoard();
        Logger.log('SP_RESULT', selected.name, this._separator);
    }
}
