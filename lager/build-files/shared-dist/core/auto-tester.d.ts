import { SecurityEnhancements } from './security-enhancements.js';
export interface TestResult {
    syntaxOk: boolean;
    testsPass: boolean;
    secure: boolean;
    performant: boolean;
    details: {
        syntax?: {
            valid: boolean;
            errors: string[];
        };
        tests?: {
            passed: number;
            failed: number;
            total: number;
            details: string;
        };
        security?: {
            safe: boolean;
            vulnerabilities: Array<{
                type: string;
                severity: string;
                message: string;
            }>;
        };
        performance?: {
            fast: boolean;
            executionTime: number;
            memoryUsage: number;
            warnings: string[];
        };
    };
    overall: 'pass' | 'fail' | 'warning';
}
export interface AutoTesterConfig {
    workingDirectory: string;
    enableSyntaxCheck?: boolean;
    enableTests?: boolean;
    enableSecurity?: boolean;
    enablePerformance?: boolean;
    securityScanner?: SecurityEnhancements;
}
export declare class AutoTester {
    private config;
    private testRunner?;
    private securityScanner?;
    constructor(config: AutoTesterConfig);
    setSecurityScanner(scanner: SecurityEnhancements): void;
    testGeneratedCode(code: string, filePath: string): Promise<TestResult>;
    checkSyntax(code: string, filePath: string): Promise<boolean>;
    private checkJavaScriptSyntax;
    private checkTypeScriptSyntax;
    private checkPythonSyntax;
    private checkJavaSyntax;
    private getSyntaxDetails;
    runTests(filePath: string): Promise<boolean>;
    private getTestDetails;
    scanSecurity(code: string, filePath: string): Promise<boolean>;
    private getSecurityDetails;
    checkPerformance(code: string, filePath: string): Promise<boolean>;
    private hasNestedLoops;
    private hasExpensiveOperations;
    private hasMemoryIssues;
    private estimateComplexity;
    private getPerformanceDetails;
    private printSummary;
}
export declare function createAutoTester(config: AutoTesterConfig): AutoTester;
//# sourceMappingURL=auto-tester.d.ts.map