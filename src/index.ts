import {
  installGlobalHandlersOn,
  installGlobalHandlersOnAsync,
  addGlobalHandler,
} from './global-error-event-handlers.js';
import { installErrorNotifier } from './error-notifier.js';
import {
  openErrorReporter,
  makeReport,
  installErrorSubmissionHandler,
} from './error-reporter.js';
import {
  errorEventToPlainObject,
} from './error-transformer.js';
import * as ErrorTypes from './error-types.js';
import * as Utils from './utils.js';

const { mandatory, assert } = Utils;

export {
  ErrorTypes,
  Utils,
  installGlobalHandlersOn,
  installGlobalHandlersOnAsync,
  addGlobalHandler,
};

const toPlainObjectAsync = async (
  errorType: ErrorTypesTS = mandatory(),
  errorEventLike: ErrorEventLike = mandatory(),
): Promise<any> => {

  if (errorType !== ErrorTypes.EXT_ERROR) {
    return errorEventLike;
  }
  return errorEventToPlainObject(errorEventLike);
};

export const installErrorReporter = ({
  submissionOpts: {
    handler,
    sendReportsToEmail,
    sendReportsInLanguages = ['en'],
    onlyTheseErrorTypes,
  },
  ifToNotifyAboutAsync = () => true,
}: {
    submissionOpts: {
      handler?: Function | undefined; sendReportsToEmail?: string | undefined; sendReportsInLanguages?: Array<string>;
      onlyTheseErrorTypes?: ErrorTypesTS[];
    };
    ifToNotifyAboutAsync?: (
      errorType: ErrorTypesTS,
      errorEvent: ErrorEventLike
    ) => boolean;
  }) => {

  assert(
    !(handler && sendReportsToEmail),
    'You have to pass either submission handler or sendReportsToEmail param, but never both.',
  );

  const detachGlobalHandlers = installGlobalHandlersOn({
    hostWindow: globalThis,
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

  const anotherGlobalHandler = async (errorType: ErrorTypesTS, errorEventLike: ErrorEventLike) => {

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
    notifyAbout: (errorEventLike: ErrorEventLike, errorType: ErrorTypesTS = ErrorTypes.EXT_ERROR) => {

      anotherGlobalHandler(errorType, errorEventLike);
    },
  };
};
