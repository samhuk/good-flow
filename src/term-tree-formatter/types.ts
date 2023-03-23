export enum IndicatorType {
  HAS_NEXT_SIBLING, // ┣-
  IS_LAST_SIBLING, // ┗-
  PARENT_HAS_NEXT_SIBLING, // ┃
  PARENT_IS_LAST_SIBLING, // ' '
}

export type NodeContent = string | string[]

export type Row = {
  isLastSibling: boolean
  hasChildren: boolean
  parentIndicatorCells: IndicatorType[]
  lastIndicatorCell: IndicatorType | string
  node: Node
  isRoot: boolean
}

export type Node = {
  indicator?: string
  content: NodeContent
  children?: Node[]
}

export type ToLogStringOptions = {
  /**
   * @default 0
   */
  linesBetweenNodes?: number
}

export type ResolvedToLogStringOptions = Required<ToLogStringOptions>
