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
export const timeouted = (
    arg: Function | { cb: Function; returnValue: unknown; } = mandatory(),
  ): Function => {

  let cb: Function;
  let returnValue: unknown;
  if (typeof arg === 'function') {
    cb = arg;
  } else {
    ({ cb = mandatory(), returnValue } = arg);
  }
  return (...args: unknown[]) => {

    setTimeout(() => cb(...args), 0);
    return returnValue;
  };
};

type Wrapper = (...args: unknown[]) => void;
// Take error first callback and convert it to chrome API callback.
export const chromified = (cb: (_: Error) => unknown = mandatory()): Wrapper =>
  function wrapper(...args: unknown[]): void {

    const err = checkChromeError();
    timeouted(cb)(err, ...args);
  };
export const workOrDie = (cb: Function): Wrapper =>
  chromified((err, ...args) => {

    if (err) {
      throw err;
    }
    cb && cb(...args);
  });