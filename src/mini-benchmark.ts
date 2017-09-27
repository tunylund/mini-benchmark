const { performance } = require('perf_hooks')

export interface TestResult {
  duration: number
  name: string
  regression?: number
  diffPercent?: number
}

export interface TestFn {
  (name: string, fn: (context: any) => void): TestResult
}

export function miniBenchmark (
  previousTestResults: {[key: string]: TestResult},
  before: () => any,
  after: (context: any) => void,
  suite: (test: TestFn) => void): TestResult[] {

  let context = before()
  let results: TestResult[] = []

  suite((name: string, fn: (context: any) => void): TestResult => {
    const durations = runTest(name, context, fn)
    const duration = average(durations)
    const previousResult = (previousTestResults[name] || {}) as TestResult
    const previousDuration = previousResult.duration
    const regression = duration - previousDuration
    const diffPercent = regression / Math.max(duration, previousDuration) * 100

    const result = { name, duration, regression, diffPercent }
    results.push(result)
    return result
  })

  after(context)

  return results
}

export function formatResult (result: TestResult): string {
  const { duration, diffPercent, name, regression } = result
  let formatted = [ duration.toFixed(2), name ]
  if (regression) formatted.push(regression.toFixed(2))
  if (diffPercent && diffPercent > 0) formatted.push(`(${diffPercent}%) regression`)
  if (diffPercent && diffPercent < 0) formatted.push(`(${diffPercent}%) improvement`)
  return formatted.join(' ')
}

function runTest (name: string, context: any, testFn: (context: any) => void) {
  for (let x = 0; x < 9; x++) {
    performance.mark(`${name}-${x}-A`)
    for (let i = 0; i < 100000; i++) {
      testFn(context)
    }
    performance.mark(`${name}-${x}-B`)
    performance.measure(`${name}`, `${name}-${x}-A`, `${name}-${x}-B`)
  }
  return performance.getEntriesByName(`${name}`).map((entry: any) => entry.duration)
}

function average (numbers: number[]) {
  return numbers
    .sort((a: number, b: number) => a < b ? -1 : a > b ? 1 : 0)
    .slice(1, -1)
    .reduce((sum: number, value) => sum += value, 0) / (numbers.length - 2)
}
