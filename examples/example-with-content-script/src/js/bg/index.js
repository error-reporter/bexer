'use strict';

{
  console.log('Extension started.');

  chrome.browserAction.onClicked.addListener((activeTab) => {
    chrome.tabs.create({ url: 'https://github.com/error-reporter/bexer/' });
  });

  window.Bexer.addGlobalHandler((errorType, errorEvent) => {
    console.log('Global handler caught:', errorType, errorEvent);
    window.lastErrorEvent = errorEvent;
  });

  const { notifyAbout } = window.Bexer.installErrorReporter({
    submissionOpts: {
      sendReportsToEmail: 'foobar@example.com',
      sendReportsInLanguages: ['en', 'ru'],
    },
  });

  chrome.runtime.onMessage.addListener(Bexer.Utils.timeouted(
    (request /* , sender, sendResponse */) => {
      if (request.type === 'error') {
        notifyAbout(request.errorEvent);
      }
    },
  ));
}
