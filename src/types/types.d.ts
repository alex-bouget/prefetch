import '@types/chrome';
import '@types/firefox-webext-browser';

export {}

declare global {
    type FetchFunction = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

    interface PayloadBeforeRule {
        url: RequestInfo | URL,
        options: RequestInit,
    }

    interface Window {
        prefetch_originalFetch: FetchFunction;
    }

    interface PrefetchStorage {
        prefetch_settings: string,
    }

    interface PrefetchRule {
        type: string,
        data: any,
    }

    interface PrefetchConfig {
        urls: string[],
        modified: string[],
        rules: PrefetchRule[],
    }
}