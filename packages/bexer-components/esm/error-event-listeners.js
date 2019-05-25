// Generated from package @bexer/error-event-listeners v0.0.1
import Debug from './private/debug.js';
import { getOrDie, mandatory, assert, timeouted } from './utils.js';
import { PAC_ERROR, EXT_ERROR } from './error-types.js';

const getSettingsAsync = () =>
  new Promise((resolve) =>
    chrome.proxy.settings.get(
      {},
      getOrDie(resolve),
    ));

/**
  @param {chrome.types.ChromeSettingGetResultDetails} [details_]
  @returns {Promise<boolean>}
*/
const areProxySettingsControlledAsync = async (details_) => {

  const details = details_ || await getSettingsAsync();
  return details.levelOfControl.startsWith('controlled_by_this');

};

const debug = Debug('bexer:catcher');

const bgName = 'BG';
/**
 * @param {Window} hostWindow
*/
const generateNameForDebug = (hostWindow) => {

  if (hostWindow === window) {
    return bgName;
  }
  return hostWindow.location.href
    .replace(/^.+\//, '')
    .replace(/.html$/, '')
    .toUpperCase();
};

/**
  @param {{
    hostWindow: Window,
    typedErrorEventListener: (
      _: GetAllValuesOf<typeof ErrorTypes>,
      __: ErrorEvent | chrome.proxy.ErrorDetails,
    ) => any,
    nameForDebug?: string,
  }} _
  @param {Function} [cb]
*/
// eslint-disable-next-line
const installTypedErrorEventListenersOn = ({
  hostWindow = mandatory(),
  typedErrorEventListener = mandatory(),
  nameForDebug = generateNameForDebug(hostWindow),
}, cb) => {

  const ifInBg = hostWindow === window;
  if (ifInBg) {
    assert(
      nameForDebug === 'BG',
      `Background window can't have name other than "${bgName}" (default value).`,
    );
  } else {
    assert(nameForDebug !== 'BG', 'nameForDebug "BG" is already assigned to the background window, choose something different.');
  }
  debug(ifInBg ? 'Installing handlers in BG.' : `Installing handlers in ${nameForDebug}.`);

  /** @param {ErrorEvent} errorEvent */
  const errorHandler = (errorEvent) => {

    debug(nameForDebug, 'caught:', errorEvent);
    typedErrorEventListener(EXT_ERROR, errorEvent);
  };

  const ifUseCapture = true;
  hostWindow.addEventListener('error', errorHandler, ifUseCapture);

  /**
    @param {PromiseRejectionEvent} event
    @returns {never}
  */
  const rejHandler = (event) => {

    event.preventDefault();
    debug(nameForDebug, 'rethrowing promise...');
    throw event.reason;

  };

  hostWindow.addEventListener('unhandledrejection', rejHandler, ifUseCapture);

  if (chrome.proxy && ifInBg) {
    chrome.proxy.onProxyError.addListener(async (details) => {

      // TODO: This handler is not timeouted.
      // TODO: Test throwing error here and catching it.
      const ifControlled = await areProxySettingsControlledAsync();
      if (!ifControlled) {
        // PAC script is not controlled by this extension,
        // so its errors are caused by other extensoin.
        return;
      }
      /*
        Example: {
          details: "line: 7: Uncaught Error: This is error, man.",
          error: "net::ERR_PAC_SCRIPT_FAILED",
          fatal: false,
        }
      */
      typedErrorEventListener(PAC_ERROR, details);
    });
  }

  const uninstallErrorHandlers = () => {

    hostWindow.removeEventListener('error', errorHandler, ifUseCapture);
    hostWindow.removeEventListener('unhandledrejection', rejHandler, ifUseCapture);
  };

  if (cb) {
    timeouted(cb)(uninstallErrorHandlers);
  }

  return uninstallErrorHandlers;
};

export { installTypedErrorEventListenersOn };
