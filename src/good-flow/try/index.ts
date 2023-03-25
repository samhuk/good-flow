import { createGFError } from '../error'
import { isGFErrorAndNotOptions } from '../error/identification'
import { GFResult } from '../result/types'
import { ArrayCatcher, GFTry, ObjectCatcher } from './types'

const createGFResultFromArrayCatcher = <TData extends any>(
  catcher: ArrayCatcher,
  e: any,
  addInner: boolean,
): GFResult<TData> => {
  const data = catcher[0]
  const errorOrErrorOptions = catcher[1]
  const error = isGFErrorAndNotOptions(errorOrErrorOptions)
    ? errorOrErrorOptions
    : createGFError(errorOrErrorOptions)

  if (addInner)
    error.addInner(e)

  return [data, error]
}

const createGFResultFromObjectCatcher = <TData extends any>(
  catcher: ObjectCatcher<TData>,
  e: any,
  addInner: boolean,
): GFResult<TData> => {
  const isGFError = isGFErrorAndNotOptions(catcher)
  const error = isGFError
    ? catcher
    : createGFError(catcher)

  if (addInner)
    error.addInner(e)

  const data = isGFError ? undefined : catcher.data

  return [data, error]
}

/**
 * Runs the given `tryer` function, catching the error it may throw with the given `catcher`.
 *
 * The `catcher` can be defined either as:
 * * A precreated `GFError`.
 * * Options to create a `GFError`.
 * * A `GFResult` that has either:
 *   * A precreated `GFError`.
 *   * Options to create a `GFError`.
 * * A function that takes the caught error and returns the previously mentioned `GFResult`.
 *
 * This makes try-catch logic flatter and integrates it more smoothly with GoodFlow.
 *
 * @example
 * const task = (path: string): GFResult<string> => gfTry(
 *   // Define tryer
 *   () => fs.readFileSync(path, { encoding: 'utf8' }),
 *   // -----------------------
 *   // -- Possible catchers --
 *   // -----------------------
 *   // GFError options catcher
 *   { msg: 'Error occured.' },
 *   // GFError catcher
 *   createGFError({ msg: 'Error occured.' }),
 *   // GFResult (with GFError options) catcher
 *   [undefined, { msg: 'Error occured.' }],
 *   // GFResult (with GFError) catcher
 *   [undefined, createGFError({ msg: 'Error occured.' })],
 *   // Function returning GFResult (with GFError options) catcher
 *   e => [undefined, { msg: 'Error occured.' }],
 *   // Function returning GFResult (with GFError) catcher
 *   e => [undefined, createGFError({ msg: 'Error occured.' })],
 * )
 */
export const gfTry: GFTry = (
  tryer,
  catcher,
  addInner,
) => {
  try {
    return [tryer()]
  }
  catch (e: any) {
    const _addInner = addInner ?? true
    if (Array.isArray(catcher))
      return createGFResultFromArrayCatcher(catcher, e, _addInner)

    if (typeof catcher === 'function')
      return createGFResultFromArrayCatcher(catcher(e), e, _addInner)

    return createGFResultFromObjectCatcher(catcher, e, _addInner)
  }
}
