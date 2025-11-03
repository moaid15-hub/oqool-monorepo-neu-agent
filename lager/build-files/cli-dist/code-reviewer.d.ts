export interface ReviewResult {
    overallScore: number;
    security: SecurityReview;
    performance: PerformanceReview;
    quality: QualityReview;
    documentation: DocumentationReview;
    testing: TestingReview;
    recommendations: string[];
}
export interface SecurityReview {
    score: number;
    issues: Array<{
        severity: 'critical' | 'high' | 'medium' | 'low';
        file: string;
        line?: number;
        description: string;
        suggestion: string;
    }>;
}
export interface PerformanceReview {
    score: number;
    hotspots: Array<{
        file: string;
        function: string;
        complexity: string;
        suggestion: string;
    }>;
}
export interface QualityReview {
    score: number;
    smells: Array<{
        type: string;
        file: string;
        description: string;
    }>;
}
export interface DocumentationReview {
    score: number;
    missing: string[];
    outdated: string[];
}
export interface TestingReview {
    score: number;
    coverage?: number;
    missingTests: string[];
}
export declare class CodeReviewer {
    private client;
    private workingDirectory;
    constructor(apiKey: string, workingDirectory: string);
    review(): Promise<ReviewResult>;
    private reviewSecurity;
    private reviewPerformance;
    private reviewQuality;
    private reviewDocumentation;
    private reviewTesting;
    private generateRecommendations;
    private displayResults;
    private getProjectFiles;
}
//# sourceMappingURL=code-reviewer.d.ts.map