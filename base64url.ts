import { init } from "./base.ts";

const lookup: string[] = [];
const revLookup: number[] = [];
const code: string =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

for (let i: number = 0, l = code.length; i < l; ++i) {
  lookup[i] = code[i];
  revLookup[code.charCodeAt(i)] = i;
}

revLookup["-".charCodeAt(0)] = 62;
revLookup["_".charCodeAt(0)] = 63;

const mod: {
  byteLength(b64: string): number;
  toUint8Array(b64: string): Uint8Array;
  fromUint8Array(buf: Uint8Array): string;
} = init(lookup, revLookup);

export const byteLength: (b64: string) => number = mod.byteLength;
export const toUint8Array: (b64: string) => Uint8Array = mod.toUint8Array;
export const fromUint8Array: (buf: Uint8Array) => string = mod.fromUint8Array;
