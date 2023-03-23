import { createIndentationString, ensureArray, repeatStr } from '../good-flow/common'
import { IndicatorType, Node, ResolvedToLogStringOptions, Row, ToLogStringOptions } from './types'

const INDICATOR_TYPE_TO_STRING: { [type in IndicatorType]: string } = {
  [IndicatorType.HAS_NEXT_SIBLING]: '┣━ ',
  [IndicatorType.IS_LAST_SIBLING]: '┗━ ',
  [IndicatorType.PARENT_HAS_NEXT_SIBLING]: '┃  ',
  [IndicatorType.PARENT_IS_LAST_SIBLING]: '   ',
}

const PARENT_HAS_NEXT_SIBLING_INDICATOR_STRING = INDICATOR_TYPE_TO_STRING[IndicatorType.PARENT_HAS_NEXT_SIBLING]

const rowToString = (row: Row, options: ResolvedToLogStringOptions): string => {
  let parentIndicatorsStr = ''
  for (let i = 0; i < row.parentIndicatorCells.length; i += 1)
    parentIndicatorsStr += INDICATOR_TYPE_TO_STRING[row.parentIndicatorCells[i]]

  const isLastIndicatorCustom = row.node.indicator != null

  const lastIndicatorStr = row.lastIndicatorCell != null
    ? typeof row.lastIndicatorCell === 'number'
      ? INDICATOR_TYPE_TO_STRING[row.lastIndicatorCell]
      : row.lastIndicatorCell
    : ''

  const indicatorsStr = `${parentIndicatorsStr}${lastIndicatorStr}`

  const contentLinesSeparatorSuffix = !isLastIndicatorCustom && !row.isLastSibling
    ? PARENT_HAS_NEXT_SIBLING_INDICATOR_STRING
    : createIndentationString(lastIndicatorStr.length)

  const contentLinesSeparator = `${parentIndicatorsStr}${contentLinesSeparatorSuffix}`

  const rawNodeContent = ensureArray(row.node.content)
  const nodeContent = rawNodeContent

  const contentStr = nodeContent.join(`\n${contentLinesSeparator}`)

  let emptyLinesAfterNodeContentSeperatorSuffix = ''
  if (!isLastIndicatorCustom) {
    if (!row.isLastSibling)
      emptyLinesAfterNodeContentSeperatorSuffix += PARENT_HAS_NEXT_SIBLING_INDICATOR_STRING
    else if (!row.isRoot)
      emptyLinesAfterNodeContentSeperatorSuffix += createIndentationString(PARENT_HAS_NEXT_SIBLING_INDICATOR_STRING.length)
    if (row.hasChildren && !isLastIndicatorCustom)
      emptyLinesAfterNodeContentSeperatorSuffix += PARENT_HAS_NEXT_SIBLING_INDICATOR_STRING
  }
  const emptyLinesAfterNodeContentSuffix = options.linesBetweenNodes > 0
    ? repeatStr(`\n${parentIndicatorsStr}${emptyLinesAfterNodeContentSeperatorSuffix}`, options.linesBetweenNodes).trimEnd()
    : ''

  return `${indicatorsStr}${contentStr}${emptyLinesAfterNodeContentSuffix}`
}

const rowsToString = (rows: Row[], options: ResolvedToLogStringOptions): string => (
  rows.map(r => rowToString(r, options)).join('\n')
)

const nodeToRow = (
  node: Node,
  depth: number,
  parentHasNextSiblingIndices: { [x: number]: boolean },
  isLastSibling: boolean,
  isRootNode: boolean,
): Row => {
  const row: Row = {
    isLastSibling,
    hasChildren: node.children != null && node.children.length > 0,
    lastIndicatorCell: !isRootNode
      ? node.indicator ?? (isLastSibling
        ? IndicatorType.IS_LAST_SIBLING
        : IndicatorType.HAS_NEXT_SIBLING)
      : null,
    parentIndicatorCells: [],
    node,
    isRoot: isRootNode,
  }
  for (let x = 0; x < depth; x += 1) {
    if (parentHasNextSiblingIndices[x])
      row.parentIndicatorCells.push(IndicatorType.PARENT_HAS_NEXT_SIBLING)
    else
      row.parentIndicatorCells.push(IndicatorType.PARENT_IS_LAST_SIBLING)
  }
  return row
}

const nodesToRows = (nodes: Node[], depth: number, parentHasNextSiblingIndices: { [x: number]: boolean }, state: { y: number }): Row[] => {
  const rows: Row[] = []

  for (let y = 0; y < nodes.length; y += 1) {
    const isLastSibling = y === nodes.length - 1
    const node = nodes[y]
    // -- Convert current node to row
    const row = nodeToRow(node, depth, parentHasNextSiblingIndices, isLastSibling, false)
    // -- Add node's row
    rows.push(row)
    state.y += 1
    // -- Add node's child nodes as rows
    if (node.children != null && node.children.length > 0) {
      const parentHasNextSiblingIndicesForChildren = isLastSibling
        ? parentHasNextSiblingIndices
        : { ...parentHasNextSiblingIndices, [depth]: true }
      const childRows = nodesToRows(node.children, depth + 1, parentHasNextSiblingIndicesForChildren, state)
      const numChildRows = childRows.length
      for (let i = 0; i < numChildRows; i += 1)
        rows.push(childRows[i])
      state.y += numChildRows
    }
  }
  return rows
}

const resolveOptions = (options: ToLogStringOptions | undefined | null): ResolvedToLogStringOptions => ({
  linesBetweenNodes: options?.linesBetweenNodes ?? 0,
})

export const toLogString = (node: Node, options?: ToLogStringOptions) => {
  const resolvedOptions = resolveOptions(options)
  const startDepth = 0
  const rootRow = nodeToRow(node, startDepth, [], true, true)
  const rows = nodesToRows(node.children, startDepth, [], { y: 0 })
  return rowsToString([rootRow].concat(rows), resolvedOptions)
}
