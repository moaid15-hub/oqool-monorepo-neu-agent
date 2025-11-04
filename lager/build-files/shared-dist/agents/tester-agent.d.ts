import { type AIProvider } from '../ai-gateway/index.js';
import type { GeneratedCode, TestResults } from '../core/god-mode.js';
export interface TestFile {
    path: string;
    content: string;
    testCount: number;
}
export declare class TesterAgent {
    private aiAdapter;
    private provider;
    constructor(config: {
        deepseek?: string;
        claude?: string;
        openai?: string;
    }, provider?: AIProvider);
    createTests(code: GeneratedCode): Promise<TestResults>;
    private needsTests;
    private generateTests;
    private generateIntegrationTests;
    private callClaude;
    private parseTestFile;
    private countTests;
    private detectTestFramework;
    private getTestFileName;
    private estimateCoverage;
    private formatTestDetails;
}
//# sourceMappingURL=tester-agent.d.ts.map