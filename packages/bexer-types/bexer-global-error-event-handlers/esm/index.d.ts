export function addGlobalHandler(handler?: (_: any, __: ErrorEvent | chrome.proxy.ErrorDetails) => any, category?: string | undefined): () => void;
export function installGlobalHandlersOn({ hostWindow, nameForDebug, onlyTheseErrorTypes, }: {
    hostWindow: Window;
    nameForDebug: string;
    onlyTheseErrorTypes?: any[] | undefined;
}, cb?: ((_: Function) => any) | undefined): () => void;
export function installGlobalHandlersOnAsync(opts: {
    hostWindow: Window;
    nameForDebug: string;
    onlyTheseErrorTypes?: any[] | undefined;
}): Promise<any>;
export type ErrorHandler = (_: any, __: ErrorEvent | chrome.proxy.ErrorDetails) => any;
export type TargetWindowOpts = {
    hostWindow: Window;
    nameForDebug: string;
    onlyTheseErrorTypes?: any[] | undefined;
};
