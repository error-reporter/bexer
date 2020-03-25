'use strict';
{
  const tunnel = (msg) => new Promise((resolve) => (
    chrome.runtime.sendMessage(msg, Bexer.Utils.workOrDie(resolve))
  ));

  window.addEventListener('error', (event) => {
    if (!event.filename || !event.filename.endsWith('inject.js')) {
      return;
    }
    const plainObject = Bexer.ErrorTransformer.errorEventToPlainObject(event);
    console.log('Sending error to bg...');
    tunnel({
      type: 'error',
      errorEvent: plainObject,
    });
  });

  setInterval(() => { throw new Error('SOME ERROR'); }, 3000);
}
