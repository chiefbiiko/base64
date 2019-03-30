# base64

[![Travis](http://img.shields.io/travis/chiefbiiko/base64.svg?style=flat)](http://travis-ci.org/chiefbiiko/base64) [![AppVeyor](https://ci.appveyor.com/api/projects/status/github/chiefbiiko/base64?branch=master&svg=true)](https://ci.appveyor.com/project/chiefbiiko/base64)

## Import

```ts
import * as base64 from "https://denopkg.com/chiefbiiko/base64/mod.ts";
```

## Usage

Transcode base64 strings from/to typed arrays.

``` ts
import * as base64 from "https://denopkg.com/chiefbiiko/base64/mod.ts";

const b64: string = base64.fromByteArray(new TextEncoder().encode("this is too much"));
const buf: Uint8Array = base64.toByteArray(b64);
```

## API

### `base64.fromByteArray(buf: Uint8Array): string`

Encode a base64 string from a byte array.

### `base64.toByteArray(b64: string): Uint8Array`

Turn a base64 string to a byte array.

### `base64.byteLength(b64: string): number`

Calculate the byte length of a base64 string.

## License

[MIT](./LICENSE)
