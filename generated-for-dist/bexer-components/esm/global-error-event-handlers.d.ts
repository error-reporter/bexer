export type ErrorHandler = (_: ErrorTypesTS, __: ErrorEvent | chrome.proxy.ErrorDetails) => any;
export type TargetWindowOpts = {
    hostWindow: Window;
    nameForDebug: string;
    onlyTheseErrorTypes?: GetAllValuesOf<typeof import("@bexer/commons/esm/error-types")>[] | undefined;
};
/**
  @param {ErrorHandler} handler
  @param {string} [category]
*/
export function addGlobalHandler(handler?: ErrorHandler, category?: string | undefined): () => void;
/**
  @typedef {{
    hostWindow: Window,
    nameForDebug: string,
    onlyTheseErrorTypes?: ErrorTypesTS[],
  }} TargetWindowOpts
  @param {TargetWindowOpts} opts
  @param {(_: Function) => any} [cb]
*/
export function installGlobalHandlersOn({ hostWindow, nameForDebug, onlyTheseErrorTypes, }: TargetWindowOpts, cb?: ((_: Function) => any) | undefined): () => void;
/**
 @param {TargetWindowOpts} opts
*/
export function installGlobalHandlersOnAsync(opts: TargetWindowOpts): Promise<any>;
