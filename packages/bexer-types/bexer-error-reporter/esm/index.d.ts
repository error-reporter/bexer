export function installErrorSubmissionHandler(handler: Function): void;
export function makeReport({ errorType, serializablePayload, }: {
    errorType?: any;
    serializablePayload: JsonObject;
}): {
    payload: JsonObject;
    extName: string;
    version: string;
    errorType: any;
    userAgent: string;
    platform: string;
};
export function openErrorReporter({ ifSubmissionHandlerInstalled, sendReportsToEmail, sendReportsInLanguages, errorTitle, report, }: {
    ifSubmissionHandlerInstalled?: boolean | undefined;
    sendReportsToEmail?: string | undefined;
    sendReportsInLanguages?: string[] | undefined;
    errorTitle: string;
    report: {
        extName: string;
        version: string;
        payload: JsonObject;
    };
}): void;
