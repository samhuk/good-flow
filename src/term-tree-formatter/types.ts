export enum IndicatorType {
  HAS_NEXT_SIBLING, // ┣-
  IS_LAST_SIBLING, // ┗-
  PARENT_HAS_NEXT_SIBLING, // ┃
  PARENT_IS_LAST_SIBLING, // ' '
}

export type NodeContent = string | string[]

export type Row = {
  isLastSibling: boolean
  parentIndicatorCells: IndicatorType[]
  lastIndicatorCell: IndicatorType | string
  node: Node
}

export type Node = {
  indicator?: string
  content: NodeContent
  children?: Node[]
}
