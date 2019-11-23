// Generated from package @bexer/error-reporter v0.0.5
this['BexerComponents.BexerComponents'] = this['BexerComponents.BexerComponents'] || {};
this.BexerComponents.errorReporter = (function (exports, utils) {
  'use strict';

  const manifest = chrome.runtime.getManifest();

  /** @param {Function} handler */
  const installErrorSubmissionHandler = (handler) =>
    chrome.runtime.onMessage.addListener(
      utils.timeouted({
        /*
  Returned value matters, see
  https://developer.chrome.com/extensions/runtime#event-onMessage

  > This function becomes invalid when the event listener returns,
  > unless you return true from the event listener to indicate
  > you wish to send a response asynchronously
        */
        returnValue: true,
        // Don't make cb async, because FireFox doesn't catch promise rejections.
        /**
          @param {{ action: 'SEND_REPORT' }} request
          @param {any} sender
          @param {Function} sendResponse
        */
        cb: (request, sender, sendResponse) => {

          if (request.action !== 'SEND_REPORT') {
            return;
          }
          try {
            const res = handler(request);
            Promise.resolve(res).then(
              (result) => sendResponse({ ok: true, result }),
              (error) => { throw error; },
            );
          } catch (error) {
            sendResponse({ error });
            // Global handlers must handle it, don't suppress this error.
            throw error;
          }
        },
      }),
    );

  /**
    @param {{
      errorType?: ErrorTypesTS,
      serializablePayload: JsonObject,
    }} _
  */
  const makeReport = ({
    errorType,
    serializablePayload = utils.mandatory(),
  }) => ({
    payload: serializablePayload,
    extName: manifest.name,
    version: manifest.version,
    errorType,
    userAgent: navigator.userAgent,
    platform: navigator.platform,
  });

  /**
    @param {{
      ifSubmissionHandlerInstalled?: boolean,
      sendReportsToEmail?: string,
      sendReportsInLanguages?: Array<string>,
      errorTitle: string,
      report: {
        extName: string,
        version: string,
        payload: JsonObject,
      },
    }} _
  */
  const openErrorReporter = ({
    ifSubmissionHandlerInstalled,
    sendReportsToEmail,
    sendReportsInLanguages = ['en'],
    errorTitle = utils.mandatory(),
    report = utils.mandatory(),
  }) => {

    utils.assert(
      !(ifSubmissionHandlerInstalled && sendReportsToEmail),
      'Either you handle submission via providing an email or you install a handler, but never both.',
    );

    utils.assert(
      report.extName && report.version && report.payload,
      'Report must include .extName (extension name), .version and .payload!'
      + ` You supplied report: ${JSON.stringify(report, null, 2)}.`,
    );

    const json = JSON.stringify(report);
    const url = `${
    'https://error-reporter.github.io/v0/error/view/?title={{errorTitle}}&json={{json}}&reportLangs={{reportLangs}}'
      .replace('{{errorTitle}}', encodeURIComponent(errorTitle))
      .replace('{{json}}', encodeURIComponent(json))
      .replace(
        '{{reportLangs}}',
        encodeURIComponent(sendReportsInLanguages.join(',')),
      )
  }${
    sendReportsToEmail
      ? `#toEmail=${encodeURIComponent(sendReportsToEmail)}`
      : ''
  }`;

    chrome.tabs.create(
      { url },
      (tab) => chrome.windows.update(tab.windowId, { focused: true }),
    );
  };

  exports.installErrorSubmissionHandler = installErrorSubmissionHandler;
  exports.makeReport = makeReport;
  exports.openErrorReporter = openErrorReporter;

  return exports;

}({}, BexerComponents.utils));
