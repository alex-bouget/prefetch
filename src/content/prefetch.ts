import { AbstractRule } from "../rules/abstract_rule";
import { AppendMapRule } from "../rules/append_map_rule";

export class Prefetch {
    private allRule: Record<string, AbstractRule<any, any>>;

    constructor(private fetch: FetchFunction) {
        this.allRule = {
            [AppendMapRule.rule_name]: new AppendMapRule(this),
        };
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
            return data;
        }
        if (type === ruleInstance.type) {
            return await ruleInstance.execute(data, rule.data);
        }
        return data;
        
    }
}