# mini-benchmark
Minimal benchmark library for nodejs 8.5+. Uses the native performance api.

## Usage
```
import { miniBenchmark as mb, formatResult} from 'mini-benchmark'

mb({}, test => {
  test('some-test', () => {
    // do something long
  })
}).map(formatResult).map(x => console.log(x))
// => 10.00 some-test
```

```
const previousTestResults = {}
mb({}, test => {
  test('some-test', () => {
    // do something long
  })
}).map(formatResult).map(x => console.log(x))
```
