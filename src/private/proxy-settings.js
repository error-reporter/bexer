import { workOrDie } from '../utils.js';

const getSettingsAsync = () =>
  new Promise((resolve) =>
    chrome.proxy.settings.get(
      {},
      workOrDie(resolve),
    ));

/*
* Possible values for levelOfControl:
*
* 1. "not_controllable"
* 2. "controlled_by_other_extensions"
* 3. "controllable_by_this_extension"
* 4. "controlled_by_this_extension"
*
* See: https://developer.chrome.com/extensions/proxy
*/
/**
  @param {chrome.types.ChromeSettingGetResultDetails} [details_]
  @returns {Promise<boolean>}
*/
export const areProxySettingsControllableAsync = async (details_) => {

  const details = details_ || await getSettingsAsync();
  return details.levelOfControl.startsWith('controllable_by_this');

};

/**
  @param {chrome.types.ChromeSettingGetResultDetails} [details_]
  @returns {Promise<boolean>}
*/
export const areProxySettingsControlledAsync = async (details_) => {

  const details = details_ || await getSettingsAsync();
  return details.levelOfControl.startsWith('controlled_by_this');

};

export const Messages = {

  /**
    @param {string} niddle
    @returns {string}
  */
  searchSettingsForAsUrl(niddle) {

    //  `niddle` may be: 'proxy'.
    const localedNiddle = chrome.i18n.getMessage(niddle) || niddle;
    return `chrome://settings/search#${localedNiddle}`;
  },

  /**
    @returns {string}
  */
  whichExtensionAsHtml() {

    // Example: "Other extension controls proxy! <a...>Which?</a>"
    const otherMsg = chrome.i18n.getMessage('errreporter_noControl') || 'Other extension controls proxy!';
    return `
      ${otherMsg}
      <a href="${this.searchSettingsForAsUrl('proxy')}">
        ${chrome.i18n.getMessage('errreporter_which') || 'Which?'}
      </a>`;
  },
};
