"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { performance } = require('perf_hooks');
function miniBenchmark(previousTestResults, before, after, suite) {
    let context = before();
    let results = [];
    suite((name, fn) => {
        const durations = runTest(name, context, fn);
        const duration = average(durations);
        const previousResult = (previousTestResults[name] || {});
        const previousDuration = previousResult.duration;
        const regression = duration - previousDuration;
        const diffPercent = regression / Math.max(duration, previousDuration) * 100;
        const result = { name, duration, regression, diffPercent };
        results.push(result);
        return result;
    });
    after(context);
    return results;
}
exports.miniBenchmark = miniBenchmark;
function formatResult(result) {
    const { duration, diffPercent, name, regression } = result;
    let formatted = [duration.toFixed(2), name];
    if (regression)
        formatted.push(regression.toFixed(2));
    if (diffPercent && diffPercent > 0)
        formatted.push(`(${diffPercent}%) regression`);
    if (diffPercent && diffPercent < 0)
        formatted.push(`(${diffPercent}%) improvement`);
    return formatted.join(' ');
}
exports.formatResult = formatResult;
function runTest(name, context, testFn) {
    for (let x = 0; x < 9; x++) {
        performance.mark(`${name}-${x}-A`);
        for (let i = 0; i < 100000; i++) {
            testFn(context);
        }
        performance.mark(`${name}-${x}-B`);
        performance.measure(`${name}`, `${name}-${x}-A`, `${name}-${x}-B`);
    }
    return performance.getEntriesByName(`${name}`).map((entry) => entry.duration);
}
function average(numbers) {
    return numbers
        .sort((a, b) => a < b ? -1 : a > b ? 1 : 0)
        .slice(1, -1)
        .reduce((sum, value) => sum += value, 0) / (numbers.length - 2);
}
