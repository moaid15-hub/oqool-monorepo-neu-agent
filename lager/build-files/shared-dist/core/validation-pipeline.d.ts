export type ValidationStage = 'syntax' | 'types' | 'security' | 'performance' | 'style';
export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info';
export type Priority = 'P1' | 'P2' | 'P3';
export type FixStrategy = 'auto' | 'suggest' | 'manual' | 'confirm';
export interface ValidationIssue {
    stage: ValidationStage;
    severity: Severity;
    type: string;
    message: string;
    line?: number;
    column?: number;
    file?: string;
    code?: string;
    cwe?: string;
    fix?: {
        strategy: FixStrategy;
        description: string;
        suggestedCode?: string;
    };
}
export interface StageResult {
    stage: ValidationStage;
    priority: Priority;
    passed: boolean;
    duration: number;
    errors: ValidationIssue[];
    warnings: ValidationIssue[];
    suggestions: ValidationIssue[];
    autoFixApplied: boolean;
    fixedCode?: string;
}
export interface ValidationResult {
    success: boolean;
    totalIssues: number;
    criticalIssues: number;
    stages: StageResult[];
    finalCode: string;
    originalCode: string;
    summary: string;
    duration: number;
}
export interface StageConfig {
    enabled: boolean;
    priority: Priority;
    autoFix: boolean;
    stopOnError: boolean;
    confirm?: boolean;
}
export interface PipelineConfig {
    stages?: {
        [K in ValidationStage]?: StageConfig;
    };
    cache?: {
        enabled: boolean;
        ttl?: number;
    };
}
export declare class ValidationPipeline {
    private config;
    private cache;
    constructor(config?: PipelineConfig);
    validate(code: string, filePath: string, options?: {
        skipCache?: boolean;
        onProgress?: (stage: ValidationStage, progress: number) => void;
        onConfirm?: (issue: ValidationIssue) => Promise<boolean>;
    }): Promise<ValidationResult>;
    private executeStage;
    private checkSyntax;
    private checkTypes;
    private checkSecurity;
    private checkPerformance;
    private checkStyle;
    private applyAutoFix;
    private applyFix;
    private getOrderedStages;
    private getLineAndColumn;
    private generateSummary;
    private mergeConfig;
    private getFromCache;
    private setCache;
    private generateCacheKey;
    private isCacheValid;
    clearCache(): void;
    configureStage(stage: ValidationStage, config: Partial<StageConfig>): void;
    getConfig(): Required<PipelineConfig>;
}
export declare function getValidationPipeline(config?: PipelineConfig): ValidationPipeline;
export declare function createValidationPipeline(config?: PipelineConfig): ValidationPipeline;
//# sourceMappingURL=validation-pipeline.d.ts.map