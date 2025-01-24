
export function getUrl(url: RequestInfo | URL) {
    if (typeof url === "string") {
        return url;
    } else if (url instanceof Request) {
        return url.url;
    } else {
        return url.toString();
    }
}

export function readPath(path: string): string[] {
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

export function executePath(obj: any, path: string, create: boolean = false) {
    return readPath(path).reduce((acc: any, key: string) => {
        if (create && acc[key] === undefined) {
            acc[key] = {};
        }
        return acc[key] || {};
    }, obj);
}