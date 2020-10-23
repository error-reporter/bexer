export function installErrorNotifier({ extErrorIconUrl, pacErrorIconUrl, maskIconUrl, }?: {
    extErrorIconUrl?: string | undefined;
    pacErrorIconUrl?: string | undefined;
    maskIconUrl?: string | false | void | undefined;
} | undefined): {
    /** @param {ErrorNotification} errNoty */
    notifyAboutError: (errNoty: {
        clickHandler: Function;
        errorEventLike: ErrorEventLike;
        errorType?: "ext-error" | "pac-error" | undefined;
        notyTitle?: string | undefined;
        context?: string | undefined;
        ifSticky?: boolean | undefined;
    }) => void;
    uninstallErrorNotifier: () => void;
};
