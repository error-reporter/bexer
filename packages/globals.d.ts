interface Window {
  debug: Function,
  Bexer: any,
}

type GetAllValuesOf<T> = T[keyof T];
interface AnyStringToValuesOf<T> extends T {
  [key: string]: GetAllValuesOf<T>,
};

type JsonObject = { [key: string]: Json };
interface JsonArray extends Array<Json> {};
type Json = undefined | null | string | number | boolean | JsonArray | JsonObject;
