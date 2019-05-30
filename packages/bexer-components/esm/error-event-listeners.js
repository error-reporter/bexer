// Generated from package @bexer/error-event-listeners v0.0.4
import Debug from './private/debug.js';
import { workOrDie, mandatory, assert, timeouted } from './utils.js';
import { EXT_ERROR, PAC_ERROR } from './error-types.js';

const getSettingsAsync = () =>
  new Promise((resolve) =>
    chrome.proxy.settings.get(
      {},
      workOrDie(resolve),
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
  @typedef {GetAllValuesOf<typeof ErrorTypes>} ErrorTypesTS
  @param {{
    hostWindow: Window,
    typedErrorEventListener: (
      _: ErrorTypesTS,
      __: ErrorEvent | chrome.proxy.ErrorDetails,
    ) => any,
    nameForDebug?: string,
    onlyTheseErrorTypes?: ErrorTypesTS[],
  }} _
  @param {Function} [cb]
*/
// eslint-disable-next-line
const installTypedErrorEventListenersOn = ({
  hostWindow = mandatory(),
  typedErrorEventListener = mandatory(),
  nameForDebug = generateNameForDebug(hostWindow),
  onlyTheseErrorTypes = [EXT_ERROR, PAC_ERROR],
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

  /** @type {Function[]} */
  const uninstallers = [];
  const ifExtErr = onlyTheseErrorTypes.includes(EXT_ERROR);
  if (ifExtErr) {
    /** @param {ErrorEvent} errorEvent */
    const errorHandler = (errorEvent) => {

      debug(nameForDebug, 'caught:', errorEvent);
      typedErrorEventListener(EXT_ERROR, errorEvent);
    };

    const ifUseCapture = true;
    hostWindow.addEventListener('error', errorHandler, ifUseCapture);
    uninstallers.push(() =>
      hostWindow.removeEventListener('error', errorHandler, ifUseCapture),
    );
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
    uninstallers.push(() =>
      hostWindow.removeEventListener('unhandledrejection', rejHandler, ifUseCapture),
    );
  }

  const ifPacErr = onlyTheseErrorTypes.includes(PAC_ERROR);
  if (chrome.proxy && ifInBg && ifPacErr) {
    /**
      @param {chrome.proxy.ErrorDetails} details
    */
    const listener = async (details) => {

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
    };
    chrome.proxy.onProxyError.addListener(listener);
    uninstallers.push(() =>
      chrome.proxy.onProxyError.removeListener(listener),
    );
  }

  const uninstallErrorHandlers = () => uninstallers.forEach((f) => f());

  if (cb) {
    timeouted(cb)(uninstallErrorHandlers);
  }

  return uninstallErrorHandlers;
};

export { installTypedErrorEventListenersOn };
