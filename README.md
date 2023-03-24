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

## Serialization

Errors can be serialized, which converts them to a form that contains no non-serializable data, such as functions. This enables them to be, for example, JSON-serializable and sent over a network as a DTO.

To create and serialize an error (e.g. server-side):

```typescript
import { createGFError } from 'good-flow'

const err = createGFError('This is an error')
const serializedErr = err.serialize()
const errJson = JSON.stringify(serializedErr)
```

For the client-side, types for a serialized `GFError` are available seperately at `good-flow/lib/serialized` such that Node.js-only packages such as `colors` are not co-imported along (which would cause build/bundle issues for the web). For example (e.g. client-side):

```typescript
import { SerializedGFError } from 'good-flow/lib/serialized'

type MyApiResponse<TData> = { data: TData, err: SerializedGFError }
```

## Logging

Errors can be logged to a Node.js console. For example:

```typescript
const err = createGFError('This is an error')
err.log() // Equivalent to console.log(err.toLogString())
err.log({ outlet: 'error' }) // // Equivalent to console.error(err.toLogString())
```

A preview of how errors log to console by default:

![Logging Preview](./img/img1.png)

## Development

See [./contributing/development.md](./contributing/development.md)

---

If you would like to support the development of GoodFlow, feel free to [sponsor me on GitHub](https://github.com/sponsors/samhuk) or [buy me a coffee](https://www.buymeacoffee.com/samhuk) ✨
