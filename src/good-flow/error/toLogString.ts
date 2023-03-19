import colors from 'colors/safe'
import StackUtils, { CallSite } from 'stack-utils'
import { toLogString as termTreeNodeToLogString } from '../../term-tree-formatter'
import { Node, NodeContent } from '../../term-tree-formatter/types'
import { GFTip, GFAdvice } from '../advice/types'
import { normalizeGFString } from '../string'
import { GFError, GFErrorInner, GFErrorOrError } from './types'

const stackTraceTologString = (stackTraceString: string) => {
  const st = new StackUtils({ cwd: process.cwd(), internals: StackUtils.nodeInternals() })
  return st.clean(stackTraceString)
}

const singleErrorInnerToNode = (singleInner: GFErrorOrError): Node => (singleInner instanceof Error
  ? {
    content: [
      `${colors.bold('Caused by:')} [${colors.red(singleInner.name)}] ${singleInner.message}`,
      ...stackTraceTologString(singleInner.stack).trimEnd().split('\n'),
    ],
  }
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  : errorToNode(singleInner, false))

const errorInnerToNodes = (inner: GFErrorInner): Node[] => (
  Array.isArray(inner)
    ? inner.map(singleInner => singleErrorInnerToNode(singleInner))
    : [singleErrorInnerToNode(inner)])

const gfErrorToLogString = (error: GFError, isRoot: boolean) => {
  const msg = normalizeGFString(error.msg)
  const header = isRoot ? colors.bold(colors.red('Error:')) : colors.bold('Caused by:')
  return `${header} ${msg}`
}

const tipToNodeContent = (tip: GFTip): NodeContent => (typeof tip === 'object'
  ? [
    normalizeGFString(tip.msg),
    tip.url != null ? normalizeGFString(c => `For more information: ${c.cyan(tip.url)}`) : null,
  ].filter(contentItem => contentItem != null)
  : normalizeGFString(tip))

const adviceToNodes = (advice: GFAdvice): Node[] => {
  const nodes: Node[] = []

  if (advice.url != null)
    nodes.push({ content: normalizeGFString(c => `For more information see: ${c.cyan(advice.url)}`) })

  if (advice.tips != null) {
    if (Array.isArray(advice.tips)) {
      if (advice.tips.length > 0) {
        nodes.push({
          content: normalizeGFString(c => `${c.bold('Possible courses of action:')}`),
          children: advice.tips.map(tip => ({
            content: tipToNodeContent(tip),
            indicator: '* ',
          })),
        })
      }
    }
    else {
      const tipNodeContent = tipToNodeContent(advice.tips)
      const normalizedTipNodeContent = Array.isArray(tipNodeContent)
        ? tipNodeContent
        : [tipNodeContent]
      nodes.push({
        content: [
          normalizeGFString(c => `${c.bold('Possible course of action:')}`),
          ...normalizedTipNodeContent,
        ],
      })
    }
  }

  return nodes
}

const callSiteToString = (cs: CallSite) => `${cs.getFunctionName() ?? '<anonymous>'} (${cs.getFileName().replace(/\\/g, '/')}:${cs.getLineNumber()}:${cs.getColumnNumber()})`

const errorToNode = (error: GFError, isRoot: boolean): Node => ({
  content: [
    gfErrorToLogString(error, isRoot),
    ...(error.stack != null
      ? typeof error.stack === 'string'
        ? stackTraceTologString(error.stack).trimEnd().split('\n')
        : error.stack.map(callSiteToString)
      : []),
  ].filter(c => c != null),
  children: (error.inner != null ? errorInnerToNodes(error.inner) : [])
    .concat(error.advice != null ? adviceToNodes(error.advice) : []),
})

export const toLogString = (error: GFError) => {
  const node = errorToNode(error, true)
  return termTreeNodeToLogString(node)
}
