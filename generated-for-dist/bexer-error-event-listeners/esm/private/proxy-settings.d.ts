export function areProxySettingsControllableAsync(details_?: chrome.types.ChromeSettingGetResultDetails | undefined): Promise<boolean>;
export function areProxySettingsControlledAsync(details_?: chrome.types.ChromeSettingGetResultDetails | undefined): Promise<boolean>;
export namespace Messages {
    /**
      @param {string} niddle
      @returns {string}
    */
    function searchSettingsForAsUrl(niddle: string): string;
    /**
      @param {string} niddle
      @returns {string}
    */
    function searchSettingsForAsUrl(niddle: string): string;
    /**
      @returns {string}
    */
    function whichExtensionAsHtml(): string;
    /**
      @returns {string}
    */
    function whichExtensionAsHtml(): string;
}
