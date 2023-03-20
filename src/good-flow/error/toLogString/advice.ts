import { Node, NodeContent } from '../../../term-tree-formatter/types'
import { GFTip, GFAdvice } from '../../advice/types'
import { ensureArray } from '../../common'
import { normalizeGFString } from '../../string'

const tipToNodeContent = (tip: GFTip): NodeContent => (typeof tip === 'object'
  ? [normalizeGFString(tip.msg)]
    .concat(tip.url != null ? normalizeGFString(c => `For more information: ${c.cyan(tip.url)}`) : [])
  : normalizeGFString(tip))

export const adviceToNodes = (advice: GFAdvice): Node[] => {
  const adviceUrlNodes: Node[] = advice.url != null
    ? [
      { content: normalizeGFString(c => `For more information see: ${c.cyan(advice.url)}`) },
    ]
    : []
  const adviceTipsNodes: Node[] = advice.tips != null
    ? Array.isArray(advice.tips)
      ? advice.tips.length > 0
        ? [
          {
            content: normalizeGFString(c => `${c.bold('Possible courses of action:')}`),
            children: advice.tips.map(tip => ({
              content: tipToNodeContent(tip),
              indicator: '* ',
            })),
          },
        ]
        : []
      : [
        {
          content: [normalizeGFString(c => `${c.bold('Possible course of action:')}`)]
            .concat(ensureArray(tipToNodeContent(advice.tips))),
        },
      ]
    : []
  return adviceUrlNodes.concat(adviceTipsNodes)
}
