export function installTypedErrorEventListenersOn({ hostWindow, typedErrorEventListener, nameForDebug, onlyTheseErrorTypes, }: {
    hostWindow: Window;
    typedErrorEventListener: (_: any, __: ErrorEvent | chrome.proxy.ErrorDetails) => any;
    nameForDebug?: string | undefined;
    onlyTheseErrorTypes?: any[] | undefined;
}, cb?: Function | undefined): () => void;
