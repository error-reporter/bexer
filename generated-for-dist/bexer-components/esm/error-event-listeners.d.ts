/**
  @param {{
    hostWindow: Window,
    typedErrorEventListener: (
      _: ErrorTypesTS,
      __: ErrorEvent | chrome.proxy.ErrorDetails,
    ) => any,
    nameForDebug?: string,
    onlyTheseErrorTypes?: ErrorTypesTS[],
  }} _
  @param {Function} [cb]
*/
export function installTypedErrorEventListenersOn({ hostWindow, typedErrorEventListener, nameForDebug, onlyTheseErrorTypes, }: {
    hostWindow: Window;
    typedErrorEventListener: (_: ErrorTypesTS, __: ErrorEvent | chrome.proxy.ErrorDetails) => any;
    nameForDebug?: string | undefined;
    onlyTheseErrorTypes?: GetAllValuesOf<typeof import("@bexer/commons/esm/error-types")>[] | undefined;
}, cb?: Function | undefined): () => void;
