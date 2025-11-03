export type Priority = 'P1' | 'P2' | 'P3';
export type FixAction = 'auto' | 'ask' | 'suggest';
export interface FixStage {
    name: string;
    priority: Priority;
    action: FixAction;
    description: string;
}
export interface FixIssue {
    stage: string;
    priority: Priority;
    type: string;
    message: string;
    line?: number;
    column?: number;
    fix?: string;
    suggestion?: string;
}
export interface FixResult {
    success: boolean;
    totalIssues: number;
    fixedIssues: number;
    suggestedIssues: number;
    skippedIssues: number;
    stages: {
        [key: string]: {
            issues: number;
            fixed: number;
            suggested: number;
            skipped: number;
        };
    };
    finalCode?: string;
}
export interface AutoFixOptions {
    file: string;
    autoApply?: boolean;
    skipStages?: string[];
    onlyStages?: string[];
    interactive?: boolean;
}
export declare class AutoFixSystem {
    private workingDir;
    private fileManager;
    private stages;
    private syntaxFixer;
    private typeFixer;
    private securityFixer;
    private performanceOptimizer;
    private styleFixer;
    constructor(workingDir?: string);
    /**
     * تهيئة المراحل
     */
    private initializeStages;
    /**
     * تشغيل نظام الإصلاح التلقائي
     */
    fix(options: AutoFixOptions): Promise<FixResult>;
    /**
     * تشغيل مرحلة واحدة
     */
    private runStage;
    /**
     * معالجة إصلاحات الأمان التفاعلية
     */
    private handleInteractiveSecurityFixes;
    /**
     * عرض نتائج المرحلة
     */
    private displayStageResults;
    /**
     * عرض النتائج النهائية
     */
    private displayFinalResults;
    /**
     * تأكيد الحفظ
     */
    private confirmSave;
    /**
     * الحصول على معلومات المراحل
     */
    getStages(): FixStage[];
    /**
     * الحصول على مرحلة محددة
     */
    getStage(name: string): FixStage | undefined;
}
/**
 * إنشاء نظام الإصلاح التلقائي
 */
export declare function createAutoFixSystem(workingDir?: string): AutoFixSystem;
//# sourceMappingURL=auto-fix-system.d.ts.map