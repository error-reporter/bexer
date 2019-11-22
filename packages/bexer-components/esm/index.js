// Generated from package @bexer/index v0.0.7
import { installGlobalHandlersOn, addGlobalHandler } from './global-error-event-handlers.js';
export { addGlobalHandler, installGlobalHandlersOn, installGlobalHandlersOnAsync } from './global-error-event-handlers.js';
import { installErrorNotifier } from './error-notifier.js';
import { installErrorSubmissionHandler, openErrorReporter, makeReport } from './error-reporter.js';
import { errorEventToPlainObject } from './error-transformer.js';
import { EXT_ERROR } from './error-types.js';
import * as ErrorTypes from './error-types.js';
export { ErrorTypes };
import * as Utils from './utils.js';
export { Utils };

/**
  @typedef {GetAllValuesOf<typeof ErrorTypes>} ErrorTypesTS
*/

const { mandatory, assert } = Utils;

/**
  @param {ErrorTypesTS} errorType
  @param {ErrorEventLike} errorEventLike
  @returns {Promise<any>}
*/
const toPlainObjectAsync = async (
  errorType = mandatory(),
  errorEventLike = mandatory(),
) => {

  if (errorType !== EXT_ERROR) {
    return errorEventLike;
  }
  return errorEventToPlainObject(errorEventLike);
};

/**
  @typedef {Function | undefined} FunctionOrUndefined
  @typedef {string | undefined} stringOrUndefined
  @param {{
    submissionOpts: {
      handler: FunctionOrUndefined,
      sendReportsToEmail: stringOrUndefined,
      sendReportsInLanguages?: Array<string>,
      onlyTheseErrorTypes?: ErrorTypesTS[],
    },
    ifToNotifyAboutAsync?: (
        errorType: ErrorTypesTS,
        errorEvent: ErrorEventLike,
      ) => boolean,
  }} _
*/
const installErrorReporter = ({
  submissionOpts: {
    handler,
    sendReportsToEmail = handler || mandatory(),
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
      errorType = EXT_ERROR;
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
    notifyAbout: (errorEventLike, errorType = EXT_ERROR) => {

      anotherGlobalHandler(errorType, errorEventLike);
    },
  };
};

export { installErrorReporter };
