import { createGFError } from '.'

describe('good-flow/gf-error', () => {
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

        // Mock stack trace line renderers to ensure consistent testable result
        const result = instance.toLogString({
          customStackTraceRenderer: () => ['stack trace line 1', 'stack trace line 2'],
          nativeStackTraceRenderer: () => ['stack trace line 1', 'stack trace line 2'],
        })

        expect(result).toBe(`[1m[31mError:[39m[22m Could not complete task.
stack trace line 1
stack trace line 2
┗━ [1m[1mCaused by:[1m[22m File [36m./foo/bar[39m not found.
   stack trace line 1
   stack trace line 2
   ┗━ [1mCaused by:[22m [[31mError[39m] ENOENT: File not found.
      stack trace line 1
      stack trace line 2`)
      })
    })

    test('serialize', () => {
      const instance = fn({
        msg: 'Could not complete task.',
        inner: fn({
          msg: c => `File ${c.cyan('./foo/bar')} not found.`,
          inner: new Error('ENOENT: File not found.'),
        }),
      })

      const result = instance.serialize({
        customStackTraceSerializer: callSites => '[fixed stack trace]',
        nativeStackTraceSerializer: stack => '[fixed stack trace]',
      })

      expect(result).toEqual({
        msg: 'Could not complete task.',
        stack: '[fixed stack trace]',
        inner: {
          msg: 'File \u001b[36m./foo/bar\u001b[39m not found.',
          stack: '[fixed stack trace]',
          inner: {
            name: 'Error',
            message: 'ENOENT: File not found.',
            stack: '[fixed stack trace]',
          },
        },
      })
    })

    test('log', () => {
      const instance = fn({
        msg: 'Could not complete task.',
        inner: fn({
          msg: c => `File ${c.cyan('./foo/bar')} not found.`,
          inner: new Error('ENOENT: File not found.'),
        }),
      })

      expect(() => instance.log()).not.toThrow()
    })
  })
})
