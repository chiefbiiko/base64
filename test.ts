import { test, runIfMain } from "https://deno.land/std/testing/mod.ts";
import {
  assertEquals,
  assertThrows
} from "https://deno.land/std/testing/asserts.ts";
import * as base64 from "./mod.ts";
import * as base64url from "./base64url.ts";

function encode(txt: string): Uint8Array {
  return new TextEncoder().encode(txt);
}

test({
  name: "toUint8Array throws if a base64 string length is not a multiple of 4",
  fn(): void {
    assertThrows((): void => {
      base64.toUint8Array("Qld");
    }, TypeError);
  }
});

test({
  name: "round-tripping big data",
  fn(): void {
    const big: Uint8Array = new Uint8Array(13 * 1024 * 1024);

    for (let i: number = 0, l = big.length; i < l; ++i) {
      big[i] = i % 256;
    }

    const b64: string = base64.fromUint8Array(big);
    const buf: Uint8Array = base64.toUint8Array(b64);

    assertEquals(buf, big);
    assertEquals(base64.byteLength(b64), buf.length);
  }
});

test({
  name: "gracefully handles irregular padding",
  fn(): void {
    const b64: string = "SQ==QU0=";

    assertEquals(base64.toUint8Array(b64), Uint8Array.from([73]));
    assertEquals(base64.byteLength(b64), 1);
  }
});

test({
  name: "toUint8Array acts url safe",
  fn(): void {
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
      const actual: Uint8Array = base64.toUint8Array(b64);

      assertEquals(actual, expected);
      assertEquals(base64.byteLength(b64), actual.length);
    }
  }
});

test({
  name: "base64RoundTrip",
  fn(): void {
    const checks: Uint8Array[] = [
      "a",
      "aa",
      "aaa",
      "hi",
      "hi!",
      "hi!!",
      "sup",
      "sup?",
      "sup?!"
    ].map(encode);

    for (const check of checks) {
      const b64: string = base64.fromUint8Array(check);
      const buf: Uint8Array = base64.toUint8Array(b64);

      assertEquals(check, buf);
      assertEquals(base64.byteLength(b64), buf.length);
    }
  }
});

test({
  name: "round-tripping",
  fn(): void {
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
      assertEquals(base64.fromUint8Array(buf), b64);
      assertEquals(base64.toUint8Array(b64), buf);
      assertEquals(base64.byteLength(b64), buf.length);
    }
  }
});

test({
  name: "base64url round trip",
  fn(): void {
    const data: any[] = [
      [Uint8Array.from([0, 0, 0]), "AAAA"],
      [Uint8Array.from([0, 0, 1]), "AAAB"],
      [Uint8Array.from([0, 0, 62]), "AAA-"],
      [Uint8Array.from([0, 1, -1]), "AAH_"],
      [Uint8Array.from([0, 0, 0, -1]), "AAAA_w=="],
      [Uint8Array.from([0, 0, 0, 0, -1]), "AAAAAP8="],
      [Uint8Array.from([1, 1, 1]), "AQEB"],
      [Uint8Array.from([0, -73, 23]), "ALcX"]
    ];

    for (const [buf, b64] of data) {
      assertEquals(base64url.fromUint8Array(buf), b64);
      assertEquals(base64url.toUint8Array(b64), buf);
      assertEquals(base64url.byteLength(b64), buf.length);
    }
  }
});

test({
  name: "RFC 4648 test vectors",
  fn(): void {
    const testVectors: [Uint8Array, string][] = [
      [encode(""), ""],
      [encode("f"), "Zg=="],
      [encode("fo"), "Zm8="],
      [encode("foo"), "Zm9v"],
      [encode("foob"), "Zm9vYg=="],
      [encode("fooba"), "Zm9vYmE="],
      [encode("foobar"), "Zm9vYmFy"]
    ];

    for (const [buf, b64] of testVectors) {
      assertEquals(base64.fromUint8Array(buf), b64);
      assertEquals(base64.toUint8Array(b64), buf);
      assertEquals(base64.byteLength(b64), buf.length);
    }
  }
});

runIfMain(import.meta, { parallel: true });
