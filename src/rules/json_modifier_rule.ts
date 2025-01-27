import { executePath } from "../prefetch/utils";
import { AbstractRule } from "./abstract_rule";


abstract class JsonModifierRule<U> extends AbstractRule<JsonModifierData, U> {
    public async executeJson(json: any, rule: JsonModifierData): Promise<any> {
        if (json === null) {
            return json;
        }
        if (!rule.source && !rule.data) {
            return json;
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
        Object.assign(result, value);
        return json;
    }
}

export class RequestJsonModifierRule extends JsonModifierRule<PayloadBeforeRule> {
    protected static _name: string = "request_json_modifier";
    protected _type: string = "before";

    public async execute(
        data: PayloadBeforeRule,
        rule: JsonModifierData
    ): Promise<PayloadBeforeRule> {
        const postData = data.options.body;
        if (!postData) {
            return data;
        }
        if (typeof postData === "string") {
            const json = JSON.parse(postData);
            data.options.body = await this.executeJson(json, rule);
        } else {
            console.error("Not support json modifier for non-string body");
        }
        return data;
    }
}


export class ResponseJsonModifierRule extends JsonModifierRule<string> {
    protected static _name: string = "response_json_modifier";
    protected _type: string = "after";

    public async execute(data: string, rule: JsonModifierData): Promise<string> {
        let json;
        try {
            json = JSON.parse(data);
        } catch (e) {
            console.error("Not support json modifier for non-json response");
            return data;
        }
        return JSON.stringify(await this.executeJson(json, rule));
    }
}