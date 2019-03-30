import { test, runIfMain } from "https://deno.land/std/testing/mod.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import * as base64 from "./mod.ts";

const enc: TextEncoder = new TextEncoder();
const dec: TextDecoder = new TextDecoder();

test(function base64WannabeBigData(): void {
  const big: Uint8Array = new Uint8Array(1 * 1024 * 1024);
  for (let i: number = 0, l = big.length; i < l; ++i) {
    big[i] = i % 256;
  }
  const b64: string = base64.fromByteArray(big);
  const buf: Uint8Array = base64.toByteArray(b64);
  assertEquals(buf, big);
  assertEquals(base64.byteLength(b64), buf.length);
});

test(function base64HandlesIrregularPadding(): void {
  const b64: string = "SQ==QU0=";
  assertEquals(base64.toByteArray(b64), Uint8Array.from([73]));
  assertEquals(base64.byteLength(b64), 1);
});

test(function base64DecodeUrlSafe(): void {
  const expected: Uint8Array = Uint8Array.from([
    0xff,
    0xff,
    0xbe,
    0xff,
    0xef,
    0xbf,
    0xfb,
    0xef,
    0xff
  ]);
  for (const b64 of ["//++/++/++//", "__--_--_--__"]) {
    const actual: Uint8Array = base64.toByteArray(b64);
    assertEquals(actual, expected);
    assertEquals(base64.byteLength(b64), actual.length);
  }
});

test(function base64RoundTrip(): void {
  const checks: string[] = [
    "a",
    "aa",
    "aaa",
    "hi",
    "hi!",
    "hi!!",
    "sup",
    "sup?",
    "sup?!"
  ];
  for (const check of checks) {
    const b64: string = base64.fromByteArray(enc.encode(check));
    const buf: Uint8Array = base64.toByteArray(b64);
    assertEquals(check, dec.decode(buf));
    assertEquals(base64.byteLength(b64), buf.length);
  }
});

test(function base64Identity(): void {
  const data: any[] = [
    [Uint8Array.from([0, 0, 0]), "AAAA"],
    [Uint8Array.from([0, 0, 1]), "AAAB"],
    [Uint8Array.from([0, 1, -1]), "AAH/"],
    [Uint8Array.from([0, 0, 0, -1]), "AAAA/w=="],
    [Uint8Array.from([0, 0, 0, 0, -1]), "AAAAAP8="],
    [Uint8Array.from([1, 1, 1]), "AQEB"],
    [Uint8Array.from([0, -73, 23]), "ALcX"]
  ];
  for (const [buf, b64] of data) {
    assertEquals(base64.fromByteArray(buf), b64);
    assertEquals(base64.toByteArray(b64), buf);
  }
});

runIfMain(import.meta, { parallel: true });
