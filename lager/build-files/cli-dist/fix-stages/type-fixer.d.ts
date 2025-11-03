import { FixIssue } from '../auto-fix-system.js';
export declare class TypeFixer {
    private workingDir;
    constructor(workingDir?: string);
    /**
     * تحليل الكود للبحث عن أخطاء Types
     */
    analyze(code: string, file: string): Promise<FixIssue[]>;
    /**
     * إصلاح أخطاء Types
     */
    fix(code: string, issues: FixIssue[]): Promise<string>;
    /**
     * كشف مشاكل الأنواع الشائعة
     */
    private detectCommonTypeIssues;
    /**
     * تطبيق الإصلاحات البسيطة للأنواع
     */
    private applySimpleTypeFixes;
    /**
     * إصلاح باستخدام AI
     */
    private fixWithAI;
    /**
     * الحصول على فئة التشخيص
     */
    private getDiagnosticCategory;
    /**
     * اقتراح إصلاح
     */
    private suggestFix;
    /**
     * تحقق من صحة الأنواع بعد الإصلاح
     */
    validate(code: string): Promise<{
        valid: boolean;
        errors: string[];
    }>;
}
//# sourceMappingURL=type-fixer.d.ts.map