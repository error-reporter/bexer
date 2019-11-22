export function installErrorReporter({ submissionOpts: { handler, sendReportsToEmail, sendReportsInLanguages, onlyTheseErrorTypes, }, ifToNotifyAboutAsync, }: {
    submissionOpts: {
        handler: Function | undefined;
        sendReportsToEmail: string | undefined;
        sendReportsInLanguages?: string[] | undefined;
        onlyTheseErrorTypes?: ("ext-error" | "pac-error")[] | undefined;
    };
    ifToNotifyAboutAsync?: ((errorType: "ext-error" | "pac-error", errorEvent: ErrorEvent | chrome.proxy.ErrorDetails) => boolean) | undefined;
}): {
    uninstallErrorReporter: () => void;
    /**
      @param {ErrorEventLike} errorEventLike
      @param {ErrorTypesTS} errorType
    */
    notifyAbout: (errorEventLike: ErrorEvent | chrome.proxy.ErrorDetails, errorType?: "ext-error" | "pac-error") => void;
};
export type ErrorTypesTS = "ext-error" | "pac-error";
export type FunctionOrUndefined = Function | undefined;
export type stringOrUndefined = string | undefined;
import * as ErrorTypes from "@bexer/commons/esm/error-types";
import * as Utils from "@bexer/utils";
import { installGlobalHandlersOn } from "@bexer/global-error-event-handlers";
import { installGlobalHandlersOnAsync } from "@bexer/global-error-event-handlers";
import { addGlobalHandler } from "@bexer/global-error-event-handlers";
export { ErrorTypes, Utils, installGlobalHandlersOn, installGlobalHandlersOnAsync, addGlobalHandler };
