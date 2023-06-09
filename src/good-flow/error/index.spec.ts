import { createGFError } from '.'

describe('good-flow/gf-error', () => {
  describe('createGFError', () => {
    const fn = createGFError

    test('init with only msg GFString', () => {
      expect(() => fn('This is an error')).not.toThrow()
    })

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

    test('wrap', () => {
      const inner = fn({ msg: 'Inner error', stack: null })
      const outer = fn({ msg: 'Outer error', stack: null })

      const newOuter = inner.wrap(outer).serialize()

      expect(newOuter).toEqual({
        msg: 'Outer error',
        inner: {
          msg: 'Inner error',
        },
      })
    })

    test('addInner', () => {
      const inner1 = fn({ msg: 'Inner error 1', stack: null })
      const inner2 = fn({ msg: 'Inner error 2', stack: null })
      const outer = fn({ msg: 'Outer error', stack: null })

      const newOuter = outer
        .addInner(inner1)
        .addInner(inner2)
        .serialize()

      expect(newOuter).toEqual({
        msg: 'Outer error',
        inner: [
          { msg: 'Inner error 1' },
          { msg: 'Inner error 2' },
        ],
      })
    })

    test('clone', () => {
      const originalErr = fn({ msg: 'Error', data: 123, advice: { url: 'foo', tips: [] }, stack: null })

      const errClone = originalErr.clone()

      expect(errClone.serialize()).toEqual({
        msg: 'Error',
        data: 123,
        advice: {
          url: 'foo',
          tips: [],
        },
      })

      const inner1 = fn({ msg: 'Inner error', stack: null })
      errClone.addInner(inner1)

      // Expect error clone to be affected
      expect(errClone.serialize()).toEqual({
        msg: 'Error',
        inner: { msg: 'Inner error' },
        data: 123,
        advice: {
          url: 'foo',
          tips: [],
        },
      })

      // Expect original error to be unaffected
      expect(originalErr.serialize()).toEqual({
        msg: 'Error',
        data: 123,
        advice: {
          url: 'foo',
          tips: [],
        },
      })
    })
  })
})
