import { executePath } from "../content/utils";
import { AbstractRule } from "./abstract_rule";

export class AppendMapRule extends AbstractRule<AppendMapData, string> {
    protected static _name: string = "append_map";
    protected _type: string = "after";

    public async execute(data: string, rule: AppendMapData): Promise<string> {
        const json = JSON.parse(data);
        if (json === null) {
            return data;
        }
        if (!rule.source && !rule.data) {
            return data;
        }
        let value;
        if (rule.source) {
            value = await this.prefetch.originalFetch(rule.source).then((response) => response.json());
        } else {
            value = rule.data;
            if (typeof value === "string") {
                value = JSON.parse(value);
            }
        }
        if (Array.isArray(value)) {
            value = Object.fromEntries(value.map((v, i) => [i, v]));
        }
        const result = executePath(json, rule.to);
        console.log(result);
        Object.assign(result, value);
        console.log(result);
        return JSON.stringify(json);
    }
}