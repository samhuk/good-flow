<h1 align="center">GoodFlow</h1>
<p align="center">
  <em>Improve how you do Javascript errors</em>
</p>

<p align="center">
  <a href="https://img.shields.io/badge/License-MIT-green.svg" target="_blank">
    <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="license" />
  </a>
  <a href="https://badge.fury.io/js/good-flow.svg" target="_blank">
    <img src="https://badge.fury.io/js/good-flow.svg" alt="npm version" />
  </a>
</p>

## Overview

GoodFlow improves how you do errors in Javascript:
* Emit and handle errors in a flat, Go-like way, avoiding nested try-catch blocks and use of mutable `let` variables.
* Nest errors with inner errors to attach informative context.
* Print errors to console beautifully.
* Serialize errors to make it a [DTO](https://en.wikipedia.org/wiki/Data_transfer_object) (e.g. to make it JSON-serializable).
* Enable flat try-catch logic.

## Usage Overview

```typescript
import { createGFError, GFResult } from 'good-flow'

const task = (path: string): GFResult<string> => {
  try {
    // Emit successful result
    return [fs.readFileSync(path, { encoding: 'utf8' })]
  }
  catch (e: any) {
    // Emit unsuccessful result with error
    return [undefined, createGFError({
      msg: c => `Could not read file at ${c.cyan(path)}.`,
      inner: e,
    })]
  }
}

const [taskResult, err] = task()
// Handle error
if (err != null) {
  // Log error (simple)
  err.log()
  // Log error (explicit)
  console.log(err.toLogString())
  // Serialize and JSON-ify error
  myErrorDatabaseService.store(JSON.stringify(err.serialize()))
  exit(1)
}

exit(0)
```

## Logging

Errors can be logged to a Node.js console. For example:

```typescript
const err = createGFError('This is an error')
console.log(err.toLogString())
err.log() // Equivalent to above
err.log({ outlet: 'error' }) // // Equivalent to above but using console.error(...)
```

A preview of how errors log to console by default:

![Logging Preview](./img/img1.png)

## Serialization

Errors can be serialized, converting them to a form that contains only serializable data (i.e. no functions, etc.). This enables them to be, for example, JSON-serializable and sent over a network as a [DTO](https://en.wikipedia.org/wiki/Data_transfer_object).

To create and serialize an error (e.g. server-side):

```typescript
import { createGFError } from 'good-flow'

const err = createGFError('This is an error')
const serializedErr = err.serialize()
const errJson = JSON.stringify(serializedErr)
```

For client-side code, types for a serialized `GFError` are available seperately at `good-flow/lib/serialized` such that Node.js-only packages are not co-imported along (which would cause build/bundle issues for browsers). For example:

```typescript
import { SerializedGFError } from 'good-flow/lib/serialized'

type MyApiResponse<TData> = { data: TData, err: SerializedGFError }
```

## Try-Catching

`Try`-`catch` logic can be done in a flatter way that more easily integrates with GoodFlow via `gfTry`. For example:

```typescript
import * as fs from 'fs'
import { gfTry } from 'good-flow'

const task = path => gfTry(
  // Try
  () => fs.readFileSync(path, { encoding: 'utf8' }),
  // Catch (can be take several forms)
  { msg: c => `Could not read configuration file at ${c.cyan(path)}.` },
)

const [result, error] = task('foo.txt')
/* error:
{  
  msg: Could not read configuration file at foo.txt
  inner: {
    name: 'ENOENT',
    message: 'File not found...',
    stack: ...,
    ...
  }
}
*/
```

## Performance

The base concept of GoodFlow (function results as tuple of data and/or error) does not incur a significant performance impact over using a native try-catch block. [Proof-of-concept](https://jsbench.me/yglfo9fi2y/1). More rigorous performance tests and data are in the pipeline.

## Development

See [./contributing/development.md](./contributing/development.md)

---

If you would like to support the development of GoodFlow, feel free to [sponsor me on GitHub](https://github.com/sponsors/samhuk) or [buy me a coffee](https://www.buymeacoffee.com/samhuk) ✨
