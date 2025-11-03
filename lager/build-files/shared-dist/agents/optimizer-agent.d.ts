import { type AIProvider } from '../ai-gateway/index.js';
import type { GeneratedCode, CodeFile } from '../core/god-mode.js';
export interface OptimizationSuggestion {
    type: 'performance' | 'memory' | 'bundle-size' | 'algorithm' | 'database' | 'network';
    priority: 'critical' | 'high' | 'medium' | 'low';
    file: string;
    issue: string;
    impact: string;
    solution: string;
    estimatedGain: string;
    applied?: boolean;
}
export interface OptimizationResults {
    suggestionsCount: number;
    appliedCount: number;
    suggestions: OptimizationSuggestion[];
    optimizedFiles: CodeFile[];
    performanceGain: string;
    summary: string;
}
export declare class OptimizerAgent {
    private aiAdapter;
    private provider;
    constructor(config: {
        deepseek?: string;
        claude?: string;
        openai?: string;
    }, provider?: AIProvider);
    optimize(code: GeneratedCode): Promise<OptimizationResults>;
    private analyzeFile;
    private analyzeProject;
    private applyOptimization;
    private callClaude;
    private parseSuggestions;
    private extractCode;
    private getProjectStructure;
    private estimateGain;
    private generateSummary;
}
//# sourceMappingURL=optimizer-agent.d.ts.map