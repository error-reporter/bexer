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
import { EXT_ERROR } from '@bexer/commons/error-types';
import * as Utils from '@bexer/utils';

const { mandatory, assert } = Utils;

export {
  Utils,
  installGlobalHandlersOn,
  installGlobalHandlersOnAsync,
  addGlobalHandler,
};

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

export const installErrorReporter = ({
  submissionOpts: {
    handler,
    sendReportsToEmail = handler ? undefined : mandatory(),
    sendReportsInLanguages = ['en'],
  } = {},
  ifToNotifyAboutAsync = (/* errorType, errorEvent */) => true,
} = {}) => {

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

  const removeHandler = addGlobalHandler(anotherGlobalHandler);
  const uninstallErrorReporter = () => {

    uninstallErrorNotifier();
    removeHandler();
  };
  return uninstallErrorReporter;
};
