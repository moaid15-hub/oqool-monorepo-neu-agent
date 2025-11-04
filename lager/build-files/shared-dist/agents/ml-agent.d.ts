import { type AIProvider } from '../ai-gateway/index.js';
import type { CodeFile } from '../core/god-mode.js';
export interface CodePattern {
    pattern: string;
    frequency: number;
    context: string;
    type?: string;
    description?: string;
    complexity?: number;
}
export interface PredictionContext {
    language: string;
    framework?: string;
    context?: string;
    previousLines?: string[];
    currentLine?: string;
}
export interface MLTrainingResult {
    success: boolean;
    patternsLearned: number;
    accuracy: number;
    model?: any;
    patterns?: CodePattern[];
    stats?: any;
}
export interface MLModel {
    name: string;
    version: string;
    capabilities: string[];
    accuracy: number;
}
export declare class MLAgent {
    private aiAdapter;
    private provider;
    constructor(config: {
        deepseek?: string;
        claude?: string;
        openai?: string;
    }, provider?: AIProvider);
    trainOnCodePatterns(codeBase: CodeFile[]): Promise<MLTrainingResult>;
    predictCodeCompletion(context: PredictionContext): Promise<string[]>;
    detectCodeSmells(codeFile: CodeFile): Promise<string[]>;
    private extractCodePatterns;
    private detectLanguages;
    private calculateComplexity;
    private calculateModelAccuracy;
    private parsePatterns;
    private parseCompletions;
    private parseCodeSmells;
    private callClaude;
}
//# sourceMappingURL=ml-agent.d.ts.map