import {
  installGlobalHandlersOn,
  installGlobalHandlersOnAsync,
  addGlobalHandler,
} from './global-error-event-handlers';
import { installErrorNotifier } from './error-notifier';
import {
  openErrorReporter,
  makeReport,
  installErrorSubmissionHandler,
} from './error-reporter';
import {
  errorEventToPlainObject,
} from './error-transformer';
import * as ErrorTypes from './error-types';
import * as Utils from './utils';

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
  @param {ErrorEventLike} errorEventLike
  @returns {Promise<any>}
*/
const toPlainObjectAsync = async (
  errorType = mandatory(),
  errorEventLike = mandatory(),
) => {

  if (errorType !== ErrorTypes.EXT_ERROR) {
    return errorEventLike;
  }
  return errorEventToPlainObject(errorEventLike);
};

/**
  @param {{
    submissionOpts: {
      handler?: Function | undefined,
      sendReportsToEmail?: string | undefined,
      sendReportsInLanguages?: Array<string>,
      onlyTheseErrorTypes?: ErrorTypesTS[],
    },
    ifToNotifyAboutAsync?: (
        errorType: ErrorTypesTS,
        errorEvent: ErrorEventLike,
      ) => boolean,
  }} _
*/
export const installErrorReporter = ({
  submissionOpts: {
    handler,
    sendReportsToEmail,
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
    @param {ErrorEventLike} errorEventLike
  */
  const anotherGlobalHandler = async (errorType, errorEventLike) => {

    try {
      const ifToNotify = await ifToNotifyAboutAsync(
        errorType,
        errorEventLike,
      );
      if (!ifToNotify) {
        return;
      }
    } catch(e) {
      // Notify about anohter, more important error.
      // TODO: notify about both errors.
      errorType = ErrorTypes.EXT_ERROR;
      errorEventLike = e;
    }
    notifyAboutError({
      errorType,
      errorEventLike,
      clickHandler: async () =>
        openErrorReporter({
          sendReportsToEmail,
          sendReportsInLanguages,
          errorTitle: errorEventLike.error && (errorEventLike.error.message || errorEventLike.error),
          report: makeReport({
            errorType,
            serializablePayload:
              await toPlainObjectAsync(errorType, errorEventLike),
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
      @param {ErrorEventLike} errorEventLike
      @param {ErrorTypesTS} errorType
    */
    notifyAbout: (errorEventLike, errorType = ErrorTypes.EXT_ERROR) => {

      anotherGlobalHandler(errorType, errorEventLike);
    },
  };
};
