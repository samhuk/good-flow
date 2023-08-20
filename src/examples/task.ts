import * as fs from 'fs'
import { createGFError } from '../good-flow/error'
import { gfTry } from '../good-flow/try'
import { GFResult } from '../types'

const subTask = (path: string): GFResult<string> => gfTry(
  () => fs.readFileSync(path, { encoding: 'utf8' }),
  { msg: c => `Could not read configuration file at ${c.cyan(path)}.` },
)

export const task = (): GFResult<string[]> => {
  const path = 'nonexistent-file.txt'

  const results = [subTask(path), subTask(path)]

  const errors = results.map(r => r[1]).filter(e => e != null)

  if (errors.length > 0 != null) {
    return [results.map(r => r[0]), createGFError({
      msg: 'Could not parse configuration',
      inner: errors,
      advice: {
        url: 'https://example.com',
        tips: [
          { msg: c => `Check that configuration file at ${c.cyan(path)} exists.`, url: 'https://github.com/samhuk/good-flow' },
          c => `Check that the configuration file at ${c.cyan(path)} is accessible for your user account permissions.`,
        ],
      },
    })]
  }

  return [results.map(r => r[0])]
}

export const getSampleError = () => task()[1]
