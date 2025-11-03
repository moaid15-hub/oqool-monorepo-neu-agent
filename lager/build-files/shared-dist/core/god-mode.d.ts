export interface GodModeResult {
    success: boolean;
    projectPath: string;
    architecture: Architecture;
    code: GeneratedCode;
    tests: TestResults;
    review: ReviewResult;
    security: SecurityReport;
    duration: number;
    analytics: ProjectAnalytics;
}
export interface Architecture {
    components: Component[];
    database?: DatabaseDesign;
    api?: APIDesign;
    frontend?: FrontendDesign;
    tags: string[];
}
export interface Component {
    name: string;
    type: string;
    description: string;
    dependencies: string[];
}
export interface DatabaseDesign {
    type: string;
    tables: any[];
}
export interface APIDesign {
    endpoints: any[];
    authentication: string;
}
export interface FrontendDesign {
    framework: string;
    components: string[];
}
export interface GeneratedCode {
    files: CodeFile[];
    totalLines: number;
}
export interface CodeFile {
    path: string;
    content: string;
    language: string;
    lines: number;
}
export interface TestResults {
    total: number;
    passed: number;
    failed: number;
    coverage: number;
    details: string;
}
export interface ReviewResult {
    score: number;
    improvements: Improvement[];
    feedback: string;
}
export interface Improvement {
    type: string;
    description: string;
    applied: boolean;
}
export interface SecurityReport {
    score: number;
    issues: SecurityIssue[];
    recommendations: string[];
}
export interface SecurityIssue {
    severity: 'critical' | 'high' | 'medium' | 'low';
    type: string;
    description: string;
    file?: string;
}
export interface ProjectAnalytics {
    filesGenerated: number;
    linesOfCode: number;
    testsCreated: number;
    testsPassed: number;
    securityScore: number;
    qualityScore: number;
}
export interface GodModeConfig {
    apiKey: string;
    model?: string;
    outputPath?: string;
    verbose?: boolean;
}
export declare class GodMode {
    private client;
    private config;
    private architect;
    private coder;
    private tester;
    private reviewer;
    constructor(config: GodModeConfig);
    /**
     * 🎯 God Mode - بناء مشروع كامل
     */
    execute(task: string): Promise<GodModeResult>;
    private designArchitecture;
    private generateCode;
    private createTests;
    private reviewCode;
    private scanSecurity;
    private saveProject;
    private saveToLibrary;
    private saveAnalytics;
    private calculateAnalytics;
    private log;
    private parseArchitecture;
    private parseCode;
    private detectLanguage;
    private summarizeCode;
    private extractScore;
    private extractImprovements;
}
export declare function createGodMode(config: GodModeConfig): GodMode;
//# sourceMappingURL=god-mode.d.ts.map