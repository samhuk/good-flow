import colors from 'colors/safe'
import { GFString } from './types'

export const normalizeGFString = (s: GFString): string => (
  typeof s === 'function'
    ? s(colors)
    : s
)
