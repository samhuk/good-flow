import { CallSite } from 'stack-utils'
import { GFAdvice } from '../advice/types'
import { GFString } from '../string/types'
import { ToLogStringOptions } from './toLogString/types'

export type StackTrace = CallSite[] | string

export type GFErrorOrError = GFError | Error

export type GFErrorInner = GFErrorOrError | GFErrorOrError[]

export type GFErrorOptions = {
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
   * If this is not provided, a default one will be created.
   */
  stack?: CallSite[] | string
}

/**
 * An error, potentially with child error(s), advice/tip(s), and a stack trace.
 */
export type GFError = {
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
   * Converts this error to a string that can be logged to console.
   */
  toLogString: (
    /**
     * Optional options to customize the rendering of the error.
     */
    options?: ToLogStringOptions
  ) => string
}
