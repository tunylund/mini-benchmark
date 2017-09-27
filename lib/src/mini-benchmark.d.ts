export interface TestResult {
    duration: number;
    name: string;
    regression?: number;
    diffPercent?: number;
}
export interface TestFn {
    (name: string, fn: (context: any) => void): TestResult;
}
export declare function miniBenchmark(previousTestResults: {
    [key: string]: TestResult;
}, before: () => any, after: (context: any) => void, suite: (test: TestFn) => void): TestResult[];
export declare function formatResult(result: TestResult): string;
