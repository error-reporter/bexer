import { installTypedErrorEventListenersOn } from './error-event-listeners.js';
import { mandatory } from './utils.js';
import * as ErrorTypes from './error-types.js';
type ErrorHandler = {
  (_: ErrorTypesTS, __: ErrorEvent | chrome.proxy.ErrorDetails): any
};

/*
 In this file we will be using term handler instead of listener.
 Listener term is already used in error-event-listners module.
 I hope it will make it easier to distinct methods of one API from another.
*/
let globalTypedErrorEventHandlers: { [key: string]: Array<ErrorHandler>; } = {
  trusted: [],
  untrusted: [],
}

export const addGlobalHandler = (
  handler: ErrorHandler = mandatory(),
  category: string = 'untrusted',
) => {

  globalTypedErrorEventHandlers[category].push(handler);
  const removeHandler = () => {

    globalTypedErrorEventHandlers[category] = globalTypedErrorEventHandlers[category].filter(
      (otherHandler) => otherHandler !== handler,
    );
  };
  return removeHandler;
};

const triggerTrusted: ErrorHandler = (...args) =>
  globalTypedErrorEventHandlers['trusted'].forEach((handler) => handler(...args));

const triggerGlobalHandlers: ErrorHandler = (...args) => {

  triggerTrusted(...args);
  globalTypedErrorEventHandlers['untrusted'].forEach((handler) => {

    try {
      handler(...args);
    } catch(e) {
      triggerTrusted(ErrorTypes.EXT_ERROR, e);
    }
  });
};

type TargetWindowOpts = {
  hostWindow: typeof globalThis,
  nameForDebug: string,
  onlyTheseErrorTypes?: ErrorTypesTS[],
};
export const installGlobalHandlersOn = (
  {
    hostWindow,
    nameForDebug,
    onlyTheseErrorTypes,
  }: TargetWindowOpts,
  cb?: Function,
) => {
  const uninstallGlobalHandlers = installTypedErrorEventListenersOn(
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

export const installGlobalHandlersOnAsync = (opts: TargetWindowOpts) =>
  new Promise((resolve) =>
    installGlobalHandlersOn(
      opts,
      resolve,
    ));
