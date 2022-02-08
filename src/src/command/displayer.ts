import { Setting } from '../setting';
import { AbsCommand } from './absCommand';

export class Displayer extends AbsCommand {
    constructor() {
        super();
    }

    async execute(): Promise<void> {
        const boards = Setting.getBoards();
        const list = boards.map(
            (board, index) =>
                `[${index + 1}]\t${board.isSelected ? '*' : ''}${board.name}\t${
                    board.path
                }`
        );
        console.log(list.join('\n'));
    }
}
