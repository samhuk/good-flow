import { gfTry } from '.'
import { SerializedGFError } from '../../serialized'
import { createGFError } from '../error'
import { SerializeGFErrorOptions } from '../error/serialize/types'

const EXPECTED_SERIALIZED_ERROR: SerializedGFError = {
  inner: {
    message: 'Incorrect data.',
    name: 'Error',
    stack: '[native stack trace]',
  },
  msg: 'Could not do task.',
  stack: '[custom stack trace]',
}

const EXPECTED_DATA = 123

const TEST_SERIALIZE_OPTIONS: SerializeGFErrorOptions = {
  nativeStackTraceSerializer: () => '[native stack trace]',
  customStackTraceSerializer: () => '[custom stack trace]',
}

const assertFailingTryer = (result: any, options?: {
  expectedError?: any
  expectedData?: any
}) => {
  expect(result[0])
    .toBe(options != null
      ? ('expectedData' in options ? options.expectedData : undefined)
      : undefined)
  expect(result[1].serialize(TEST_SERIALIZE_OPTIONS))
    .toEqual(options != null
      ? ('expectedError' in options ? options.expectedError : EXPECTED_SERIALIZED_ERROR)
      : EXPECTED_SERIALIZED_ERROR)
}

const assertFailingTryerIncludingData = (result: any, options?: {
  expectedError?: any
  expectedData?: any
}) => {
  expect(result[0])
    .toBe(options != null
      ? ('expectedData' in options ? options.expectedData : EXPECTED_DATA)
      : EXPECTED_DATA)
  expect(result[1].serialize(TEST_SERIALIZE_OPTIONS))
    .toEqual(options != null
      ? ('expectedError' in options ? options.expectedError : EXPECTED_SERIALIZED_ERROR)
      : EXPECTED_SERIALIZED_ERROR)
}

const assertPassingTryer = (result: any) => {
  expect(result).toEqual([
    EXPECTED_DATA,
  ])
}

const failingTryer = () => {
  throw new Error('Incorrect data.')
}

const passingTryer = () => EXPECTED_DATA

describe('good-flow/try', () => {
  describe('gfTry', () => {
    test('passing tryer', () => {
      assertPassingTryer(
        gfTry(passingTryer, { msg: 'Could not do task.' }),
      )
    })

    describe('GFError options catcher', () => {
      test('failing tryer', () => {
        assertFailingTryer(
          gfTry(failingTryer, { msg: 'Could not do task.' }),
        )
      })

      test('failing tryer, including data.', () => {
        assertFailingTryerIncludingData(
          gfTry(failingTryer, { msg: 'Could not do task.', data: EXPECTED_DATA }),
        )
      })
    })

    describe('GFError catcher', () => {
      test('failing tryer', () => {
        assertFailingTryer(
          gfTry(failingTryer, createGFError({ msg: 'Could not do task.' })),
        )
      })

      test('failing tryer, exlcuding inner', () => {
        assertFailingTryer(
          gfTry(failingTryer, createGFError({ msg: 'Could not do task.' })),
        )
      })
    })

    describe('GFResult (with GFError options) catcher', () => {
      test('basic test', () => {
        assertFailingTryer(
          gfTry(failingTryer, [undefined, { msg: 'Could not do task.' }]),
        )
      })
    })

    describe('GFResult (with GFError) catcher', () => {
      test('basic test', () => {
        assertFailingTryer(
          gfTry(failingTryer, [undefined, createGFError({ msg: 'Could not do task.' })]),
        )
      })
    })

    describe('Function returning GFResult (with GFError options) catcher', () => {
      test('basic test', () => {
        assertFailingTryer(
          gfTry(failingTryer, e => [undefined, { msg: 'Could not do task.' }]),
        )
      })
    })

    describe('Function returning GFResult (with GFError) catcher', () => {
      test('basic test', () => {
        assertFailingTryer(
          gfTry(failingTryer, e => [undefined, createGFError({ msg: 'Could not do task.' })]),
        )
      })
    })
  })
})
