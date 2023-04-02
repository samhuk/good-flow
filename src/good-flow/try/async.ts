import { createGFResultFromArrayCatcher, createGFResultFromObjectCatcher } from '.'
import { GFTryAsync } from './types'

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
export const gfTryAsync: GFTryAsync = async (
  tryer,
  catcher,
  addInner,
) => {
  try {
    const resultData = await tryer()
    return [resultData]
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
