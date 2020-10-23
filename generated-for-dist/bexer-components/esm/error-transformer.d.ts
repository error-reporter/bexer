export type PlainErrorEventLike = {
    [key: string]: any;
    message?: string | undefined;
    filename?: string | undefined;
    lineno?: number | undefined;
    colno?: number | undefined;
    type?: string | undefined;
    path?: string | (Element | undefined)[] | undefined;
    error?: JsonObject | undefined;
};
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
export function errorEventToPlainObject(errorEvent?: ErrorEventLike): {
    [key: string]: any;
    message?: string | undefined;
    filename?: string | undefined;
    lineno?: number | undefined;
    colno?: number | undefined;
    type?: string | undefined;
    path?: string | (Element | undefined)[] | undefined;
    error?: JsonObject | undefined;
};
/**
  @param {Error} error
*/
export function errorToPlainObject(error?: Error): JsonObject;
