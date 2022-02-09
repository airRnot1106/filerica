import Readline from 'readline';
import { Iconv } from 'iconv';
import jschardet from 'jschardet';

interface SelectOption {
    allowCancel?: boolean;
    shouldGiveNumber?: boolean;
}

export class Reader {
    static question(str: string) {
        const reader = Readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        return new Promise<string>((resolve, _reject) => {
            reader.question(str, (answer) => {
                const convertedAnswer =
                    this._convertCharacterCodeToUtf8(answer);
                resolve(convertedAnswer);
                reader.close();
            });
        });
    }

    static select(
        choices: string[],
        option: SelectOption = { allowCancel: false, shouldGiveNumber: false }
    ) {
        return new Promise<number>((resolve, _reject) => {
            //よくわからないけどこれがあると動く
            const reader = Readline.createInterface({
                input: process.stdin,
            });
            const tmpChoices = [...choices];
            let cursor = 0;
            const UP = Buffer.from([0x1b, 0x5b, 0x41]);
            const DOWN = Buffer.from([0x1b, 0x5b, 0x42]);
            const ENTER = Buffer.from([0x0d]);

            const display = () => {
                process.stdout.moveCursor(-9999, -tmpChoices.length);
                tmpChoices.forEach((choice, index) => {
                    process.stdout.moveCursor(-9999, 0);
                    process.stdout.clearLine(0);
                    process.stdout.write(cursor === index ? '>' : ' ');
                    if (option.shouldGiveNumber)
                        process.stdout.write(`[${index}]`);
                    process.stdout.write(` ${choice}\n`);
                });
            };
            const moveCursor = (dir: -1 | 1) => {
                switch (dir) {
                    case -1: {
                        if (cursor > 0) cursor--;
                        break;
                    }
                    case 1: {
                        if (cursor < tmpChoices.length - 1) cursor++;
                        break;
                    }
                }
            };

            if (option.allowCancel) tmpChoices.push('Cancel');

            process.stdin.setRawMode(true);
            process.stdout.write('\x1B[?25l');
            tmpChoices.forEach(() => {
                process.stdout.write('\n');
            });
            display();

            process.stdin.on('data', (key) => {
                if (key.equals(UP)) {
                    moveCursor(-1);
                    display();
                } else if (key.equals(DOWN)) {
                    moveCursor(1);
                    display();
                } else if (key.equals(ENTER)) {
                    process.stdout.moveCursor(-9999, -tmpChoices.length);
                    process.stdout.clearLine(0);
                    process.stdin.emit('end');
                }
            });

            process.stdin.on('end', () => {
                process.stdout.write('\x1B[?25h');
                reader.emit('close');
                resolve(cursor);
            });
        });
    }

    private static _convertCharacterCodeToUtf8(str: string) {
        if (str === '') return str;
        const charCode = jschardet.detect(str);
        const iconv = new Iconv(charCode.encoding, 'UTF-8');
        const converted = iconv.convert(str).toString();
        return converted;
    }
}
