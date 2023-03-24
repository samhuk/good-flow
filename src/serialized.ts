/**
 * This file defines the public API of the serialized side of the package. This does not
 * include any code that is Node.js-dependant such as the `colors` package.
 *
 * Things exported from here are available like so: `import ... from 'good-flow/serialized`
 */

export type { SerializedGFError, SerializedStackTrace } from './good-flow/error/serialized/types'
export type { SerializedGFAdvice, SerializedGFTip, SerializedGFTips } from './good-flow/advice/serialized/types'
