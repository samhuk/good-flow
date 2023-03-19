import StackUtils from 'stack-utils'
import { toLogString } from './toLogString'
import { GFError, GFErrorOptions } from './types'

export const createGFError = (options: GFErrorOptions): GFError => {
  const error: GFError = {
    msg: options.msg,
    inner: options.inner,
    advice: options.advice,
    stack: options.stack ?? new StackUtils({ cwd: process.cwd(), internals: StackUtils.nodeInternals() }).capture(2).slice(1),
    toLogString: () => toLogString(error),
  }

  return error
}
