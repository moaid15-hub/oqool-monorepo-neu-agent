import { FixIssue } from '../auto-fix-system.js';
export declare class SyntaxFixer {
    private workingDir;
    constructor(workingDir?: string);
    /**
     * تحليل الكود للبحث عن أخطاء Syntax
     */
    analyze(code: string, file: string): Promise<FixIssue[]>;
    /**
     * إصلاح أخطاء Syntax
     */
    fix(code: string, issues: FixIssue[]): Promise<string>;
    /**
     * كشف الأخطاء الشائعة
     */
    private detectCommonSyntaxIssues;
    /**
     * تطبيق الإصلاحات البسيطة
     */
    private applySimpleFixes;
    /**
     * إصلاح باستخدام AI
     */
    private fixWithAI;
    /**
     * تنظيف رسالة الخطأ
     */
    private cleanErrorMessage;
    /**
     * تحقق من صحة الكود بعد الإصلاح
     */
    validate(code: string): Promise<boolean>;
}
//# sourceMappingURL=syntax-fixer.d.ts.map