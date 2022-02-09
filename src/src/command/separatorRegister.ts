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
        console.log(
            `Changed the separator of board '${selected.name}' to '${this._separator}'`
        );
    }
}
