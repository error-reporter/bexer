/*

# Purpose

1. `timeouted` wrapper that makes error catching possible.
2. Convert error-first callbacks for use by chrome API: `chromified`.
3. Add utils for safer coding: `mandatory`, `throwIfError`.

*/
export const mandatory = (): never => {

  throw new TypeError(
    'Missing required argument. Be explicit if you swallow errors.',
  );
};

export const assert = (value: any, message: string) => {

  if (!value) {
    throw new Error(message || `Assertion failed, value: ${value}`);
  }
};

export const throwIfError = (...args: Error[]) => {

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
export const timeouted = (arg: Function | { cb: Function; returnValue: any; } = mandatory()) => {

  let cb: Function;
  let returnValue: any;
  if (typeof arg === 'function') {
    cb = arg;
  } else {
    ({ cb = mandatory(), returnValue } = arg);
  }
  return (...args: any[]) => {

    setTimeout(() => cb(...args), 0);
    return returnValue;
  };
};

// Take error first callback and convert it to chrome API callback.
export const chromified = (cb: (_: Error) => any = mandatory()) =>
  function wrapper(...args: any[]) {

    const err = checkChromeError();
    timeouted(cb)(err, ...args);
  };
export const workOrDie = (cb: Function) =>

  chromified((err, ...args) => {

    if (err) {
      throw err;
    }
    cb && cb(...args);
  });