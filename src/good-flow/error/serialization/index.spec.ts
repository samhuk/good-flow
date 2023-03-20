import { serialize } from '.'
import { getSampleError } from '../../../examples/task'

describe('good-flow/error/serialization', () => {
  describe('serialize', () => {
    const fn = serialize
    test('basic test', () => {
      const error = getSampleError()

      const result = fn(error, {
        disableColors: true,
        customStackTraceSerializer: false,
        nativeStackTraceSerializer: false,
      })

      expect(result).toEqual({
        advice: {
          tips: [{
            msg: 'Check that configuration file at nonexistent-file.txt exists.',
            url: 'https://github.com/samhuk/good-flow',
          }, 'Check that the configuration file at nonexistent-file.txt is accessible for your user account permissions.'],
        },
        inner: [{
          inner: {
            code: 'ENOENT',
            errno: -4058,
            message: "ENOENT: no such file or directory, open 'nonexistent-file.txt'",
            name: 'Error',
            path: 'nonexistent-file.txt',
            syscall: 'open',
          },
          msg: 'Could not read configuration file at nonexistent-file.txt.',
        }, {
          inner: {
            code: 'ENOENT',
            errno: -4058,
            message: "ENOENT: no such file or directory, open 'nonexistent-file.txt'",
            name: 'Error',
            path: 'nonexistent-file.txt',
            syscall: 'open',
          },
          msg: 'Could not read configuration file at nonexistent-file.txt.',
        }],
        msg: 'Could not parse configuration',
      })
    })

    test('exluding native errors', () => {
      const error = getSampleError()

      const result = fn(error, {
        disableColors: true,
        customStackTraceSerializer: false,
        nativeStackTraceSerializer: false,
        nativeErrorSerializer: false,
      })

      expect(result).toEqual({
        advice: {
          tips: [{
            msg: 'Check that configuration file at nonexistent-file.txt exists.',
            url: 'https://github.com/samhuk/good-flow',
          }, 'Check that the configuration file at nonexistent-file.txt is accessible for your user account permissions.'],
        },
        inner: [{
          msg: 'Could not read configuration file at nonexistent-file.txt.',
        }, {
          msg: 'Could not read configuration file at nonexistent-file.txt.',
        }],
        msg: 'Could not parse configuration',
      })
    })
  })
})
