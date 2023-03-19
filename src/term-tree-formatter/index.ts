import { createIndentationString } from '../goflow/common'
import { IndicatorType, Node, Row } from './types'

const INDICATOR_TYPE_TO_STRING: { [type in IndicatorType]: string } = {
  [IndicatorType.HAS_NEXT_SIBLING]: '┣━ ',
  [IndicatorType.IS_LAST_SIBLING]: '┗━ ',
  [IndicatorType.PARENT_HAS_NEXT_SIBLING]: '┃  ',
  [IndicatorType.PARENT_IS_LAST_SIBLING]: '   ',
}

const rowToString = (row: Row): string => {
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

  const shouldContnetLinesSeparatorEndWithContinuationIndicator = !isLastIndicatorCustom && !row.isLastSibling
  const contentLinesSeparator = `${parentIndicatorsStr}${shouldContnetLinesSeparatorEndWithContinuationIndicator ? INDICATOR_TYPE_TO_STRING[IndicatorType.PARENT_HAS_NEXT_SIBLING] : createIndentationString(lastIndicatorStr.length)}`

  const contentStr = Array.isArray(row.node.content)
    ? row.node.content.join(`\n${contentLinesSeparator}`)
    : row.node.content

  return `${indicatorsStr}${contentStr}`
}

const rowsToString = (rows: Row[]): string => rows.map(rowToString).join('\n')

const nodeToRow = (
  node: Node,
  depth: number,
  parentHasNextSiblingIndices: { [x: number]: boolean },
  isLastSibling: boolean,
  isRootNode: boolean,
): Row => {
  const row: Row = {
    isLastSibling,
    lastIndicatorCell: !isRootNode
      ? node.indicator ?? (isLastSibling
        ? IndicatorType.IS_LAST_SIBLING
        : IndicatorType.HAS_NEXT_SIBLING)
      : null,
    parentIndicatorCells: [],
    node,
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

export const toLogString = (node: Node) => {
  const startDepth = 0
  const rootRow = nodeToRow(node, startDepth, [], true, true)
  const rows = nodesToRows(node.children, startDepth, [], { y: 0 })
  return rowsToString([rootRow].concat(rows))
}
