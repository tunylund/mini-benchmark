import { miniBenchmark as mb, formatResult } from '../src/mini-benchmark'
import * as assert from 'assert'

describe('mini-benchmark', function () {

  describe('lifecycle methods', function () {

    it('should pass whatever setup returns to the test', () => {
      let actual
      const before = () => 'foo'
      const after = (ctx: string) => {}
      mb({}, before, after, (test) => {
        test('test', (ctx: string) => actual = ctx)
      })
      assert.equal(actual, 'foo')
    })

    it('should pass whatever setup returns to the after', () => {
      let actual
      const before = () => 'foo'
      const after = (ctx: string) => actual = ctx
      mb({}, before, after, (test) => {})
      assert.equal(actual, 'foo')
    })

  })

  describe('test cycle', function () {

    const before = () => 'foo'
    const after = (ctx: string) => {}

    it('should run a test 100000 times in 9 iterations', () => {
      let i = 0
      mb({}, before, after, (test) => {
        test('test', ctx => i++)
      })
      assert.equal(i, 100000 * 9)
    })

    it('should return the test results', () => {
      let testResult = { duration: 0 }
      const results = mb({}, before, after, (test) => {
        testResult = test('test', ctx => {})
      })
      assert(testResult.duration > 0)
      assert.deepEqual(results, [testResult])
    })

    it('should report regression', () => {
      let duration = 0
      const previousResults = { 'test': { name: 'test', duration: 0 } }
      const results = mb(previousResults, before, after, (test) => {
        duration = test('test', ctx => {}).duration
      })
      assert.deepEqual(results, [{
        name: 'test',
        duration: duration,
        regression: duration,
        diffPercent: 100
      }])
    })

  })

  describe('formatResult', function () {

    it('should format a result object nicely', () => {
      let testResult = {} as any
      const previousResults = { 'test': { name: 'test', duration: 0 } }
      mb(previousResults, () => {}, () => {}, (test) => {
        testResult = test('test', ctx => {})
      })
      const actual = formatResult(testResult as any)
      assert.deepEqual(actual,
        `${testResult.duration.toFixed(2)} test ${testResult.regression.toFixed(2)} (100%) regression`)
    })

  })

})
