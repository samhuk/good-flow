/**
 * This file defines the public API of the package. Everything here will be available from
 * the top-level package name when importing as an npm package.
 *
 * E.g. `import ... from 'good-flow`
 *
 * Note: Importing anything from here will result in the co-importation of the `colors` package,
 * which is not valid in browser environments.
 */

export { createGFError } from './good-flow/error'
export { gfTry } from './good-flow/try'
export { isGFError } from './good-flow/error/identification'

export * from './types'
