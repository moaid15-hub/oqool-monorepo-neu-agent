import { OqoolAPIClient } from './api-client.js';
export interface CodeMetrics {
    timestamp: string;
    file: string;
    language: string;
    linesOfCode: number;
    linesOfComments: number;
    linesOfBlank: number;
    cyclomaticComplexity: number;
    maintainabilityIndex: number;
    depthOfInheritance: number;
    classCoupling: number;
    functionPoints: number;
    codeCoverage: number;
    duplications: CodeDuplication[];
    smells: CodeSmell[];
    issues: CodeIssue[];
    score: CodeScore;
}
export interface CodeDuplication {
    lines: number;
    files: string[];
    content: string;
    similarity: number;
}
export interface CodeSmell {
    type: 'long_method' | 'large_class' | 'long_parameter_list' | 'duplicate_code' | 'complex_condition' | 'dead_code' | 'feature_envy';
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    line: number;
    suggestion: string;
}
export interface CodeIssue {
    type: 'bug' | 'vulnerability' | 'code_smell' | 'duplication' | 'coverage';
    severity: 'info' | 'minor' | 'major' | 'critical' | 'blocker';
    title: string;
    description: string;
    line?: number;
    file: string;
    effort: string;
    debt: string;
}
export interface CodeScore {
    overall: number;
    maintainability: number;
    reliability: number;
    security: number;
    performance: number;
    coverage: number;
    grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
}
export interface ProjectMetrics {
    timestamp: string;
    files: CodeMetrics[];
    summary: ProjectSummary;
    trends: MetricTrends;
    recommendations: string[];
    benchmarks: BenchmarkComparison;
}
export interface ProjectSummary {
    totalFiles: number;
    totalLinesOfCode: number;
    totalLinesOfComments: number;
    totalLinesOfBlank: number;
    averageComplexity: number;
    averageMaintainability: number;
    totalDuplications: number;
    totalSmells: number;
    totalIssues: number;
    codeCoverage: number;
    technicalDebt: string;
    estimatedEffort: string;
    overallScore: number;
}
export interface MetricTrends {
    complexity: TrendData[];
    maintainability: TrendData[];
    coverage: TrendData[];
    duplications: TrendData[];
    issues: TrendData[];
}
export interface TrendData {
    date: string;
    value: number;
    change: number;
}
export interface BenchmarkComparison {
    industry: {
        complexity: number;
        maintainability: number;
        coverage: number;
        debt: string;
    };
    similarProjects: {
        complexity: number;
        maintainability: number;
        coverage: number;
        debt: string;
    };
    status: 'above_average' | 'average' | 'below_average';
}
export interface QualityGate {
    name: string;
    conditions: QualityCondition[];
    status: 'passed' | 'failed';
}
export interface QualityCondition {
    metric: string;
    operator: 'greater_than' | 'less_than' | 'equals';
    threshold: number;
    status: 'passed' | 'failed';
}
export declare class CodeMetricsAnalyzer {
    private apiClient;
    private workingDir;
    private metricsPath;
    private reportsPath;
    private historyPath;
    constructor(apiClient: OqoolAPIClient, workingDir?: string);
    private initializeSystem;
    analyzeFile(filePath: string): Promise<CodeMetrics>;
    analyzeProject(pattern?: string): Promise<ProjectMetrics>;
    private calculateFileMetrics;
    private calculateCyclomaticComplexity;
    private calculateMaintainabilityIndex;
    private calculateDepthOfInheritance;
    private calculateClassCoupling;
    private calculateFunctionPoints;
    private calculateCodeScore;
    private detectCodeSmells;
    private detectUnusedVariables;
    private detectIssues;
    private detectSecurityIssues;
    private detectPerformanceIssues;
    private detectMaintainabilityIssues;
    private findDuplications;
    private detectLanguage;
    private calculateProjectSummary;
    private calculateTechnicalDebt;
    private calculateEstimatedEffort;
    private analyzeTrends;
    private compareWithBenchmarks;
    private generateRecommendations;
    private displayProjectSummary;
    private displayTopIssues;
    private getGradeColor;
    private getGradeLetter;
    private getSeverityIcon;
    private getIssueTypeColor;
    private getSeverityScore;
    private loadMetricsHistory;
    private saveProjectMetrics;
}
export declare function createCodeMetricsAnalyzer(apiClient: OqoolAPIClient, workingDir?: string): CodeMetricsAnalyzer;
//# sourceMappingURL=code-metrics.d.ts.map