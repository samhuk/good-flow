import colors from 'colors/safe'

export type Colors = typeof colors

export type NormalizeGFStringOptions = {
  /**
   * @default false
   */
  disableColors?: boolean
}

export type GFString = string | ((c: Colors) => string)
