export function regex_filter<U>(to_filter: U[], list: keyof U, payload: string): U[] {
    return to_filter.filter((c) => {
        return (c[list] as string[]).some((obj: string) => new RegExp(obj).test(payload));
    })
}

export function getUrl(url: RequestInfo | URL) {
    if (typeof url === "string") {
        return url;
    } else if (url instanceof Request) {
        return url.url;
    } else {
        return url.toString();
    }
}

export function readPath(path: string|null): string[]|null {
    if (path === null) {
        return null;
    }

    const all_path = path.split(".");
    return all_path.reduce((acc: string[], path: string) => {
        if (path.endsWith("\\\\")) {
            acc.push(path.slice(0, -1));
            return acc;
        }
        const last = acc.pop()
        if (last === undefined) {
            acc.push(path);
            return acc;
        }
        if (last.endsWith("\\")) {
            acc.push(last.slice(0, -1) + "." + path);
            return acc;
        }
        acc.push(last);
        acc.push(path);
        return acc;
    }, [] as string[]);
}

export function executePath(obj: any, path: string) {
    const path_list = readPath(path);
    if (path_list === null) {
        return obj;
    }
    return path_list.reduce((acc: any, key: string) => {
        if (!acc[key]) {
            acc[key] = {};
        }
        return acc[key];
    }, obj);
}