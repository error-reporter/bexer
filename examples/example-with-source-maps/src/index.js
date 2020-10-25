globalThis.Bexer.addGlobalHandler((errorType, errorEvent) => {

  console.log('Global handler caught:', errorType, errorEvent);
  globalThis.lastErrorEvent = errorEvent;
});

globalThis.Bexer.installErrorReporter({
  submissionOpts: {
    handler: async ({ report }) => {

      console.log('REPORT HANDLER RECEIVED:', report);
    },
  },
  // toEmail: 'ilyaigpetrov+bexer-test@gmail.com',
  // sendReportsInLanguages: ['ru'],
});

console.log('Extension started.');

globalThis.bar = function foo() {
  throw new Error('Err in BG');
};

console.log('Throwing error from bg! Notification is expected.');
globalThis.bar();
