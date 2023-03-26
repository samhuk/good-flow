import { GFError, GFErrorOptions } from '../error/types'
import { GFResult } from '../result/types'

export type ObjectCatcher<TData extends any = any> =
  (
    GFErrorOptions & {
      /**
       * Optional data to ainclude in the GFResult.
       *
       * @default undefined
       */
      resultData?: TData
    }
  )
  | GFError

export type ObjectCatcherWithoutData = Omit<ObjectCatcher, 'data'>

export type ArrayCatcher<TData extends any = any> = [data: TData, error?: ObjectCatcherWithoutData]

export type FunctionCatcher<
  TData extends any = any,
> = ((e: any) => ArrayCatcher<TData>)

export type GFCatcher<TData extends any = any> = ArrayCatcher<TData>
  | FunctionCatcher<TData>
  | ObjectCatcher<TData>

export type GFTry<TData extends any = any, TCatcher extends GFCatcher<TData> = GFCatcher<TData>> = (
  tryer: () => TData,
  catchers: TCatcher,
  /**
   * Controls whether the error that is caught is automatically added as an inner to the provided error.
   *
   * @types true
   */
  addInner?: boolean
) => GFResult<TData>
