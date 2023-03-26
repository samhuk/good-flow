import { SerializedGFAdvice } from '../../advice/serialized/types'

export type SerializedStackTrace = string | string[]

export type SerializedGFErrorOrError = SerializedGFError | Error

export type SerializedGFErrorInner = SerializedGFErrorOrError | SerializedGFErrorOrError[]

export type SerializedGFError<TData extends any = any> = {
  /**
   * The message of the error.
   */
  msg: string
  /**
   * Optional child error(s) of this error. This could either be another `GFError` or
   * a native Javascript Error or Error-like class.
   */
  inner?: SerializedGFErrorInner
  /**
   * Optional advice about the error, such as tips on how it could potentially be resolved.
   */
  advice?: SerializedGFAdvice
  /**
   * Optional stack trace of this error.
   */
  stack?: SerializedStackTrace
  /**
   * Custom data of this error.
   */
  data?: TData
}
