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
import * as ErrorTypes from "@bexer/commons/esm/error-types";
import * as Utils from "@bexer/utils";
import { installGlobalHandlersOn } from "@bexer/global-error-event-handlers";
import { installGlobalHandlersOnAsync } from "@bexer/global-error-event-handlers";
import { addGlobalHandler } from "@bexer/global-error-event-handlers";
export { ErrorTypes, Utils, installGlobalHandlersOn, installGlobalHandlersOnAsync, addGlobalHandler };
