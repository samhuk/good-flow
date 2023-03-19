import { GFError } from '../error/types'
import { GFResult } from './types'

export const gfResult = <TData extends any>(data: TData, err?: GFError): GFResult<TData> => [
  data,
  err,
]
