import { regex_filter } from "./prefetch/utils";

let current_browser = null;
if (window?.chrome) {
    current_browser = window.chrome;
} else if (browser !== undefined) {
    current_browser = browser;
}
if (!current_browser) {
    throw new Error("Browser API not found");
}

(async () => {
    const config: PrefetchConfig[] = await current_browser.storage.local.get().then((res) => {
        return (JSON.parse(res?.prefetch_settings || '[]') || [] as PrefetchConfig[]);
    });

    console.log("Surfetch config", config);
    
    const keeped_config = regex_filter(config, "urls", window.location.href);
    if (keeped_config.length === 0) {
        return;
    }

    console.log("Surfetch enabled, creating script");
    
    let el = document.createElement('script');
    el.src = current_browser.runtime.getURL('pages/prefetch.js');
    el.setAttribute('data-config', JSON.stringify(config));
    document.head.appendChild(el);
})();