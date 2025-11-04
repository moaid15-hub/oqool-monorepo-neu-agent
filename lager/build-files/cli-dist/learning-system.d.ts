export interface ErrorRecord {
    id: string;
    timestamp: number;
    error: string;
    context: {
        file?: string;
        code?: string;
        command?: string;
        stackTrace?: string;
    };
    solution?: string;
    successful: boolean;
    attemptCount: number;
}
export interface LearningPattern {
    errorType: string;
    pattern: string;
    frequency: number;
    solutions: Array<{
        solution: string;
        successRate: number;
        timesUsed: number;
    }>;
    lastSeen: number;
}
export interface LearningStats {
    totalErrors: number;
    solvedErrors: number;
    patterns: number;
    successRate: number;
    topErrors: Array<{
        type: string;
        count: number;
    }>;
}
export declare class LearningSystem {
    private workingDirectory;
    private learningPath;
    private errorHistory;
    private patterns;
    private client?;
    constructor(workingDirectory: string, apiKey?: string);
    load(): Promise<void>;
    save(): Promise<void>;
    recordError(error: string, context?: ErrorRecord['context']): Promise<string>;
    findSolution(error: string): Promise<string | null>;
    private generateSolution;
    recordSuccess(errorId: string, solution: string): Promise<void>;
    private updatePatterns;
    private classifyError;
    private extractPattern;
    private calculateSimilarity;
    getStats(): LearningStats;
    displayStats(): void;
    cleanup(maxAge?: number): Promise<void>;
}
//# sourceMappingURL=learning-system.d.ts.map