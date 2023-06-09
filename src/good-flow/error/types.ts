import { CallSite } from 'stack-utils'
import { GFAdvice } from '../advice/types'
import { GFString } from '../string/types'
import { SerializedGFError } from './serialized/types'
import { SerializeGFErrorOptions } from './serialize/types'
import { ToLogStringOptions } from './toLogString/types'
import { GF_ERROR_IDENTIFIER_PROP_NAME } from './identification'

export type StackTrace = CallSite[] | string

export type GFErrorOrError = GFError | Error

export type GFErrorInner = GFErrorOrError | GFErrorOrError[]

export type GFErrorOptions<TData extends any = any> = {
  /**
   * The message of the error.
   */
  msg: GFString
  /**
   * Optional child error(s) of this error. This could either be another `GFError` or
   * a native Javascript Error or Error-like class.
   */
  inner?: GFErrorInner
  /**
   * Optional advice about the error, such as tips on how it could potentially be resolved.
   */
  advice?: GFAdvice
  /**
   * Optional stack trace of this error.
   *
   * If this is not provided (or is `undefined`), a default one will be created.
   *
   * If you do not want the error to have a stack trace, set this explicitly to `null`.
   */
  stack?: CallSite[] | string
  /**
   * Optional custom data of this error.
   */
  data?: TData
}

/**
 * An error, potentially with child error(s), advice/tip(s), and a stack trace.
 */
export type GFError<TData extends any = any> = {
  /**
   * The message of the error.
   */
  msg: GFString
  /**
   * Optional child error(s) of this error. This could either be another `GFError` or
   * a native Javascript Error or Error-like class.
   */
  inner?: GFErrorInner
  /**
   * Optional advice about the error, such as tips on how it could potentially be resolved.
   */
  advice?: GFAdvice
  /**
   * Optional stack trace of this error.
   */
  stack?: StackTrace
  /**
   * Custom data for the error.
   */
  data?: TData
  /**
   * Converts this error to a string that can be logged to console.
   */
  toLogString: (
    /**
     * Optional options to customize the rendering of the error.
     */
    options?: ToLogStringOptions
  ) => string
  /**
   * Logs this error to `console` (see `options.outlet` for customizing which console outlet).
   *
   * @returns The string that was logged.
   */
  log: (
    /**
     * Optional options to customize the rendering of the error.
     */
    options?: ToLogStringOptions & {
      /**
       * Which `console` outlet to log to.
       *
       * @default `log` // E.g. console.log
       */
      outlet?: 'log' | 'warn' | 'error' | 'info'
    }
  ) => string
  /**
   * Serializes the error. This is useful if you need to, for example, JSON-serialize
   * the error in order to store it or transfer it over a network.
   *
   * This essentially involves normalizing any and all non-serializable data types,
   * such as functions, dates, etc., either by removing them or converting them to
   * their corresponding serializable form, for example `string`, `number`, etc.
   *
   * @example
   * import { createGFError } from 'good-flow'
   * const error = createGFError({
   *   msg: 'Could not do task',
   *   inner: e,
   * })
   * const serializedError = error.serialize()
   * const serializedErrorNoColor = error.serialize({ disableColors: true })
   *
   * const errorJson = JSON.stringify(serializedError)
   */
  serialize: (options?: SerializeGFErrorOptions) => SerializedGFError
  /**
   * Wraps this error with the provided outer error, returning the outer error.
   *
   * @returns The provided outer error
   *
   * @example
   * import { createGFError } from 'good-flow'
   * const innerError = createGFError('Inner error')
   * const outerError = innerError.wrap(createGFError('Outer error'))
   */
  wrap: (outer: GFError) => GFError
  /**
   * Adds the provided inner error to this error, returning this error.
   *
   * @returns This error
   *
   * @example
   * import { createGFError } from 'good-flow'
   * const outerError = createGFError('Outer error')
   *   .addInner(createGFError('Inner error 1'))
   *   .addInner(createGFError('Inner error 2'))
   */
  addInner: (inner: GFError) => GFError
  /**
   * Clones this error.
   *
   * @example
   * const err = createGFError('An error occured')
   * const clonedErr = err.clone()
   */
  clone: () => GFError
  [GF_ERROR_IDENTIFIER_PROP_NAME]: true
}
