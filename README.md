# Bexer

![Bexer screenshot](./bexer-screenshot-double.png)

[![Build Status](https://travis-ci.org/error-reporter/bexer.svg?branch=master)](https://travis-ci.org/error-reporter/bexer)

> Web Extensions Error Reporter catches global errors, shows notifications and opens error reporter in one click

[Report page demo](https://error-reporter.github.io/v0/error/view/?title=Err%20in%20BG&json=%7B"payload"%3A%7B"message"%3A"Uncaught%20Error%3A%20Err%20in%20BG"%2C"filename"%3A"chrome-extension%3A%2F%2Fnjhjpcpfmgloiakfbipnjghcanjllmec%2Findex.js"%2C"lineno"%3A10%2C"colno"%3A3%2C"type"%3A"error"%2C"error"%3A%7B"name"%3A"Error"%2C"message"%3A"Err%20in%20BG"%2C"stack"%3A"Error%3A%20Err%20in%20BG%5Cn%20%20%20%20at%20foo%20%28chrome-extension%3A%2F%2Fnjhjpcpfmgloiakfbipnjghcanjllmec%2Findex.js%3A10%3A9%29%5Cn%20%20%20%20at%20chrome-extension%3A%2F%2Fnjhjpcpfmgloiakfbipnjghcanjllmec%2Findex.js%3A14%3A1"%7D%7D%2C"errorType"%3A"ext-error"%2C"extName"%3A"Bexer%20Test"%2C"version"%3A"0.0.0.1"%2C"userAgent"%3A"Mozilla%2F5.0%20%28X11%3B%20Linux%20x86_64%29%20AppleWebKit%2F537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome%2F60.0.3112.90%20Safari%2F537.36"%2C"platform"%3A"Linux%20x86_64"%7D#toEmail=DONT_REPORT_PLEASE)

## Table of Contents

- [Why](#why)
  - [Catching Errors Without Bexer](#catching-errors-without-bexer)
  - [Bexer in a Background Script](#bexer-in-a-background-script)
  - [Bexer in a Non-Background Script](#bexer-in-a-non-background-script)
- [Install](#install)
- [Usage](#usage)
  - [Formats](#formats)
  - [Import](#import)
    - [With Bundler](#with-bundler)
    - [Without Bundler](#without-bundler)
  - [Setup](#setup)
    - [Permissions in manifest.json](#permissions-in-manifestjson)
    - [BG Window](#bg-window)
  - [Debugging](#debugging)
  - [Examples of Setups](#examples-of-setups)
  - [Demo](#demo)
- [Supported Browsers](#supported-browsers)
- [API](#api)
- [Maintainer](#maintainer)
- [Contribute](#contribute)
- [Credits](#credits)
- [License](#license)

# Why

## Catching Errors Without Bexer

There is some mess in how you catch errors in a web-extension:

```js
'use strict'; // Only if you don't use ES6 modules.
/*
  bg-window — background window, main window of a web-extension.
  non-bg-windows — popup, settings and other pages windows of a web-extension, that are not bg-window.
*/

window.addEventListener('error', (errorEvent) => {/* ... */});

// Case 1
throw new Error('Root (caught only in bg-window, not caught in non-bg windows');

// Case 2
setTimeout(
  () => { throw new Error('Timeouted root (caught by handlers'); },
  0,
);

// Case 3
chrome.tabs.getCurrent(() => {

  throw new Error('Chrome API callback (not caught by handlers)');

});

// Case 4
chrome.tabs.getCurrent(() => setTimeout(() => {

  throw new Error('Timeouted Chrome API callback (caught by handlers)');

}, 0));

// Case 5
chrome.tabs.getCurrent(async () => {

  throw new Error(
    'Async Chrome API callback (caught by handlers in Chrome, not caught in FireFox even if timeouted)',
  );

});
```
So if you want error catchers to work — your code must be wrapped in `setTimeout`.

This behavior may be a bug and is discussed in https://crbug.com/357568.

Now let's look how to catch errors with Bexer.

## Bexer in a Background Script

```js
'use strict'; // Only if you don't use ES6 modules.
// Import and setup Bexer here, see corresponding paragraphs below.

throw new Error('This is caught by Bexer, notification is shown, opens error reporter on click');
```

## Bexer in a Non-Background Script

```js
// In popup, settings and other pages.
'use strict'; // Only if you don't use ES6 modules.

chrome.runtime.getBackgroundPage((bgWindow) =>
  bgWindow.Bexer.ErrorCatchers.installListenersOn({ hostWindow: window, nameForDebug: 'PUP' }, () => {

    // Put all your code inside this arrow body (it is timeouted).

    // Case 1:
    throw new Error('PUPERR (caught by Bexer)');

    // Case 2:
    document.getElementById('btn').onclick = () => {

      throw new Error('ONCLCK! (caught by Bexer)');

    };

    // Case 3:
    chrome.tabs.getCurrent(Bexer.Utils.timeouted(() => {

      throw new Error('Timeouted Chrome API callback (caught by Bexer)');

    }));

  })
);

// Case 4:
chrome.tabs.getCurrent(Bexer.Utils.timeouted(() => {

  throw new Error('Timeouted Chrome API callback (caught by Bexer)');

}));

// Case 5
chrome.tabs.getCurrent(async () => {

  throw new Error(
    'Async Chrome API callback (caught by Bexer in Chrome, never caught in FireFox even if timeouted)',
  );

});
```

## Install

`npm install --save bexer`

## Usage

### Formats

```console
tree ./node_modules/bexer
bexer/
├── cjs // Common JS format: `require(...)`
│   ├── error-catchers.js
│   ├── get-notifiers-singleton.js
│   ├── index.js
│   └── utils.js
├── esm // EcmaScript Modules format: `import ...`
│   ├── error-catchers.js
│   ├── get-notifiers-singleton.js
│   ├── index.js
│   └── utils.js
├── package.json
└── umd // Universal Module Definition format: `<script src=...></script>`
    ├── error-catchers.js // Requires `utils` bundle
    ├── get-notifiers-singleton.js // Requires `utils` bundle
    ├── index.js // All in one bundle, no dependencies
    └── utils.js
```
### Import

#### With Bundler

For webpack, rollup, etc.

```js
import Bexer from 'bexer';
```

If you need only a part of the API:

```js
import Utils from 'bexer/esm/utils';
import ErrorCatchers from 'bexer/esm/error-catchers';
import GetNotifiersSingleton from 'bexer/esm/get-notifiers-singleton';
```

#### Without Bundler

```console
$ cp ./node_modules/bexer/umd/index.js ./foo-extension/vendor/bexer.js
$ cat foo-extension/manifest.json
...
"scripts": [
  "./vendor/optional-debug.js",
  "./vendor/bexer.js",
  ...
],
...
```

### Setup

#### Permissions in manifest.json

```json
"permissions": [
  "notifications",
  ...
],
```

#### BG Window

```js
'use strict'; // Only if you don't use ES6 modules.
// For EcmaScript modules (node_modules/bexer/esm) and CommonJS (node_modules/bexer/cjs):
//   1. Import Bexer somehow.
//   2. window.Bexer = Bexer; // Expose for non-bg windows (popup, settings, etc.).

Bexer.install({
  // Required:
  sendReports: {
    toEmail: 'homerjsimpson@example.com',
    inLanguages: ['en'], // In what languages to show report template.
  },
  // Optional:
  extErrorIconUrl: 'https://example.com/img/ext-error-128.png',
  pacErrorIconUrl: 'https://example.com/img/pac-error-128.png',
  maskIconUrl: 'https://example.com/img/mask-128.png',
});
```

### Debugging

1. Bundle [visionmedia/debug] for your environment and export global `debug`.
2. Enable it by `debug.enable('bexer:*')` in extension background window and reload extension.

[visionmedia/debug]: https://github.com/visionmedia/debug


### Examples of Setups

See [examples](./examples) of setups for webpack, rollup or without bundlers.

### Demo

```
clone this repo
npm install
cd examples
npm start
ls dist <- Load as unpacked extension and play (tested on Chrome).
```

## Supported Browsers

Chrome: yes.  
Firefox: yes, but notifications are not sticky, unhandled proimise rejections are [never] caught, clicking notifications [sometimes doesn't work](https://bugzilla.mozilla.org/show_bug.cgi?id=1488247).

[never]: https://developer.mozilla.org/en-US/docs/Web/Events/unhandledrejection#Browser_compatibility


## API

See [API.md](./API.md).

## Maintainer

- [ilyaigpetrov]

## Contribute

You are welcome to propose [issues](https://github.com/error-reporter/bexer/issues), pull requests or ask questions.  
__By commiting your code you agree to give all the rights on your contribution to [ilyaigpetrov].__ E.g. he may publish code with your contributions under license different from GPL (proprietary, etc.).

## Credits

For credits of used assets see https://github.com/error-reporter/error-reporter.github.io

## License

This product is dual-licensed under GPL-3.0+ and commercial license, see [LICENSE.md](./LICENSE.md).
To obtain commercial license contact [ilyaigpetrov].

[ilyaigpetrov]: https://github.com/ilyaigpetrov
