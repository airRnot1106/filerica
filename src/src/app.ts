import { Litargs } from 'litargs';
import { AbsCommand } from './command/absCommand';
import { Displayer } from './command/displayer';
import { BoardRegister } from './command/boardRegister';
import { Remover } from './command/remover';
import { Selector } from './command/selector';
import { Setting } from './setting';

(async () => {
    await Setting.initialize();
    Litargs.command('e', 0, { detail: 'Execute filing' }, (_args, _option) => {
        console.log('test');
    })
        .command(
            'board',
            2,
            { args: ['name', 'path'], detail: 'Register a board' },
            (args, option) => {
                const [name, path] = args;
                const l = option.l;
                if (l) return new Displayer();
                const rm = option.rm;
                if (rm) return new Remover(name);
                if (!name || !path) {
                    return;
                }
                const s = Boolean(option.s);
                return new BoardRegister(name, path, s);
            }
        )
        .alias('b')
        .option('s', 0, { detail: 'Select as well as create' })
        .option('rm', 0, { detail: 'Remove a board' })
        .option('l', 0, { detail: 'Display boards list' })
        .command('select', 0, { detail: 'Select a board' }, (_args, option) => {
            const n = option.n;
            if (!Array.isArray(n)) return new Selector();
            const [name] = n;
            return new Selector(name);
        })
        .alias('s')
        .option('n', 1, { args: ['name'], detail: 'Specify by name' })
        .parse(process.argv.slice(2).join(' '));
    const command = Litargs.execute();
    if (!(command instanceof AbsCommand)) {
        Litargs.help();
        return;
    }
    try {
        await command.execute();
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error(error);
        }
    }
})();

process.once('beforeExit', async () => {
    process.stderr.write('\x1B[?25h');
    await Setting.save();
});
