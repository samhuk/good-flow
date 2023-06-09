export type SerializedGFTip = string | { msg: string, url?: string }

export type SerializedGFTips = SerializedGFTip | SerializedGFTip[]

export type SerializedGFAdvice = {
  url?: string
  tips?: SerializedGFTips
}
