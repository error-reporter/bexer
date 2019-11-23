// Generated from package @bexer/global-error-event-handlers v0.0.5
this['BexerComponents.BexerComponents'] = this['BexerComponents.BexerComponents'] || {};
this.BexerComponents.globalErrorEventHandlers = (function (exports, errorEventListeners, utils, ErrorTypes) {
  'use strict';

  /**
    @typedef {
      (_: ErrorTypesTS, __: ErrorEvent | chrome.proxy.ErrorDetails) => any
    } ErrorHandler
  */

  /*
   In this file we will be using term handler instead of listener.
   Listener term is already used in error-event-listners module.
   I hope it will make it easier to distinct methods of one API from another.
  */
  /**
    @type {{ [key: string]: Array<ErrorHandler> }}
  */
  let globalTypedErrorEventHandlers = {
    trusted: [],
    untrusted: [],
  };

  /**
    @param {ErrorHandler} handler
    @param {string} [category]
  */
  const addGlobalHandler = (
    handler = utils.mandatory(),
    category = 'untrusted',
  ) => {

    globalTypedErrorEventHandlers[category].push(handler);
    const removeHandler = () => {

      globalTypedErrorEventHandlers[category] = globalTypedErrorEventHandlers[category].filter(
        (otherHandler) => otherHandler !== handler,
      );
    };
    return removeHandler;
  };

  /** @type {ErrorHandler} */
  const triggerTrusted = (...args) =>
    globalTypedErrorEventHandlers['trusted'].forEach((handler) => handler(...args));

  /** @type {ErrorHandler} */
  const triggerGlobalHandlers = (...args) => {

    triggerTrusted(...args);
    globalTypedErrorEventHandlers['untrusted'].forEach((handler) => {

      try {
        handler(...args);
      } catch(e) {
        triggerTrusted(ErrorTypes.EXT_ERROR, e);
      }
    });
  };

  /**
    @typedef {{
      hostWindow: Window,
      nameForDebug: string,
      onlyTheseErrorTypes?: ErrorTypesTS[],
    }} TargetWindowOpts
    @param {TargetWindowOpts} opts
    @param {(_: Function) => any} [cb]
  */
  const installGlobalHandlersOn = (
    {
      hostWindow,
      nameForDebug,
      onlyTheseErrorTypes,
    },
    cb,
  ) => {
    const uninstallGlobalHandlers = errorEventListeners.installTypedErrorEventListenersOn(
      {
        hostWindow,
        nameForDebug,
        typedErrorEventListener: triggerGlobalHandlers,
        onlyTheseErrorTypes,
      },
      cb,
    );
    return uninstallGlobalHandlers;
  };

  /**
   @param {TargetWindowOpts} opts
  */
  const installGlobalHandlersOnAsync = (opts) =>
    new Promise((resolve) =>
      installGlobalHandlersOn(
        opts,
        resolve,
      ));

  exports.addGlobalHandler = addGlobalHandler;
  exports.installGlobalHandlersOn = installGlobalHandlersOn;
  exports.installGlobalHandlersOnAsync = installGlobalHandlersOnAsync;

  return exports;

}({}, BexerComponents.errorEventListeners, BexerComponents.utils, BexerComponents.errorTypes));
