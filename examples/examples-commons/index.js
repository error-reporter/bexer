/* eslint-disable no-console */
const Bexer = window.Bexer;

console.log('Extension started.');
console.log('Bexer is:', Bexer);

Bexer.installErrorReporter({
  toEmail: 'homerjsimpson@example.com',
  sendReportsInLanguages: ['en', 'ru'],
});

window.bar = function foo() {
  throw new Error('Err in BG');
};

console.log('Throwing error from bg! Notification is expected.');
window.bar();
