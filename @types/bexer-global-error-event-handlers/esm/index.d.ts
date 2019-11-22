export function addGlobalHandler(handler?: (_: "ext-error" | "pac-error", __: ErrorEvent | chrome.proxy.ErrorDetails) => any, category?: string | undefined): () => void;
export function installGlobalHandlersOn({ hostWindow, nameForDebug, onlyTheseErrorTypes, }: {
    hostWindow: Window;
    nameForDebug: string;
    onlyTheseErrorTypes?: ("ext-error" | "pac-error")[] | undefined;
}, cb?: ((_: Function) => any) | undefined): () => void;
export function installGlobalHandlersOnAsync(opts: {
    hostWindow: Window;
    nameForDebug: string;
    onlyTheseErrorTypes?: ("ext-error" | "pac-error")[] | undefined;
}): Promise<any>;
export type ErrorTypesTS = "ext-error" | "pac-error";
export type ErrorHandler = (_: "ext-error" | "pac-error", __: ErrorEvent | chrome.proxy.ErrorDetails) => any;
export type TargetWindowOpts = {
    hostWindow: Window;
    nameForDebug: string;
    onlyTheseErrorTypes?: ("ext-error" | "pac-error")[] | undefined;
};
