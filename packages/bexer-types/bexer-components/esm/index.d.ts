import * as ErrorTypes from "./error-types.js";
import * as Utils from "./utils.js";
export function installErrorReporter({ submissionOpts: { handler, sendReportsToEmail, sendReportsInLanguages, onlyTheseErrorTypes, }, ifToNotifyAboutAsync, }: {
    submissionOpts: {
        handler?: Function | undefined;
        sendReportsToEmail?: string | undefined;
        sendReportsInLanguages?: string[] | undefined;
        onlyTheseErrorTypes?: any[] | undefined;
    };
    ifToNotifyAboutAsync?: ((errorType: any, errorEvent: ErrorEvent | chrome.proxy.ErrorDetails) => boolean) | undefined;
}): {
    uninstallErrorReporter: () => void;
    /**
      @param {ErrorEventLike} errorEventLike
      @param {ErrorTypesTS} errorType
    */
    notifyAbout: (errorEventLike: ErrorEvent | chrome.proxy.ErrorDetails, errorType?: any) => void;
};
export { ErrorTypes, Utils };
export { addGlobalHandler, installGlobalHandlersOn, installGlobalHandlersOnAsync } from "./global-error-event-handlers.js";
