export interface TestResult {
    passed: boolean;
    total: number;
    passed_count: number;
    failed_count: number;
    duration: number;
    output: string;
    errors: string[];
}
export declare class TestRunner {
    private workingDirectory;
    private testFramework?;
    constructor(workingDirectory: string);
    detectTestFramework(): Promise<string | null>;
    runTests(testFile?: string): Promise<TestResult>;
    private executeTests;
    private parseTestOutput;
    private displayResults;
    suggestFixes(testResult: TestResult): Promise<string[]>;
}
//# sourceMappingURL=test-runner.d.ts.map