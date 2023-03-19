import { CallSite } from 'stack-utils'
import { GFAdvice } from '../advice/types'
import { GFString } from '../string/types'

export type GFErrorOrError = GFError | Error

export type GFErrorInner = GFErrorOrError | GFErrorOrError[]

export type GFErrorOptions = {
  msg: GFString
  inner?: GFErrorInner
  advice?: GFAdvice
  stack?: CallSite[] | string
}

export type GFError = {
  msg: GFString
  inner?: GFErrorInner
  advice?: GFAdvice
  stack?: CallSite[] | string
  toLogString: () => string
}
