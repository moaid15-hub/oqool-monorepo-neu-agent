import type { GodModeResult, Architecture } from '@oqool/shared/core';
export interface Project {
    id: string;
    task: string;
    architecture: Architecture;
    result: GodModeResult;
    timestamp: number;
}
export interface SuccessAnalysis {
    score: number;
    strengths: string[];
    weaknesses: string[];
    patterns: string[];
}
export interface Pattern {
    task: string;
    architecture: Architecture;
    rating: number;
    usageCount: number;
    lastUsed: number;
}
export interface ErrorAnalysis {
    type: string;
    description: string;
    frequency: number;
    solution?: string;
}
export interface Strategy {
    name: string;
    description: string;
    successRate: number;
    applicableTo: string[];
    lastUpdated: number;
}
export interface Lesson {
    task: string;
    pattern: Pattern;
    relevanceScore: number;
}
export interface LearningMemory {
    patterns: Pattern[];
    errors: ErrorAnalysis[];
    strategies: Strategy[];
    projectHistory: Project[];
    stats: {
        totalProjects: number;
        averageScore: number;
        mostCommonTasks: Record<string, number>;
        improvementRate: number;
    };
}
export declare class SelfLearningSystem {
    private client;
    private memoryPath;
    private memory;
    constructor(apiKey: string, memoryPath?: string);
    learnFromProject(project: Project): Promise<void>;
    private analyzeSuccess;
    private savePattern;
    private analyzeErrors;
    private learnFromErrors;
    private updateStrategies;
    getRelevantLessons(task: string): Promise<Lesson[]>;
    getRecommendations(task: string): Promise<string[]>;
    private extractPatterns;
    private identifyStrategies;
    private categorizeTask;
    private calculateSimilarity;
    private updateStats;
    private loadMemory;
    private saveMemory;
    showStats(): Promise<void>;
}
export declare function createSelfLearningSystem(apiKey: string, memoryPath?: string): SelfLearningSystem;
//# sourceMappingURL=self-learning-system.d.ts.map