type DebugType = (...args: any[]) => (...args: any[]) => void;

declare var Bexer: typeof import('./index.js');
declare var debug: DebugType;

type GetAllValuesOf<T> = T[keyof T];
interface AnyStringToValuesOf<T> {
  [key: string]: GetAllValuesOf<T>,
}

type JsonObject = { [key: string]: Json };
interface JsonArray extends Array<Json> {}
type Json = undefined | null | string | number | boolean | JsonArray | JsonObject;

type ErrorEventLike = ErrorEvent | chrome.proxy.ErrorDetails;

type ErrorTypesTS = GetAllValuesOf<typeof import('./error-types.js')>;
