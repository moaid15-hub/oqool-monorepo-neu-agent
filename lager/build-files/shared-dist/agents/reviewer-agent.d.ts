import { type AIProvider } from '../ai-gateway/index.js';
import type { GeneratedCode, ReviewResult } from '../core/god-mode.js';
export interface FileIssue {
    file: string;
    type: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    description: string;
    line?: number;
}
export declare class ReviewerAgent {
    private aiAdapter;
    private provider;
    constructor(config: {
        deepseek?: string;
        claude?: string;
        openai?: string;
    }, provider?: AIProvider);
    review(code: GeneratedCode): Promise<ReviewResult>;
    improve(code: GeneratedCode, review: ReviewResult): Promise<GeneratedCode>;
    private analyzeFile;
    private improveFile;
    private generateFeedback;
    private parseIssues;
    private parseImprovedFile;
    private callClaude;
}
//# sourceMappingURL=reviewer-agent.d.ts.map