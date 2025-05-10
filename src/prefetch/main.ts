import { Prefetch } from "./prefetch";
import { getUrl, regex_filter } from "./utils";

const keeped_config: PrefetchConfig[] =
    JSON.parse(document.currentScript?.getAttribute("data-config") || "null") ||
    window.prefetch_config ||
    [];


window.prefetch_originalFetch = window.fetch;
const prefetch = new Prefetch(window.prefetch_originalFetch);

const currentFetch: FetchFunction = async (url, options) => {
    const url_string = getUrl(url);
    const used_rules = regex_filter(keeped_config, "modified", url_string).reduce((acc, c) => {
        return acc.concat(c.rules);
    }, [] as PrefetchRule[]);
    if (used_rules.length === 0) {
        return window.prefetch_originalFetch(url, options);
    }
    console.log("Surfetch request", url, options, used_rules);
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

window.fetch = currentFetch;