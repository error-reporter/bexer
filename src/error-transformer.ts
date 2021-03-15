import { mandatory } from './utils.js';
// import errorStackParser from 'error-stack-parser';
// import StackTraceGps from 'stacktrace-gps';
// import StackFrame from 'stackframe';
import { toObject } from './private/errio.js';

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
export const errorToPlainObject = (error: Error = mandatory()) =>
  toObject(error, { stack: true, private: true });

type PlainErrorEventLike = {
  message?: string,
  filename?: string,
  lineno?: number,
  colno?: number,
  type?: string,
  path?: Array<Element | undefined> | string,
  error?: JsonObject,
  [key: string]: any,
};

export const errorEventToPlainObject = (errorEvent: ErrorEventLike = mandatory()) => {

  const plainObj: PlainErrorEventLike = [
    'message',
    'filename',
    'lineno',
    'colno',
    'type',
    'path',
  ].reduce(
    (acc: PlainErrorEventLike, prop: string): PlainErrorEventLike => {

      acc[prop] = (errorEvent as PlainErrorEventLike)[prop];
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

    (plainObj).path = `[${pathStr}]`;
  }

  if (errorEvent.error && typeof errorEvent === 'object') {
    plainObj.error = errorToPlainObject(errorEvent.error);
  } else {
    plainObj.error = errorEvent.error;
  }
  return plainObj;
};