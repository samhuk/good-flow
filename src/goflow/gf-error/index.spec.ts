import { createGFError } from '.'
import * as fs from 'fs'

describe('goflow/gf-error', () => {
  describe('createGFError', () => {
    const fn = createGFError

    describe('toLogString', () => {
      test('basic test', () => {
        const instance = fn({
          msg: 'Could not complete task.',
          inner: fn({
            msg: c => `File ${c.cyan('./foo/bar')} not found.`,
            inner: new Error('ENOENT: File not found.'),
          }),
        })

        const result = instance.toLogString()

        fs.writeFileSync('out.dat', result)

        // eslint-disable-next-line max-len
        expect(result).toBe(`[1m[31mError:[39m[22m Could not complete task.
<anonymous> (C:/Users/samhuk/workspace/ts-packages/goflow/build-test/goflow/gf-error/index.spec.js:33:26)
┗━ [1mCaused by:[22m File [36m./foo/bar[39m not found.
   <anonymous> (C:/Users/samhuk/workspace/ts-packages/goflow/build-test/goflow/gf-error/index.spec.js:35:18)
   ┗━ [1mCaused by:[22m [[31mError[39m] ENOENT: File not found.
      Object.<anonymous> (src/goflow/gf-error/index.spec.ts:14:20)
      Promise.then.completed (node_modules/jest-circus/build/utils.js:293:28)
      new Promise (<anonymous>)
      callAsyncCircusFn (node_modules/jest-circus/build/utils.js:226:10)
      _callCircusTest (node_modules/jest-circus/build/run.js:297:40)
      _runTest (node_modules/jest-circus/build/run.js:233:3)
      _runTestsForDescribeBlock (node_modules/jest-circus/build/run.js:135:9)
      _runTestsForDescribeBlock (node_modules/jest-circus/build/run.js:130:9)
      _runTestsForDescribeBlock (node_modules/jest-circus/build/run.js:130:9)
      _runTestsForDescribeBlock (node_modules/jest-circus/build/run.js:130:9)
      run (node_modules/jest-circus/build/run.js:68:3)
      runAndTransformResultsToJestFormat (node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapterInit.js:122:21)
      jestAdapter (node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapter.js:79:19)
      runTestInternal (node_modules/jest-runner/build/runTest.js:367:16)
      runTest (node_modules/jest-runner/build/runTest.js:444:34)`)
      })
    })
  })
})
