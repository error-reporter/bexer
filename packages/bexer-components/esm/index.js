// Generated from package @bexer/index v0.0.1
import { installGlobalHandlersOn, addGlobalHandler } from './global-error-event-handlers.js';
export { addGlobalHandler, installGlobalHandlersOn, installGlobalHandlersOnAsync } from './global-error-event-handlers.js';
import { installErrorNotifier } from './error-notifier.js';
import { installErrorSubmissionHandler, openErrorReporter, makeReport } from './error-reporter.js';
import { errorEventToPlainObject } from './error-transformer.js';
import { EXT_ERROR } from './error-types.js';
import * as Utils from './utils.js';
export { Utils };

/**
  @typedef {GetAllValuesOf<import('@bexer/commons/esm/error-types')>} ErrorTypes
*/

const { mandatory, assert } = Utils;

/**
  @param {ErrorTypes} errorType
  @param {ErrorEvent} errorEvent
  @returns {Promise<any>}
*/
const toPlainObjectAsync = async (
  errorType = mandatory(),
  errorEvent = mandatory(),
) => {

  if (errorType !== EXT_ERROR) {
    return errorEvent;
  }
  return errorEventToPlainObject(errorEvent);
};

installGlobalHandlersOn({
  hostWindow: window,
  nameForDebug: 'BG',
});

/**
  @param {{
    submissionOpts: {
      handler?: Function,
      sendReportsToEmail?: string,
      sendReportsInLanguages?: Array<string>,
    },
    ifToNotifyAboutAsync?: (
        errorType: ErrorTypes,
        errorEvent: ErrorEvent | chrome.proxy.ErrorDetails,
      ) => boolean,
  }} _
*/
const installErrorReporter = ({
  submissionOpts: {
    handler = undefined,
    sendReportsToEmail = handler ? undefined : mandatory(),
    sendReportsInLanguages = ['en'],
  },
  ifToNotifyAboutAsync = () => true,
}) => {

  assert(
    !(handler && sendReportsToEmail),
    'You have to pass either submission handler or sendReportsToEmail param, but never both.',
  );

  if (handler) {
    installErrorSubmissionHandler(handler);
  }

  const {
    notifyAboutError,
    uninstallErrorNotifier,
  } = installErrorNotifier();

  /**
    @param {ErrorTypes} errorType
    @param {ErrorEvent} errorEvent
  */
  const anotherGlobalHandler = async (errorType, errorEvent) => {

    const ifToNotify = await ifToNotifyAboutAsync(
      errorType,
      errorEvent,
    );
    if (!ifToNotify) {
      return;
    }
    notifyAboutError({
      errorType,
      errorEventLike: errorEvent,
      clickHandler: async () =>
        openErrorReporter({
          sendReportsToEmail,
          sendReportsInLanguages,
          errorTitle: errorEvent.message || errorEvent.error,
          report: makeReport({
            errorType,
            serializablePayload:
              await toPlainObjectAsync(errorType, errorEvent),
          }),
        }),
    });
  };

  const removeHandler = addGlobalHandler(anotherGlobalHandler, 'trusted');
  const uninstallErrorReporter = () => {

    uninstallErrorNotifier();
    removeHandler();
  };
  return uninstallErrorReporter;
};

export { installErrorReporter };
