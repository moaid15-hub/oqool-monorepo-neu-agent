import { OqoolAPIClient } from './api-client.js';
export interface MigrationPlan {
    id: string;
    name: string;
    description: string;
    source: MigrationSource;
    target: MigrationTarget;
    steps: MigrationStep[];
    risks: MigrationRisk[];
    dependencies: string[];
    estimatedTime: string;
    status: 'planned' | 'in_progress' | 'completed' | 'failed' | 'rollback';
    createdAt: string;
    startedAt?: string;
    completedAt?: string;
    rollbackAt?: string;
}
export interface MigrationSource {
    type: 'framework' | 'language' | 'database' | 'architecture' | 'version' | 'platform';
    name: string;
    version?: string;
    files: string[];
    dependencies: string[];
    configuration: Record<string, any>;
}
export interface MigrationTarget {
    type: 'framework' | 'language' | 'database' | 'architecture' | 'version' | 'platform';
    name: string;
    version?: string;
    requirements: string[];
    breakingChanges: BreakingChange[];
    newFeatures: string[];
}
export interface BreakingChange {
    type: 'api' | 'config' | 'structure' | 'behavior';
    description: string;
    impact: 'low' | 'medium' | 'high' | 'critical';
    solution: string;
    automated: boolean;
}
export interface MigrationStep {
    id: string;
    name: string;
    description: string;
    type: 'analysis' | 'backup' | 'update' | 'test' | 'deploy' | 'cleanup';
    status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'skipped';
    estimatedTime: string;
    actualTime?: string;
    dependencies: string[];
    files: string[];
    commands: string[];
    automated: boolean;
    completedAt?: string;
}
export interface MigrationRisk {
    level: 'low' | 'medium' | 'high' | 'critical';
    category: 'data_loss' | 'downtime' | 'compatibility' | 'security' | 'performance';
    description: string;
    probability: number;
    impact: string;
    mitigation: string;
}
export interface MigrationBackup {
    id: string;
    type: 'full' | 'database' | 'config' | 'code';
    path: string;
    size: string;
    createdAt: string;
    description: string;
}
export interface MigrationReport {
    plan: MigrationPlan;
    execution: {
        startTime: string;
        endTime?: string;
        duration?: string;
        success: boolean;
        stepsCompleted: number;
        stepsFailed: number;
        stepsSkipped: number;
    };
    changes: {
        filesModified: number;
        filesCreated: number;
        filesDeleted: number;
        linesAdded: number;
        linesRemoved: number;
    };
    issues: MigrationIssue[];
    recommendations: string[];
}
export interface MigrationIssue {
    type: 'error' | 'warning' | 'info';
    message: string;
    file?: string;
    line?: number;
    severity: 'low' | 'medium' | 'high' | 'critical';
    resolved: boolean;
    solution?: string;
}
export interface FrameworkMigration {
    from: string;
    to: string;
    patterns: MigrationPattern[];
    dependencies: DependencyUpdate[];
    configUpdates: ConfigUpdate[];
}
export interface MigrationPattern {
    pattern: string;
    replacement: string;
    description: string;
    files: string[];
    automated: boolean;
}
export interface DependencyUpdate {
    name: string;
    fromVersion: string;
    toVersion: string;
    type: 'major' | 'minor' | 'patch';
    breaking: boolean;
}
export interface ConfigUpdate {
    file: string;
    section: string;
    changes: Record<string, any>;
}
export declare class MigrationAssistant {
    private apiClient;
    private workingDir;
    private plansPath;
    private backupsPath;
    private reportsPath;
    constructor(apiClient: OqoolAPIClient, workingDir?: string);
    private initializeSystem;
    createMigrationPlan(source: string, target: string): Promise<void>;
    private analyzeCurrentProject;
    private generateMigrationPlan;
    private generateMigrationSteps;
    private getReactToNextJSSteps;
    private getJavaScriptToTypeScriptSteps;
    private getGenericMigrationSteps;
    private getExpressToFastifySteps;
    private getVue2ToVue3Steps;
    private assessMigrationRisks;
    private identifyDependencies;
    private displayMigrationPlan;
    executeMigrationPlan(planId: string): Promise<void>;
    private executeAutomatedStep;
    private executeManualStep;
    createBackup(type?: 'full' | 'database' | 'config' | 'code'): Promise<void>;
    private createFullBackup;
    private createDatabaseBackup;
    private createConfigBackup;
    private createCodeBackup;
    restoreFromBackup(backupId: string): Promise<void>;
    generateMigrationReport(planId: string): Promise<void>;
    private displayMigrationReport;
    private calculateSuccessRate;
    private calculateDuration;
    private getStatusIcon;
    private getDirectoryStats;
    private formatBytes;
    private saveMigrationPlan;
    private loadMigrationPlan;
    private saveMigrationReport;
    listMigrationPlans(): Promise<string[]>;
    listBackups(): Promise<string[]>;
}
export declare function createMigrationAssistant(apiClient: OqoolAPIClient, workingDir?: string): MigrationAssistant;
//# sourceMappingURL=migration-assistant.d.ts.map