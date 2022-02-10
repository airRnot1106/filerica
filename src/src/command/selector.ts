import { Logger } from '../logger';
import { Reader } from '../reader';
import { Board, Setting } from '../setting';
import { AbsCommand } from './absCommand';

export class Selector extends AbsCommand {
    private _boardName;

    constructor(boardName?: string) {
        super();
        this._boardName = boardName;
    }

    async execute(): Promise<void> {
        if (this._boardName) {
            this._selectBoardByName(this._boardName);
        } else {
            await this._selectBoardByNumber();
        }
    }

    private _selectBoardByName(name: string) {
        const target = Setting.getBoardByName(name);
        this._save(target);
    }

    private async _selectBoardByNumber() {
        const boards = Setting.getBoards();
        const choices = boards.map((board) => board.name);
        const answer = await (async () => {
            while (true) {
                Logger.log('HR');
                Logger.log('SL_HEAD');
                const answer = await Reader.select(choices, {
                    allowCancel: true,
                    shouldGiveNumber: true,
                });
                if (answer === choices.length) return -1;
                return answer;
            }
        })();
        if (answer === -1) {
            Logger.log('CANCEL');
            return;
        }
        const target = boards[answer];
        this._save(target);
    }

    private _save(target: Board) {
        Setting.selectBoard(target);
        Logger.log('SL_RESULT', target.name);
    }
}
