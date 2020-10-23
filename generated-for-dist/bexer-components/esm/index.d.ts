import * as ErrorTypes from "./error-types.js";
import * as Utils from "./utils.js";
/**
  @param {{
    submissionOpts: {
      handler?: Function | undefined,
      sendReportsToEmail?: string | undefined,
      sendReportsInLanguages?: Array<string>,
      onlyTheseErrorTypes?: ErrorTypesTS[],
    },
    ifToNotifyAboutAsync?: (
        errorType: ErrorTypesTS,
        errorEvent: ErrorEventLike,
      ) => boolean,
  }} _
*/
export function installErrorReporter({ submissionOpts: { handler, sendReportsToEmail, sendReportsInLanguages, onlyTheseErrorTypes, }, ifToNotifyAboutAsync, }: {
    submissionOpts: {
        handler?: Function | undefined;
        sendReportsToEmail?: string | undefined;
        sendReportsInLanguages?: Array<string>;
        onlyTheseErrorTypes?: ErrorTypesTS[];
    };
    ifToNotifyAboutAsync?: ((errorType: ErrorTypesTS, errorEvent: ErrorEventLike) => boolean) | undefined;
}): {
    uninstallErrorReporter: () => void;
    /**
      @param {ErrorEventLike} errorEventLike
      @param {ErrorTypesTS} errorType
    */
    notifyAbout: (errorEventLike: ErrorEventLike, errorType?: ErrorTypesTS) => void;
};
export { ErrorTypes, Utils };
export { addGlobalHandler, installGlobalHandlersOn, installGlobalHandlersOnAsync } from "./global-error-event-handlers.js";
