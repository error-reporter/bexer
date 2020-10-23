/** @param {Function} handler */
export function installErrorSubmissionHandler(handler: Function): void;
/**
  @param {{
    errorType?: ErrorTypesTS,
    serializablePayload: JsonObject,
  }} _
*/
export function makeReport({ errorType, serializablePayload, }: {
    errorType?: ErrorTypesTS;
    serializablePayload: JsonObject;
}): {
    payload: JsonObject;
    extName: string;
    version: string;
    errorType: string | undefined;
    userAgent: string;
    platform: string;
};
/**
  @param {{
    ifSubmissionHandlerInstalled?: boolean,
    sendReportsToEmail?: string,
    sendReportsInLanguages?: Array<string>,
    errorTitle: string,
    report: {
      extName: string,
      version: string,
      payload: JsonObject,
    },
  }} _
*/
export function openErrorReporter({ ifSubmissionHandlerInstalled, sendReportsToEmail, sendReportsInLanguages, errorTitle, report, }: {
    ifSubmissionHandlerInstalled?: boolean;
    sendReportsToEmail?: string;
    sendReportsInLanguages?: Array<string>;
    errorTitle: string;
    report: {
        extName: string;
        version: string;
        payload: JsonObject;
    };
}): void;
