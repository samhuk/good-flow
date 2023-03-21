import StackUtils from 'stack-utils'
import { serialize } from './serialization'
import { toLogString } from './toLogString'
import { GFError, GFErrorOptions, StackTrace } from './types'

export const GF_ERROR_IDENTIFIER_PROP_NAME = '__gfError'

export const isGFError = (error: GFError | Error): error is GFError => (
  GF_ERROR_IDENTIFIER_PROP_NAME in error
)

export const isStackTraceNative = (stackTrace: StackTrace): stackTrace is string => (
  typeof stackTrace === 'string'
)

const createDefaultStackTrace = () => new StackUtils({ cwd: process.cwd(), internals: StackUtils.nodeInternals() }).capture(3).slice(2)

/**
 * Creates an error, optionally with child error(s), advice/tip(s), and a stack trace.
 *
 * @example
 * import { createGFError, GFResult } from 'good-flow'
 *
 * const task = (path: string): GFResult<string> => {
 *   try {
 *     return [doTask()]
 *   }
 *   catch (e: any) {
 *     // Create error
 *     return [undefined, createGFError({
 *       msg: 'Could not do task',
 *       inner: e,
 *     })]
 *   }
 * }
 *
 * const [taskResult, err] = task()
 * // Handle error
 * if (err != null)
 *   console.log(err.toLogString()) // Do something with error
 */
export const createGFError = (options: GFErrorOptions): GFError => {
  const error: GFError = {
    msg: options.msg,
    inner: options.inner,
    advice: options.advice,
    /* If the user specifies the stack as a stack, then use it.
     * Else, if the the user specifies a null stack, then also use it (which means the error is stackless).
     * Else (user has not explicitly specified it), then create a default one and use it.
     */
    stack: options.stack !== undefined ? options.stack : createDefaultStackTrace(),
    toLogString: _options => toLogString(error, _options),
    log: _options => {
      const logString = toLogString(error, _options)
      const outlet = _options?.outlet ?? 'log'
      console[outlet](logString)
      return logString
    },
    serialize: _options => serialize(error, _options),
    [GF_ERROR_IDENTIFIER_PROP_NAME]: true,
  }

  return error
}
