import * as fs from 'fs'
import { toLogString } from '.'
import { Node } from './types'

describe('term-tree-formatter', () => {
  describe('toLogString', () => {
    const fn = toLogString

    test('basic test', () => {
      const nodes: Node = {
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

      const str = fn(nodes)

      expect(str).toEqual(`A
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
  })
})
