import {
  installGlobalHandlersOn,
  installGlobalHandlersOnAsync,
  addGlobalHandler,
} from '@bexer/global-error-event-handlers';
import { installErrorNotifier } from '@bexer/error-notifier';
import {
  openErrorReporter,
  makeReport,
  installErrorSubmissionHandler,
} from '@bexer/error-reporter';
import {
  errorEventToPlainObject,
} from '@bexer/error-transformer';
import * as ErrorTypes from '@bexer/commons/esm/error-types';
import * as Utils from '@bexer/utils';

/**
  @typedef {GetAllValuesOf<typeof ErrorTypes>} ErrorTypesTS
*/

const { mandatory, assert } = Utils;

export {
  ErrorTypes,
  Utils,
  installGlobalHandlersOn,
  installGlobalHandlersOnAsync,
  addGlobalHandler,
};

/**
  @param {ErrorTypesTS} errorType
  @param {ErrorEvent} errorEvent
  @returns {Promise<any>}
*/
const toPlainObjectAsync = async (
  errorType = mandatory(),
  errorEvent = mandatory(),
) => {

  if (errorType !== ErrorTypes.EXT_ERROR) {
    return errorEvent;
  }
  return errorEventToPlainObject(errorEvent);
};

/**
  @param {{
    submissionOpts: {
      handler?: Function,
      sendReportsToEmail?: string,
      sendReportsInLanguages?: Array<string>,
      onlyTheseErrorTypes?: ErrorTypesTS[],
    },
    ifToNotifyAboutAsync?: (
        errorType: ErrorTypesTS,
        errorEvent: ErrorEvent | chrome.proxy.ErrorDetails,
      ) => boolean,
  }} _
*/
export const installErrorReporter = ({
  submissionOpts: {
    handler = undefined,
    sendReportsToEmail = handler ? undefined : mandatory(),
    sendReportsInLanguages = ['en'],
    onlyTheseErrorTypes,
  },
  ifToNotifyAboutAsync = () => true,
}) => {

  assert(
    !(handler && sendReportsToEmail),
    'You have to pass either submission handler or sendReportsToEmail param, but never both.',
  );

  const detachGlobalHandlers = installGlobalHandlersOn({
    hostWindow: window,
    nameForDebug: 'BG',
    onlyTheseErrorTypes,
  });

  if (handler) {
    installErrorSubmissionHandler(handler);
  }

  const {
    notifyAboutError,
    uninstallErrorNotifier,
  } = installErrorNotifier();

  /**
    @param {ErrorTypesTS} errorType
    @param {ErrorEvent} errorEvent
  */
  const anotherGlobalHandler = async (errorType, errorEvent) => {

    try {
      const ifToNotify = await ifToNotifyAboutAsync(
        errorType,
        errorEvent,
      );
      if (!ifToNotify) {
        return;
      }
    } catch(e) {
      // Notify about anohter, more important error.
      // TODO: notify about both errors.
      errorType = ErrorTypes.EXT_ERROR;
      errorEvent = e;
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
    detachGlobalHandlers();
  };
  return {
    uninstallErrorReporter,
    /**
      @param {ErrorEvent} errorEvent
      @param {ErrorTypesTS} errorType
    */
    notifyAbout: (errorEvent, errorType = ErrorTypes.EXT_ERROR) =>
      anotherGlobalHandler(errorType, errorEvent),
  };
};
