"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { performance } = require('perf_hooks');
function miniBenchmark(previousTestResults, before, after, suite) {
    let context = before();
    let results = [];
    suite((name, fn) => {
        const durations = runTest(name, context, fn);
        const duration = average(durations);
        const previousResult = (previousTestResults.filter(x => x.name === name)[0] || {});
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
function formatResult(result, threshold = 5) {
    const { name, duration, diffPercent, regression } = result;
    let formatted = [duration.toFixed(2), name];
    if (diffPercent && regression) {
        const absDiffPercent = Math.floor(Math.abs(diffPercent));
        if (absDiffPercent > threshold) {
            formatted.push(`${regression > 0 ? '+' : ''}${regression.toFixed(2)}`);
            formatted.push(`${absDiffPercent}%`);
            formatted.push(diffPercent < 0 ? 'improvement' : 'regression');
        }
    }
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
