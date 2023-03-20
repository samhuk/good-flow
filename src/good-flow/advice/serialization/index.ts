import { normalizeGFString } from '../../string'
import { GFAdvice, GFTip } from '../types'
import { SerializedGFAdvice, SerializedGFTip, SerializeGFAdviceOptions } from './types'

const serializeTip = (tip: GFTip, options?: SerializeGFAdviceOptions): SerializedGFTip => {
  if (typeof tip !== 'object')
    return normalizeGFString(tip, options)

  const serializedTip: SerializedGFTip = {
    msg: normalizeGFString(tip.msg, options),
  }
  if (tip.url != null)
    serializedTip.url = tip.url

  return serializedTip
}

export const serializeAdvice = (advice: GFAdvice, options?: SerializeGFAdviceOptions): SerializedGFAdvice => {
  const serializedAdvice: SerializedGFAdvice = {
    tips: Array.isArray(advice.tips)
      ? advice.tips.map(tip => serializeTip(tip, options))
      : serializeTip(advice.tips, options),
  }
  if (advice.url != null)
    serializedAdvice.url = advice.url

  return serializedAdvice
}
