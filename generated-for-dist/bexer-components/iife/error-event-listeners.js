// Generated from package @bexer/error-event-listeners v0.0.5
this['BexerComponents.BexerComponents'] = this['BexerComponents.BexerComponents'] || {};
this.BexerComponents.errorEventListeners = (function (exports, Debug, utils, ErrorTypes) {
  'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var Debug__default = /*#__PURE__*/_interopDefaultLegacy(Debug);

  const getSettingsAsync = () =>
    new Promise((resolve) =>
      chrome.proxy.settings.get(
        {},
        utils.workOrDie(resolve),
      ));

  /**
    @param {chrome.types.ChromeSettingGetResultDetails} [details_]
    @returns {Promise<boolean>}
  */
  const areProxySettingsControlledAsync = async (details_) => {

    const details = details_ || await getSettingsAsync();
    return details.levelOfControl.startsWith('controlled_by_this');

  };

  const debug = Debug__default['default']('bexer:catcher');

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
    hostWindow = utils.mandatory(),
    typedErrorEventListener = utils.mandatory(),
    nameForDebug = generateNameForDebug(hostWindow),
    onlyTheseErrorTypes = [ErrorTypes.EXT_ERROR, ErrorTypes.PAC_ERROR],
  }, cb) => {

    const ifInBg = hostWindow === window;
    if (ifInBg) {
      utils.assert(
        nameForDebug === 'BG',
        `Background window can't have name other than "${bgName}" (default value).`,
      );
    } else {
      utils.assert(nameForDebug !== 'BG', 'nameForDebug "BG" is already assigned to the background window, choose something different.');
    }
    debug(ifInBg ? 'Installing handlers in BG.' : `Installing handlers in ${nameForDebug}.`);

    /** @type {Function[]} */
    const uninstallers = [];
    const ifExtErr = onlyTheseErrorTypes.includes(ErrorTypes.EXT_ERROR);
    if (ifExtErr) {
      /** @param {ErrorEvent} errorEvent */
      const errorHandler = (errorEvent) => {

        debug(nameForDebug, 'caught:', errorEvent);
        typedErrorEventListener(ErrorTypes.EXT_ERROR, errorEvent);
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

    const ifPacErr = onlyTheseErrorTypes.includes(ErrorTypes.PAC_ERROR);
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
        typedErrorEventListener(ErrorTypes.PAC_ERROR, details);
      };
      chrome.proxy.onProxyError.addListener(listener);
      uninstallers.push(() =>
        chrome.proxy.onProxyError.removeListener(listener),
      );
    }

    const uninstallErrorHandlers = () => uninstallers.forEach((f) => f());

    if (cb) {
      utils.timeouted(cb)(uninstallErrorHandlers);
    }

    return uninstallErrorHandlers;
  };

  exports.installTypedErrorEventListenersOn = installTypedErrorEventListenersOn;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;

}({}, BexerComponents.debug, BexerComponents.utils, BexerComponents.errorTypes));
