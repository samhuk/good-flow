import { SerializedGFError } from './serialized/types'
import { GFError } from './types'

export const GF_ERROR_IDENTIFIER_PROP_NAME = '__gfError'

/**
 * Asserts that the provided error is a `GFError` and not a native JS `Error` instance.
 *
 * @example
 * isGFError(new Error()) // false
 * isGFError(createGFError(...)) // true
 */
export const isGFError = (error: GFError | Error): error is GFError => (
  GF_ERROR_IDENTIFIER_PROP_NAME in error
)

/**
 * Asserts that the provided error is a `SerializedGFError` and not a native JS `Error` instance or something else.
 *
 * Note: This works by determining if the given error has a `msg` property, as this is present
 * for a `SerializedGFError` object but not for native JS `Error` objects.
 *
 * @example
 * isSerializedGFError({ name: 'ENOENT', message: 'File not found', ... }) // false
 * isSerializedGFError(createGFError(...).serialize()) // true
 */
export const isSerializedGFError = (error: SerializedGFError | Error): error is SerializedGFError => (
  'msg' in error
)
