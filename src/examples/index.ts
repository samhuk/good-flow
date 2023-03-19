import * as fs from 'fs'
import { exit } from 'process'
import { createGFError } from '../good-flow/error'
import { GFResult } from '../good-flow/result/types'

const subTask = (path: string): GFResult<string> => {
  try {
    return [fs.readFileSync(path, { encoding: 'utf8' }), null]
  }
  catch (e: any) {
    return [undefined, createGFError({
      msg: c => `Could not read configuration file at ${c.cyan(path)}.`,
      inner: e,
    })]
  }
}

const task = (): GFResult<string[]> => {
  const path = 'nonexistent-file.txt'

  const results = [subTask(path), subTask(path)]

  const errors = results.map(r => r[1]).filter(e => e != null)

  if (errors.length > 0 != null) {
    return [results.map(r => r[0]), createGFError({
      msg: 'Could not parse configuration',
      inner: errors,
      advice: {
        tips: [
          { msg: c => `Check that configuration file at ${c.cyan(path)} exists.`, url: 'https://github.com/samhuk/good-flow' },
          c => `Check that the configuration file at ${c.cyan(path)} is accessible for your user account permissions.`,
        ],
      },
    })]
  }

  return [results.map(r => r[0])]
}

const main = () => {
  const [taskResult, err] = task()
  if (err != null) {
    console.log(err.toLogString())

    exit(1)
  }

  exit(0)
}

main()
