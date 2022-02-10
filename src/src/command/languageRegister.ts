import { Logger } from '../logger';
import { Reader } from '../reader';
import { Setting, SettingFile } from '../setting';
import { AbsCommand } from './absCommand';

export class LanguageRegister extends AbsCommand {
    constructor() {
        super();
    }

    async execute(): Promise<void> {
        const supportedLanguages: SettingFile['language'][] = ['en', 'ja'];
        const answer = await Reader.select(supportedLanguages, {
            allowCancel: true,
            shouldGiveNumber: true,
        });
        if (answer === supportedLanguages.length) {
            Logger.log('CANCEL');
            return;
        }
        const newLang = supportedLanguages[answer];
        Setting.changeLanguage(newLang);
        Logger.log('LA_RESULT', newLang);
    }
}
