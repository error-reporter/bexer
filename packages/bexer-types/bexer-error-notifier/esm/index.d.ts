export function installErrorNotifier({ extErrorIconUrl, pacErrorIconUrl, maskIconUrl, }?: {
    extErrorIconUrl?: string | undefined;
    pacErrorIconUrl?: string | undefined;
    maskIconUrl?: string | false | void | undefined;
} | undefined): {
    /** @param {ErrorNotification} errNoty */
    notifyAboutError: (errNoty: {
        clickHandler: Function;
        errorEventLike: ErrorEvent | chrome.proxy.ErrorDetails;
        errorType?: any;
        notyTitle?: string | undefined;
        context?: string | undefined;
        ifSticky?: boolean | undefined;
    }) => void;
    uninstallErrorNotifier: () => void;
};
