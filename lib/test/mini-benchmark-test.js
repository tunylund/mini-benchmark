"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mini_benchmark_1 = require("../src/mini-benchmark");
const assert = require("assert");
describe('mini-benchmark', function () {
    describe('lifecycle methods', function () {
        it('should pass whatever setup returns to the test', () => {
            let actual;
            const before = () => 'foo';
            const after = (ctx) => { };
            mini_benchmark_1.miniBenchmark([], before, after, (test) => {
                test('test', (ctx) => actual = ctx);
            });
            assert.equal(actual, 'foo');
        });
        it('should pass whatever setup returns to the after', () => {
            let actual;
            const before = () => 'foo';
            const after = (ctx) => actual = ctx;
            mini_benchmark_1.miniBenchmark([], before, after, (test) => { });
            assert.equal(actual, 'foo');
        });
    });
    describe('test cycle', function () {
        const before = () => 'foo';
        const after = (ctx) => { };
        it('should run a test 100000 times in 9 iterations', () => {
            let i = 0;
            mini_benchmark_1.miniBenchmark([], before, after, (test) => {
                test('test', ctx => i++);
            });
            assert.equal(i, 100000 * 9);
        });
        it('should return the test results', () => {
            let testResult = { duration: 0 };
            const results = mini_benchmark_1.miniBenchmark([], before, after, (test) => {
                testResult = test('test', ctx => { });
            });
            assert(testResult.duration > 0);
            assert.deepEqual(results, [testResult]);
        });
        it('should report regression', () => {
            let duration = 0;
            const previousResults = [{ name: 'test', duration: 0 }];
            const results = mini_benchmark_1.miniBenchmark(previousResults, before, after, (test) => {
                duration = test('test', ctx => { }).duration;
            });
            assert.deepEqual(results, [{
                    name: 'test',
                    duration: duration,
                    regression: duration,
                    diffPercent: 100
                }]);
        });
    });
    describe('formatResult', function () {
        it('should ignore regression that is smaller than threshold', () => {
            const testResult = {
                name: 'test',
                duration: 100.0000,
                regression: 5.0000,
                diffPercent: 5
            };
            const actual = mini_benchmark_1.formatResult(testResult, 10);
            assert.deepEqual(actual, `100.00 test`);
        });
        it('should format a result object with regression nicely', () => {
            const testResult = {
                name: 'test',
                duration: 100.0000,
                regression: 50.0000,
                diffPercent: 50
            };
            const actual = mini_benchmark_1.formatResult(testResult);
            assert.deepEqual(actual, `100.00 test +50.00 50% regression`);
        });
        it('should format a result object with improvement nicely', () => {
            const testResult = {
                name: 'test',
                duration: 50.0000,
                regression: -50.0000,
                diffPercent: -50
            };
            const actual = mini_benchmark_1.formatResult(testResult);
            assert.deepEqual(actual, `50.00 test -50.00 50% improvement`);
        });
    });
});
