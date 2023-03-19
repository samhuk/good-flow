import { GFString } from '../string/types'

export type GFTip = GFString | { msg: GFString, url?: string }

export type GFTips = GFTip | GFTip[]

export type GFAdvice = {
  url?: string
  tips?: GFTips
}
