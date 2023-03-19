import colors from 'colors/safe'

export type Colors = typeof colors

export type GFString = string | ((c: Colors) => string)
