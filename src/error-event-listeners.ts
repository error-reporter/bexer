import Debug from './private/debug.js';
import { mandatory, assert, timeouted } from './utils.js';
import * as ErrorTypes from './error-types.js';
import { areProxySettingsControlledAsync } from './private/proxy-settings.js';

const debug = Debug('bexer:catcher');

const bgName = 'BG';
const generateNameForDebug = (hostWindow: typeof globalThis) => {

  if (hostWindow === globalThis) {
    return bgName;
  }
  return hostWindow.location.href
    .replace(/^.+\//, '')
    .replace(/.html$/, '')
    .toUpperCase();
};

export const installTypedErrorEventListenersOn = ({
  hostWindow = mandatory(),
  typedErrorEventListener = mandatory(),
  nameForDebug = generateNameForDebug(hostWindow),
  onlyTheseErrorTypes = [ErrorTypes.EXT_ERROR, ErrorTypes.PAC_ERROR],
}: {
  hostWindow: typeof globalThis;
  typedErrorEventListener: (
    _: ErrorTypesTS,
    __: ErrorEvent | chrome.proxy.ErrorDetails,
  ) => unknown;
  nameForDebug?: string;
  onlyTheseErrorTypes?: ErrorTypesTS[],
// eslint-disable-next-line @typescript-eslint/ban-types
}, cb?: Function): () => void => {

  const ifInBg = hostWindow === globalThis;
  if (ifInBg) {
    assert(
      nameForDebug === 'BG',
      `Background window can't have name other than "${bgName}" (default value).`,
    );
  } else {
    assert(nameForDebug !== 'BG', 'nameForDebug "BG" is already assigned to the background window, choose something different.');
  }
  debug(ifInBg ? 'Installing handlers in BG.' : `Installing handlers in ${nameForDebug}.`);

  // eslint-disable-next-line @typescript-eslint/ban-types
  const uninstallers: Function[] = [];
  const ifExtErr = onlyTheseErrorTypes.includes(ErrorTypes.EXT_ERROR);
  if (ifExtErr) {
    const errorHandler = (errorEvent: ErrorEvent) => {

      debug(nameForDebug, 'caught:', errorEvent);
      typedErrorEventListener(ErrorTypes.EXT_ERROR, errorEvent);
    };

    const ifUseCapture = true;
    hostWindow.addEventListener('error', errorHandler, ifUseCapture);
    uninstallers.push(() =>
      hostWindow.removeEventListener('error', errorHandler, ifUseCapture),
    );
    const rejHandler = (event: PromiseRejectionEvent): void => {

      event.preventDefault();
      debug(nameForDebug, 'rethrowing promise...');
      throw event.reason;

    };

    hostWindow.addEventListener('unhandledrejection', rejHandler, ifUseCapture);
    uninstallers.push(() =>
      hostWindow.removeEventListener('unhandledrejection', rejHandler, ifUseCapture),
    );
  }

  const ifPacErr = onlyTheseErrorTypes.includes(ErrorTypes.PAC_ERROR);
  if (chrome.proxy && ifInBg && ifPacErr) {
    const listener = async (details: chrome.proxy.ErrorDetails) => {

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
      typedErrorEventListener(ErrorTypes.PAC_ERROR, details);
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
