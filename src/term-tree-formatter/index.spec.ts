import { toLogString } from '.'
import { Node } from './types'

const EXAMPLE_NODE: Node = {
  content: 'A',
  children: [
    {
      content: 'B',
      children: [
        {
          content: 'C',
          children: [
            {
              content: 'D',
              children: [
                {
                  content: '1',
                },
                {
                  content: '2',
                },
                {
                  content: '3',
                },
              ],
            },
          ],
        },
        {
          content: 'E',
        },
        {
          content: 'F',
        },
      ],
    },
    {
      content: 'G',
      children: [
        {
          content: 'H',
        },
      ],
    },
  ],
}

describe('term-tree-formatter', () => {
  describe('toLogString', () => {
    const fn = toLogString

    test('basic test', () => {
      const result = fn(EXAMPLE_NODE)

      expect(result).toEqual(`A
┣━ B
┃  ┣━ C
┃  ┃  ┗━ D
┃  ┃     ┣━ 1
┃  ┃     ┣━ 2
┃  ┃     ┗━ 3
┃  ┣━ E
┃  ┗━ F
┗━ G
   ┗━ H`)
    })

    test('linesBetweenNodes = 1', () => {
      const result = fn(EXAMPLE_NODE, { linesBetweenNodes: 1 })

      expect(result).toEqual(`A
┃
┣━ B
┃  ┃
┃  ┣━ C
┃  ┃  ┃
┃  ┃  ┗━ D
┃  ┃     ┃
┃  ┃     ┣━ 1
┃  ┃     ┃
┃  ┃     ┣━ 2
┃  ┃     ┃
┃  ┃     ┗━ 3
┃  ┃
┃  ┣━ E
┃  ┃
┃  ┗━ F
┃
┗━ G
   ┃
   ┗━ H`)
    })

    test('linesBetweenNodes = 2', () => {
      const result = fn(EXAMPLE_NODE, { linesBetweenNodes: 2 })

      expect(result).toEqual(`A
┃  
┃
┣━ B
┃  ┃  
┃  ┃
┃  ┣━ C
┃  ┃  ┃  
┃  ┃  ┃
┃  ┃  ┗━ D
┃  ┃     ┃  
┃  ┃     ┃
┃  ┃     ┣━ 1
┃  ┃     ┃  
┃  ┃     ┃
┃  ┃     ┣━ 2
┃  ┃     ┃  
┃  ┃     ┃
┃  ┃     ┗━ 3
┃  ┃        
┃  ┃
┃  ┣━ E
┃  ┃  
┃  ┃
┃  ┗━ F
┃     
┃
┗━ G
   ┃  
   ┃
   ┗━ H`)
    })
  })
})
