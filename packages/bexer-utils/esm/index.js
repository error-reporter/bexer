/*

# Purpose

1. `timeouted` wrapper that makes error catching possible.
2. Convert error-first callbacks for use by chrome API: `chromified`.
3. Add utils for safer coding: `mandatory`, `throwIfError`.

*/
/* @returns {never} **/
export const mandatory = () => {

  throw new TypeError(
    'Missing required argument. Be explicit if you swallow errors.',
  );
};

/**
  @param {any} value
  @param {string} message
*/
export const assert = (value, message) => {

  if (!value) {
    throw new Error(message || `Assertion failed, value: ${value}`);
  }
};

/**
  @param {Error[]} args
*/
export const throwIfError = (...args) => {

  assert(args.length <= 1, 'Only zero or one argument (error) must be passed.');
  const err = args[0] || checkChromeError();
  if (err) {
    throw err;
  }
};

export const checkChromeError = () => {

  const err = chrome.runtime.lastError || chrome.extension.lastError;
  if (!err) {
    return;
  }
  /*
    Example of lastError:
      `chrome.runtime.openOptionsPage(() => console.log(chrome.runtime.lastError))`
      {message: "Could not create an options page."}
  */
  return new Error(err.message); // Add stack.
};

// setTimeout fixes error context, see https://crbug.com/357568
/** @param {Function | { cb: Function, returnValue: any }} arg */
export const timeouted = (arg = mandatory()) => {

  /** @type {Function} */
  let cb;
  /** @type {any} */
  let returnValue;
  if (typeof arg === 'function') {
    cb = arg;
  } else {
    ({ cb = mandatory(), returnValue } = arg);
  }
  return (/** @type {any[]} */...args) => {

    setTimeout(() => cb(...args), 0);
    return returnValue;
  };
};

// Take error first callback and convert it to chrome API callback.
/** @param {(_: Error) => any} cb */
export const chromified = (cb = mandatory()) =>
  /**
    @param {any[]} args
  */
  function wrapper(...args) {

    const err = checkChromeError();
    timeouted(cb)(err, ...args);
  };
/** @param {Function} [cb] */
export const workOrDie = (cb) =>

  chromified((err, ...args) => {

    if (err) {
      throw err;
    }
    cb && cb(...args);
  });
