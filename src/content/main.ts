import { Prefetch } from "./prefetch";
import { getUrl } from "./utils";

const config: PrefetchConfig[] = [];

function regex_filter<U>(to_filter: U[], list: keyof U, payload: string): U[] {
    return to_filter.filter((c) => {
        return (c[list] as string[]).some((obj: string) => new RegExp(obj).test(payload));
    })
}

const keeped_config = regex_filter(config, "urls", window.location.href);

if (keeped_config.length === 0) {
    // @ts-expect-error surfetch don't need to be enabled because there is no config for this page
    return;
}
console.log("Surfetch enabled");
window.prefetch_originalFetch = window.fetch;

const prefetch = new Prefetch(window.prefetch_originalFetch);


window.fetch = async (url, options) => {
    const url_string = getUrl(url);
    const used_rules = regex_filter(keeped_config, "modified", url_string).reduce((acc, c) => {
        return acc.concat(c.rules);
    }, [] as PrefetchRule[]);
    if (used_rules.length === 0) {
        return window.prefetch_originalFetch(url, options);
    }
    ({url, options} = await prefetch.executeBeforeRules(used_rules, url, options));
    const response: Response = await window.prefetch_originalFetch(url, options);
    const result = await prefetch.executeAfterRules(
        used_rules,
        (await response.text()),
    );
    return new Response(result, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
    });
}