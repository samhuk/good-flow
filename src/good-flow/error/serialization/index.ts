import { isGFError, isStackTraceNative } from '..'
import { serializeAdvice } from '../../advice/serialization'
import { normalizeGFString } from '../../string'
import { DEFAULT_CUSTOM_STACK_TRACE_RENDERER } from '../toLogString'
import { GFError, GFErrorInner, GFErrorOrError, StackTrace } from '../types'
import {
  CustomStackTraceSerializer,
  NativeErrorSerializer,
  NativeStackTraceSerializer,
  ResolvedSerializeGFErrorOptions,
  SerializedGFError,
  SerializedGFErrorInner,
  SerializedGFErrorOrError,
  SerializedStackTrace,
  SerializeGFErrorOptions,
} from './types'

const DEFAULT_NATIVE_STACK_TRACE_SERIALIZER: NativeStackTraceSerializer = stackTrace => stackTrace

const DEFAULT_CUSTOM_STACK_TRACE_SERIALIZER: CustomStackTraceSerializer = (
  stackTrace,
  areColorsEnabled,
) => (
  DEFAULT_CUSTOM_STACK_TRACE_RENDERER(stackTrace)
    .map(gfString => normalizeGFString(gfString, { disableColors: !areColorsEnabled }))
)

const DEFAULT_NATIVE_ERROR_SERIALIZER: NativeErrorSerializer = (error, nativeStackTraceSerializer) => {
  const errorPropsToInclude = Object.getOwnPropertyNames(error).filter(propName => {
    // We will serialize the stack specifically later on.
    if (propName === 'stack')
      return false

    const valType = typeof propName
    return valType !== 'function' && valType !== 'symbol'
  })
  const serializedError: Error = {
    name: error.name,
    message: error.message,
  }
  errorPropsToInclude.forEach(propName => (serializedError as any)[propName] = (error as any)[propName])

  // Serialize the stack specifically
  if (error.stack != null) {
    const serializedStack = nativeStackTraceSerializer(error.stack)
    if (serializedStack != null)
      serializedError.stack = serializedStack
  }

  return serializedError
}

const serializeStackTrace = (stackTrace: StackTrace, options: ResolvedSerializeGFErrorOptions): SerializedStackTrace => (
  isStackTraceNative(stackTrace)
    ? options.nativeStackTraceSerializer === false
      ? null
      : options.nativeStackTraceSerializer(stackTrace)
    : options.customStackTraceSerializer === false
      ? null
      : options.customStackTraceSerializer(stackTrace, !options.disableColors)
)

const serializeSingleInner = (inner: GFErrorOrError, options: ResolvedSerializeGFErrorOptions): SerializedGFErrorOrError | null => (
  isGFError(inner)
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    ? _serialize(inner, options)
    : options.nativeErrorSerializer === false
      ? null
      : options.nativeErrorSerializer(
        inner,
        options.nativeStackTraceSerializer === false ? () => null : options.nativeStackTraceSerializer,
      )
)

const resolveOptions = (options: SerializeGFErrorOptions | undefined | null): ResolvedSerializeGFErrorOptions => ({
  disableColors: options?.disableColors ?? false,
  customStackTraceSerializer: options?.customStackTraceSerializer ?? DEFAULT_CUSTOM_STACK_TRACE_SERIALIZER,
  nativeStackTraceSerializer: options?.nativeStackTraceSerializer ?? DEFAULT_NATIVE_STACK_TRACE_SERIALIZER,
  nativeErrorSerializer: options?.nativeErrorSerializer ?? DEFAULT_NATIVE_ERROR_SERIALIZER,
})

const _serialize = (error: GFError, options: ResolvedSerializeGFErrorOptions): SerializedGFError => {
  const serializedError: SerializedGFError = {
    msg: normalizeGFString(error.msg, options),
  }

  if (error.stack != null) {
    const serializedStack = serializeStackTrace(error.stack, options)
    if (serializedStack != null)
      serializedError.stack = serializedStack
  }
  if (error.advice != null)
    serializedError.advice = serializeAdvice(error.advice, options)
  if (error.inner != null) {
    if (Array.isArray(error.inner)) {
      serializedError.inner = error.inner.map(inner => serializeSingleInner(inner, options)).filter(e => e != null)
    }
    else {
      const serializedInner = serializeSingleInner(error.inner, options)
      if (serializedInner != null)
        serializedError.inner = serializedInner
    }
  }

  return serializedError
}

export const serialize = (error: GFError, options?: SerializeGFErrorOptions): SerializedGFError => (
  _serialize(error, resolveOptions(options))
)
