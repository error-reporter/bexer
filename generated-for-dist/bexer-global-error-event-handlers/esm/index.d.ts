export function addGlobalHandler(handler?: ErrorHandler, category?: string | undefined): () => void;
export function installGlobalHandlersOn({ hostWindow, nameForDebug, onlyTheseErrorTypes, }: TargetWindowOpts, cb?: ((_: Function) => any) | undefined): () => void;
export function installGlobalHandlersOnAsync(opts: TargetWindowOpts): Promise<any>;
export type ErrorHandler = (_: ErrorTypesTS, __: ErrorEvent | chrome.proxy.ErrorDetails) => any;
export type TargetWindowOpts = {
    hostWindow: Window;
    nameForDebug: string;
    onlyTheseErrorTypes?: GetAllValuesOf<typeof ErrorTypes>[] | undefined;
};
import * as ErrorTypes from "@bexer/commons/esm/error-types";
