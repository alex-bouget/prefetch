import { AbstractRule } from "../rules/abstract_rule";
import { RequestJsonModifierRule, ResponseJsonModifierRule } from "../rules/json_modifier_rule";

export class Prefetch {
    private allRule: Record<string, AbstractRule<any, any>>;

    constructor(private fetch: FetchFunction) {
        this.allRule = {
            [RequestJsonModifierRule.rule_name]: new RequestJsonModifierRule(this),
            [ResponseJsonModifierRule.rule_name]: new ResponseJsonModifierRule(this),
        };
        console.log("Prefetch initialized", this.allRule);
    }

    public get originalFetch(): FetchFunction {
        return this.fetch;
    }

    public async executeBeforeRules(
        usedRules: PrefetchRule[],
        url: RequestInfo | URL,
        options?: RequestInit,
    ): Promise<{url: RequestInfo | URL, options?: RequestInit}> {
        return usedRules.reduce(
            async (acc, rule) => await this.executeRule("before", rule, await acc),
            Promise.resolve({url, options})
        );
    }

    public async executeAfterRules(
        usedRules: PrefetchRule[],
        data: string
    ): Promise<string> {
        return usedRules.reduce(
            async (acc, rule) => await this.executeRule("after", rule, await acc),
            Promise.resolve(data)
        )
    }

    private async executeRule<U>(type: string, rule: PrefetchRule, data: U): Promise<U> {
        const ruleInstance = this.allRule[rule.type];
        if (ruleInstance === undefined) {
            console.error(`Rule ${rule.type} not found`);
            return data;
        }
        if (type === ruleInstance.type) {
            return await ruleInstance.execute(data, rule.data);
        }
        return data;
        
    }
}