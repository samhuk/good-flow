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
* Emit and handle errors in a flat, Go-like way, avoiding endless nested try-catch blocks and use of mutable `let` variables.
* Nest errors with inner errors to attach informative context.
* Print errors to console beautifully.
* Serialize errors to make it a [DTO](https://en.wikipedia.org/wiki/Data_transfer_object) (e.g. to make it JSON-serializable).

## Usage

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

Use `GFError.toLogString` to serialize a GoodFlow error to a console-loggable string. A preview of this output for a relatively complex error:

![Logging Preview](./img/img1.png)

## Development

See [./contributing/development.md](./contributing/development.md)

---

If you found this package delightful, feel free to [buy me a coffee](https://www.buymeacoffee.com/samhuk) ✨
