import fs from 'fs';
import { Logger } from '../logger';
import { Setting } from '../setting';
import { AbsCommand } from './absCommand';

export class Filing extends AbsCommand {
    constructor() {
        super();
    }

    execute(): void {
        const selected = Setting.getSelectedBoard();
        const { path: targetPath } = selected;
        const targetDirs = fs
            .readdirSync(targetPath, { withFileTypes: true })
            .filter((dirent) => dirent.isDirectory())
            .map((dirent) => {
                return {
                    name: dirent.name,
                    path: `${targetPath}/${dirent.name}`,
                };
            });
        const inputPath = Setting.getInputPath();
        const inputItems = fs
            .readdirSync(inputPath, { withFileTypes: true })
            .map((dirent) => {
                const [className, ...itemName] = dirent.name.split(' ');
                return {
                    class: className,
                    itemName: itemName.join(' '),
                    fullName: dirent.name,
                    inputPath: `${inputPath}/${dirent.name}`,
                    outputPath: `${targetPath}/${className}`,
                };
            });
        const targetDirNames = targetDirs.map((targetDir) => targetDir.name);
        const validItems = inputItems.filter((item) =>
            targetDirNames.includes(item.class)
        );
        const ignoreFiles = ['.DS_Store'];
        const InvalidItems = inputItems.filter(
            (item) =>
                !targetDirNames.includes(item.class) &&
                !ignoreFiles.includes(item.fullName)
        );
        Logger.log('FL_HEADER');
        Logger.log('HR');
        let itemsCountSucceededToMove = 0;
        validItems.forEach((item, index, array) => {
            const timesArray = item.itemName.match(/[1-9]\d*/);
            if (!timesArray) {
                InvalidItems.push([...array].splice(index, 1)[0]);
                return;
            }
            const times = timesArray[0].padStart(2, '0');
            const parentPath = `${item.outputPath}/${times}`;
            const fullPath = `${item.outputPath}/${times}/${item.fullName}`;

            const existsParentPath = fs.existsSync(parentPath);
            if (!existsParentPath) fs.mkdirSync(parentPath);
            fs.renameSync(item.inputPath, fullPath);
            Logger.log('FL_PER_ITEM_RESULT', item.fullName);
            itemsCountSucceededToMove++;
        });
        Logger.log('HR');
        Logger.log('FL_TOTAL_ITEM_RESULT', `${itemsCountSucceededToMove}`);
        if (!InvalidItems.length) return;
        Logger.log('BR');
        Logger.log('FL_FAILED_ITEM_RESULT_HEADER');
        Logger.log('HR');
        for (const item of InvalidItems) {
            Logger.log('FL_FAILED_ITEM_RESULT_BODY', item.fullName);
        }
        Logger.log('HR');
    }
}
