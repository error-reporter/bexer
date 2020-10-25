/* eslint-disable no-console */
const Bexer = globalThis.Bexer;

console.log('Extension started.');
console.log('Bexer is:', Bexer);

Bexer.installErrorReporter({
  submissionOpts: {
    sendReportsToEmail: 'homerjsimpson@example.com',
    sendReportsInLanguages: ['en', 'ru'],
  },
});

globalThis.bar = function foo() {
  throw new Error('Err in BG');
};

console.log('Throwing error from bg! Notification is expected.');
globalThis.bar();
