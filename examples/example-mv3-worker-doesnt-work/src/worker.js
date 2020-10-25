importScripts(a);

this.Bexer.addGlobalHandler((errorType, errorEvent) => {

  console.log('Global handler caught:', errorType, errorEvent);
  this.lastErrorEvent = errorEvent;
});

this.Bexer.installErrorReporter({
  submissionOpts: {
    sendReportsToEmail: 'ilyaigpetrov+bexer-test@gmail.com',
    sendReportsInLanguages: ['en', 'ru'],
  }
});

console.log('Extension started.');

this.bar = function foo() {
  throw new Error('Err in BG');
};

console.log('Throwing error from bg! Notification is expected.');
this.bar();
