export function installTypedErrorEventListenersOn({ hostWindow, typedErrorEventListener, nameForDebug, onlyTheseErrorTypes, }: {
    hostWindow: Window;
    typedErrorEventListener: (_: "ext-error" | "pac-error", __: ErrorEvent | chrome.proxy.ErrorDetails) => any;
    nameForDebug?: string | undefined;
    onlyTheseErrorTypes?: ("ext-error" | "pac-error")[] | undefined;
}, cb?: Function | undefined): () => void;
export type ErrorTypesTS = "ext-error" | "pac-error";
