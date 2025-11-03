import { type AIProvider } from '../ai-gateway/index.js';
import type { GeneratedCode, CodeFile } from '../core/god-mode.js';
export interface BugReport {
    severity: 'critical' | 'high' | 'medium' | 'low';
    type: string;
    file: string;
    line?: number;
    description: string;
    suggestion: string;
    fixed?: boolean;
}
export interface DebugResults {
    bugsFound: number;
    bugsFixed: number;
    bugs: BugReport[];
    fixedFiles: CodeFile[];
    summary: string;
}
export declare class DebuggerAgent {
    private aiAdapter;
    private provider;
    constructor(config: {
        deepseek?: string;
        claude?: string;
        openai?: string;
    }, provider?: AIProvider);
    analyzeAndFix(code: GeneratedCode, errorLogs?: string): Promise<DebugResults>;
    private analyzeFile;
    private analyzeErrorLogs;
    private fixBug;
    private callClaude;
    private parseBugReport;
    private extractCode;
    private generateSummary;
}
//# sourceMappingURL=debugger-agent.d.ts.map