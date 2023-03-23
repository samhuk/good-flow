const PREMADE_INDENTS: { [n: number]: string } = {
  0: '',
  1: ' ',
  2: '  ',
  3: '   ',
  4: '    ',
  5: '     ',
  6: '      ',
  7: '       ',
  8: '        ',
}

const _createIndentationString = (n: number): string => {
  let s = ''
  for (let i = 0; i < n; i += 1)
    s += ' '
  return s
}

export const createIndentationString = (n: number): string => PREMADE_INDENTS[n] ?? _createIndentationString(n)

export const ensureArray = <T extends any>(input: T | T[]): T[] => (Array.isArray(input)
  ? input
  : [input])

export const repeatStr = (s: string, n: number): string => {
  let result = ''
  for (let i = 0; i < n; i += 1)
    result += s
  return result
}

export const repeat = <T extends any>(item: T, n: number): T[] => {
  const result = []
  for (let i = 0; i < n; i += 1)
    result.push(item)
  return result
}
