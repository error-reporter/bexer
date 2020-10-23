/**
  @param {any} value
  @param {string} message
*/
export function assert(value: any, message: string): void;
export function checkChromeError(): Error | undefined;
/** @param {(_: Error) => any} cb */
export function chromified(cb?: (_: Error) => any): (...args: any[]) => void;
/** @returns {never} */
export function mandatory(): never;
/**
  @param {Error[]} args
*/
export function throwIfError(...args: Error[]): void;
/** @param {Function | { cb: Function, returnValue: any }} arg */
export function timeouted(arg?: Function | {
    cb: Function;
    returnValue: any;
}): (...args: any[]) => any;
/** @param {Function} [cb] */
export function workOrDie(cb?: Function | undefined): (...args: any[]) => void;
