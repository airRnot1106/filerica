import { Logger } from '../logger';
import { Setting } from '../setting';
import { AbsCommand } from './absCommand';

export class Displayer extends AbsCommand {
    constructor() {
        super();
    }

    execute(): void {
        const boards = Setting.getBoards();
        const list = boards.map(
            (board, index) =>
                `[${index + 1}]\t${board.isSelected ? '*' : ''}${board.name}\t${
                    board.path
                }`
        );
        Logger.log('DP_LIST', list.join('\n'));
    }
}
