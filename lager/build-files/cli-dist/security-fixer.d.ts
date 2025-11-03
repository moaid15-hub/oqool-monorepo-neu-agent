import { FixIssue } from '../auto-fix-system.js';
export declare class SecurityFixer {
    private workingDir;
    private securityScanner;
    constructor(workingDir?: string);
    /**
     * تحليل الكود للبحث عن ثغرات أمنية
     */
    analyze(code: string, file: string): Promise<FixIssue[]>;
    /**
     * إصلاح الثغرات الأمنية
     */
    fix(code: string, issues: FixIssue[]): Promise<string>;
    /**
     * كشف الأنماط الخطيرة
     */
    private detectDangerousPatterns;
    /**
     * كشف ثغرات الحقن
     */
    private detectInjectionVulnerabilities;
    /**
     * كشف مشاكل التشفير
     */
    private detectCryptoIssues;
    /**
     * كشف مشاكل المصادقة
     */
    private detectAuthIssues;
    /**
     * كشف معالجة الأخطاء
     */
    private detectErrorHandling;
    /**
     * تطبيق الإصلاحات المباشرة
     */
    private applyDirectSecurityFixes;
    /**
     * إصلاح باستخدام AI
     */
    private fixWithAI;
    /**
     * تقييم مستوى الأمان
     */
    calculateSecurityScore(issues: FixIssue[]): number;
}
//# sourceMappingURL=security-fixer.d.ts.map