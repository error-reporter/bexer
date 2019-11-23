// Generated from package @bexer/error-transformer v0.0.6
this['BexerComponents.BexerComponents'] = this['BexerComponents.BexerComponents'] || {};
this.BexerComponents.errorTransformer = (function (exports, utils) {
  'use strict';

  /*
  Errio repository: https://github.com/programble/errio
  This code derives from Errio libarary distributed under the following license.

  Copyright © 2015, Curtis McEnroe curtis@cmcenroe.me

  Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

  */

  // Default options for all serializations.
  const defaultOptions = {
    recursive: true, // Recursively serialize and deserialize nested errors
    inherited: true, // Include inherited properties
    stack: false,    // Include stack property
    private: false,  // Include properties with leading or trailing underscores
    /** @type {Array<string>} */
    exclude: [],     // Property names to exclude (low priority)
    /** @type {Array<string>} */
    include: [],     // Property names to include (high priority)
  };

  // Serialize an error instance to a plain object with option overrides, applied
  // on top of the global defaults and the registered option overrides. If the
  // constructor of the error instance has not been registered yet, register it
  // with the provided options.
  /**
    @param {Error} error
  */
  const toObject = (error, callOptions = {}) => {

    const options = { ...defaultOptions, ...callOptions };

    // Always explicitly include essential error properties.
    /** @type {JsonObject} */
    const object = {
      name: error.name,
      message: error.message,
    };
    // Explicitly include stack since it is not always an enumerable property.
    if (options.stack) {
      object.stack = error.stack;
    }

    for (const prop in error) {
      // Skip exclusion checks if property is in include list.
      if (!options.include.includes(prop)) {
        if (typeof(/** @type {any} */(error)[prop]) === 'function') continue;

        if (options.exclude.includes(prop)) continue;

        if (!options.inherited) {
          if (!Object.prototype.hasOwnProperty.call(error, prop)) continue;
        }
        if (!options.stack) {
          if (prop === 'stack') continue;
        }
        if (!options.private) {
          if (prop[0] === '_' || prop[prop.length - 1] === '_') continue;
        }
      }

      const value = /** @type {any} */(error)[prop];

      // Recurse if nested object has name and message properties.
      if (typeof value === 'object' && value && value.name && value.message) {
        if (options.recursive) {
          object[prop] = toObject(value, options);
        }
        continue;
      }

      object[prop] = value;
    }

    return object;
  };

  /*
  const privateGetSourceMappedErrorStackAsync = (
    error = mandatory(),
    gps = mandatory(),
  ) => {

    const stackFrames = errorStackParser.parse(error);
    return Promise.all(
      stackFrames.map(
        (sf) => gps.pinpoint(sf).catch(() => ({ ...sf, failedToMap: true })),
      ),
    );
  };

  export const getSourceMappedErrorEventAsync = async (
    errorEvent = mandatory(),
  ) => {

    // Reuse the same gps for better caching.
    const gps = new StackTraceGps();
    // eslint-disable-next-line no-param-reassign
    errorEvent.error.mappedStack = await privateGetSourceMappedErrorStackAsync(
      errorEvent.error,
      gps,
    );
    const eeMappedStack = await gps.pinpoint(new StackFrame({
      fileName: errorEvent.filename,
      lineNumber: errorEvent.lineno,
      columnNumber: errorEvent.colno,
    })).catch(() => false);
    if (eeMappedStack) {
      // eslint-disable-next-line no-param-reassign
      errorEvent.mappedStack = eeMappedStack;
    }
    return errorEvent;
  };

  export const getSourceMappedErrorStackAsync = (error = mandatory()) =>
    privateGetSourceMappedErrorStackAsync(error, new StackTraceGps());

  */
  /**
    @param {Error} error
  */
  const errorToPlainObject = (error = utils.mandatory()) =>
    toObject(error, { stack: true, private: true });

  /** @typedef {{
    message?: string,
    filename?: string,
    lineno?: number,
    colno?: number,
    type?: string,
    path?: Array<Element | undefined> | string,
    error?: JsonObject,
    [key: string]: any,
  }} PlainErrorEventLike */

  /** @param {ErrorEventLike} errorEvent */
  const errorEventToPlainObject = (errorEvent = utils.mandatory()) => {

    /** @type {PlainErrorEventLike} */
    const plainObj = [
      'message',
      'filename',
      'lineno',
      'colno',
      'type',
      'path',
    ].reduce(
      /**
        @param {PlainErrorEventLike} acc
        @param {string} prop
        @returns {PlainErrorEventLike}
      */
      (acc, prop) => {

        acc[prop] = (/** @type {PlainErrorEventLike} */(errorEvent))[prop];
        return acc;

      },
      {},
    );
    if (plainObj.path && typeof plainObj.path !== 'string') {
      const pathStr = plainObj.path.map((o) => {
        if (!o) {
          return;
        }
        let res = '';
        if (o.tagName) {
          res += `<${o.tagName.toLowerCase()}`;
          if (o.attributes) {
            res += Array.from(o.attributes).map((atr) => ` ${atr.name}="${atr.value}"`).join('');
          }
          res += '>';
        }
        if (!res) {
          res += `${o}`;
        }
        return res;

      }).join(', ');

      /** @type {(typeof plainObj) | { path: string }} */
      (plainObj).path = `[${pathStr}]`;
    }

    if (errorEvent.error && typeof errorEvent === 'object') {
      plainObj.error = errorToPlainObject(errorEvent.error);
    } else {
      plainObj.error = errorEvent.error;
    }
    return plainObj;
  };

  exports.errorEventToPlainObject = errorEventToPlainObject;
  exports.errorToPlainObject = errorToPlainObject;

  return exports;

}({}, BexerComponents.utils));
