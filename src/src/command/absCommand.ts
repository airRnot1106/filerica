export abstract class AbsCommand {
    abstract execute(): void | Promise<void>;
}
