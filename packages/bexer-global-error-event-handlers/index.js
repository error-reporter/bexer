import { installTypedErrorEventListenersOn } from '@bexer/error-event-listeners';
import { mandatory } from '@bexer/utils';
/**
  @typedef {GetAllValuesOf<import('@bexer/commons/error-types')>} ErrorTypes
  @typedef {
    (_: ErrorTypes, __: ErrorEvent | chrome.proxy.ErrorDetails) => any
  } ErrorHandler
*/

/*
 In this file we will be using term handler instead of listener.
 Listener term is already used in error-event-listners module.
 I hope it will make it easier to distinct methods of one API from another.
*/
/**
  @type {Array<ErrorHandler>}
*/
let globalTypedErrorEventHandlers = [];

/**
  @param {ErrorHandler} handler
*/
export const addGlobalHandler = (handler = mandatory()) => {

  globalTypedErrorEventHandlers.push(handler);
  const removeHandler = () => {

    globalTypedErrorEventHandlers = globalTypedErrorEventHandlers.filter(
      (otherHandler) => otherHandler !== handler,
    );
  };
  return removeHandler;
};

/** @type {ErrorHandler} */
const triggerGlobalHandlers = (...args) =>
  globalTypedErrorEventHandlers.forEach((handler) => handler(...args));

/**
  @typedef {{
    hostWindow: Window,
    nameForDebug: string,
  }} TargetWindowOpts
  @param {TargetWindowOpts} opts
  @param {(_: Function) => any} [cb]
*/
export const installGlobalHandlersOn = (
  { hostWindow, nameForDebug },
  cb,
) => {
  const uninstallGlobalHandlers = installTypedErrorEventListenersOn(
    {
      hostWindow,
      nameForDebug,
      typedErrorEventListener: triggerGlobalHandlers,
    },
    cb,
  );
  return uninstallGlobalHandlers;
};

/**
 @param {TargetWindowOpts} opts
*/
export const installGlobalHandlersOnAsync = (opts) =>
  new Promise((resolve) =>
    installGlobalHandlersOn(
      opts,
      resolve,
    ));
