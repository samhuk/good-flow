import { gfTryAsync } from './async'
import { SerializedGFError } from '../../serialized'
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

const failingTryerReject = () => new Promise((res, rej) => {
  setTimeout(() => {
    rej(new Error('Incorrect data.'))
  }, 10)
})

const passingTryer = () => new Promise(res => {
  setTimeout(() => res(EXPECTED_DATA), 10)
})

describe('good-flow/try/async', () => {
  describe('gfTryAsync', () => {
    test('passing tryer', async () => {
      assertPassingTryer(
        await gfTryAsync(passingTryer, { msg: 'Could not do task.' }),
      )
    })

    describe('GFError options catcher', () => {
      test('failing tryer', async () => {
        assertFailingTryer(
          await gfTryAsync(failingTryerReject, { msg: 'Could not do task.' }),
        )
      })

      test('failing tryer, including data.', async () => {
        assertFailingTryerIncludingData(
          await gfTryAsync(failingTryerReject, { msg: 'Could not do task.', resultData: EXPECTED_DATA }),
        )
      })
    })
  })
})
