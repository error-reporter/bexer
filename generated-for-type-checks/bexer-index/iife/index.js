// Generated from package @bexer/index v0.0.7
this['BexerComponents.BexerComponents'] = this['BexerComponents.BexerComponents'] || {};
this.BexerComponents.index = (function (exports, globalErrorEventHandlers, errorNotifier, errorReporter, errorTransformer, ErrorTypes, Utils) {
  'use strict';

  function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
      Object.keys(e).forEach(function (k) {
        if (k !== 'default') {
          var d = Object.getOwnPropertyDescriptor(e, k);
          Object.defineProperty(n, k, d.get ? d : {
            enumerable: true,
            get: function () {
              return e[k];
            }
          });
        }
      });
    }
    n['default'] = e;
    return Object.freeze(n);
  }

  var ErrorTypes__namespace = /*#__PURE__*/_interopNamespace(ErrorTypes);
  var Utils__namespace = /*#__PURE__*/_interopNamespace(Utils);

  const { mandatory, assert } = Utils__namespace;

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
    return errorTransformer.errorEventToPlainObject(errorEventLike);
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
  const installErrorReporter = ({
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

    const detachGlobalHandlers = globalErrorEventHandlers.installGlobalHandlersOn({
      hostWindow: window,
      nameForDebug: 'BG',
      onlyTheseErrorTypes,
    });

    if (handler) {
      errorReporter.installErrorSubmissionHandler(handler);
    }

    const {
      notifyAboutError,
      uninstallErrorNotifier,
    } = errorNotifier.installErrorNotifier();

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
          errorReporter.openErrorReporter({
            sendReportsToEmail,
            sendReportsInLanguages,
            errorTitle: errorEventLike.error && (errorEventLike.error.message || errorEventLike.error),
            report: errorReporter.makeReport({
              errorType,
              serializablePayload:
                await toPlainObjectAsync(errorType, errorEventLike),
            }),
          }),
      });
    };

    const removeHandler = globalErrorEventHandlers.addGlobalHandler(anotherGlobalHandler, 'trusted');
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

  Object.defineProperty(exports, 'addGlobalHandler', {
    enumerable: true,
    get: function () {
      return globalErrorEventHandlers.addGlobalHandler;
    }
  });
  Object.defineProperty(exports, 'installGlobalHandlersOn', {
    enumerable: true,
    get: function () {
      return globalErrorEventHandlers.installGlobalHandlersOn;
    }
  });
  Object.defineProperty(exports, 'installGlobalHandlersOnAsync', {
    enumerable: true,
    get: function () {
      return globalErrorEventHandlers.installGlobalHandlersOnAsync;
    }
  });
  exports.ErrorTypes = ErrorTypes__namespace;
  exports.Utils = Utils__namespace;
  exports.installErrorReporter = installErrorReporter;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;

}({}, BexerComponents.globalErrorEventHandlers, BexerComponents.errorNotifier, BexerComponents.errorReporter, BexerComponents.errorTransformer, BexerComponents.errorTypes, BexerComponents.utils));
