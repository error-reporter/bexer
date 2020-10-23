export function installErrorSubmissionHandler(handler: Function): void;
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
