import { CallSite } from 'stack-utils'
import { SerializedGFAdvice } from '../../advice/serialization/types'

export type NativeStackTraceSerializer = (stack: string) => string | null

export type CustomStackTraceSerializer = (stack: CallSite[], colorsEnabled: boolean) => string | string[] | null

export type NativeErrorSerializer = (
  error: Error,
  nativeStackTraceSerializer: NativeStackTraceSerializer,
) => Error

export type SerializeGFErrorOptions = {
  /**
   * @default false
   */
  disableColors?: boolean
  /**
   * Serializer for native stack trace strings (i.e. from the native JS `Error` class).
   *
   * To prevent native stack traces from being serialized, set this either to `false` or
   * to return `null`, i.e. `() => null`.
   */
  nativeStackTraceSerializer?: NativeStackTraceSerializer | false
  /**
   * Serializer for native stack trace strings (i.e. from the native JS `Error` class).
   *
   * To prevent custom stack traces from being serialized, set this either to `false` or
   * to return `null`, i.e. `() => null`.
   */
  customStackTraceSerializer?: CustomStackTraceSerializer | false
  /**
   * Serializer for native errors (i.e. the native JS `Error` class).
   *
   * To prevent all native errors from being serialized, set this to `false`
   */
  nativeErrorSerializer?: NativeErrorSerializer | false
}

export type ResolvedSerializeGFErrorOptions = {
  disableColors: boolean
  nativeStackTraceSerializer: NativeStackTraceSerializer | false
  customStackTraceSerializer: CustomStackTraceSerializer | false
  nativeErrorSerializer: NativeErrorSerializer | false
}

export type SerializedStackTrace = string | string[]

export type SerializedGFErrorOrError = SerializedGFError | Error

export type SerializedGFErrorInner = SerializedGFErrorOrError | SerializedGFErrorOrError[]

export type SerializedGFError = {
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
}
