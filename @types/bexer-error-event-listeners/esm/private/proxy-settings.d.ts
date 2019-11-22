export function areProxySettingsControllableAsync(details_?: chrome.types.ChromeSettingGetResultDetails | undefined): Promise<boolean>;
export function areProxySettingsControlledAsync(details_?: chrome.types.ChromeSettingGetResultDetails | undefined): Promise<boolean>;
export namespace Messages {
    /**
      @param {string} niddle
      @returns {string}
    */
    export function searchSettingsForAsUrl(niddle: string): string;
    /**
      @returns {string}
    */
    export function whichExtensionAsHtml(): string;
}
