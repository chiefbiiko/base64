# base64

[![Travis](http://img.shields.io/travis/chiefbiiko/base64.svg?style=flat)](http://travis-ci.org/chiefbiiko/base64) [![AppVeyor](https://ci.appveyor.com/api/projects/status/github/chiefbiiko/base64?branch=master&svg=true)](https://ci.appveyor.com/project/chiefbiiko/base64)

base64 strings from/to `Uint8Array`s

## Import

```ts
import * as base64 from "https://denopkg.com/chiefbiiko/base64/mod.ts";
```

## Usage

``` ts
import * as base64 from "https://denopkg.com/chiefbiiko/base64/mod.ts";

const b64: string = base64.fromUint8Array(new TextEncoder().encode("this is too much"));
const buf: Uint8Array = base64.toUint8Array(b64);
```

If you need a URL and file name safe base64 variant `import * as base64url from "https://denopkg.com/chiefbiiko/base64/base64url.ts";`

## API

### `base64.fromUint8Array(buf: Uint8Array): string`

Transcode a base64 string from a byte array.

### `base64.toUint8Array(b64: string): Uint8Array`

Turn a base64 string to a byte array.

### `base64.byteLength(b64: string): number`

Calculate the byte length of a base64 string.

## License

[MIT](./LICENSE)
