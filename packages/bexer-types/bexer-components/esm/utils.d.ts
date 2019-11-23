export function assert(value: any, message: string): void;
export function checkChromeError(): Error | undefined;
export function chromified(cb?: (_: Error) => any): (...args: any[]) => void;
export function mandatory(): never;
export function throwIfError(...args: Error[]): void;
export function timeouted(arg?: Function | {
    cb: Function;
    returnValue: any;
}): (...args: any[]) => any;
export function workOrDie(cb?: Function | undefined): (...args: any[]) => void;
