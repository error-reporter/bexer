export function errorToPlainObject(error?: Error): any;
export function errorEventToPlainObject(errorEvent?: ErrorEvent | chrome.proxy.ErrorDetails): {
    [key: string]: any;
    message?: string | undefined;
    filename?: string | undefined;
    lineno?: number | undefined;
    colno?: number | undefined;
    type?: string | undefined;
    path?: string | (Element | undefined)[] | undefined;
    error?: JsonObject | undefined;
};
export type PlainErrorEventLike = {
    [key: string]: any;
    message?: string | undefined;
    filename?: string | undefined;
    lineno?: number | undefined;
    colno?: number | undefined;
    type?: string | undefined;
    path?: string | (Element | undefined)[] | undefined;
    error?: JsonObject | undefined;
};
