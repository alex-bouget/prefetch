import { Prefetch } from "../content/prefetch";

export abstract class AbstractRule<T, U> {
    protected static _name: string = "abstract_rule";
    protected _type: string = "*";

    public constructor(protected prefetch: Prefetch) {}

    public static get rule_name(): string {
        return this._name;
    }
    public get type(): string {
        return this._type;
    }

    public abstract execute(data: U, rule: T): Promise<U>;
}