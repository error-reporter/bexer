export function installTypedErrorEventListenersOn({ hostWindow, typedErrorEventListener, nameForDebug, onlyTheseErrorTypes, }: {
    hostWindow: Window;
    typedErrorEventListener: (_: ErrorTypesTS, __: ErrorEvent | chrome.proxy.ErrorDetails) => any;
    nameForDebug?: string | undefined;
    onlyTheseErrorTypes?: GetAllValuesOf<typeof ErrorTypes>[] | undefined;
}, cb?: Function | undefined): () => void;
import * as ErrorTypes from "@bexer/commons/esm/error-types";
