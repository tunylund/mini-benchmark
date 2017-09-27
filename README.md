# mini-benchmark
Minimal benchmark library for nodejs 8.5+. Uses the native performance api.

## Usage
```
import { miniBenchmark as mb, formatResult} from 'mini-benchmark'

mb([], test => {
  test('some-test', () => {
    // do something long
  })
}).map(formatResult)
  .map(x => console.log(x))
// => 10.00 some-test
```

```
import { miniBenchmark as mb, formatResult} from 'mini-benchmark'

const previousTestResults = [{ name: 'some-test', duration: 100 }]

mb(previousTestResults, test => {
  test('some-test', () => {
    // do something long
  })
}).map(formatResult)
  .map(x => console.log(x))
// => 10.00 some-test -90.00 (-90%) improvement
```
