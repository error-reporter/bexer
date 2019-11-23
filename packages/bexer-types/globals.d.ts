type DebugType = (...args: any[]) => (...args: any[]) => void;

interface Window {
  debug: DebugType,
  Bexer: typeof import('@bexer/index/esm/index'),
}

type GetAllValuesOf<T> = T[keyof T];
interface AnyStringToValuesOf<T> {
  [key: string]: GetAllValuesOf<T>,
}

type JsonObject = { [key: string]: Json };
interface JsonArray extends Array<Json> {}
type Json = undefined | null | string | number | boolean | JsonArray | JsonObject;

type ErrorEventLike = ErrorEvent | chrome.proxy.ErrorDetails;

type ErrorTypesTS = GetAllValuesOf<typeof import('@bexer/commons/esm/error-types')>;
