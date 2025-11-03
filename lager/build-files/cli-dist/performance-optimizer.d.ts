import { FixIssue } from '../auto-fix-system.js';
export declare class PerformanceOptimizer {
    private workingDir;
    constructor(workingDir?: string);
    /**
     * تحليل الكود للبحث عن فرص تحسين الأداء
     */
    analyze(code: string, file: string): Promise<FixIssue[]>;
    /**
     * كشف الحلقات المتداخلة
     */
    private detectNestedLoops;
    /**
     * كشف العمليات المكلفة في الحلقات
     */
    private detectExpensiveOperationsInLoops;
    /**
     * فحص العمليات المكلفة داخل حلقة
     */
    private checkExpensiveInLoop;
    /**
     * كشف مشاكل الذاكرة
     */
    private detectMemoryIssues;
    /**
     * كشف عمليات DOM المتكررة
     */
    private detectDOMOperations;
    /**
     * كشف مشاكل Arrays
     */
    private detectArrayIssues;
    /**
     * كشف مشاكل Regular Expressions
     */
    private detectRegexIssues;
    /**
     * تحقق إذا كان السطر داخل حلقة
     */
    private isInLoop;
    /**
     * الإصلاح (للمرحلة 3، نعرض فقط اقتراحات)
     */
    fix(code: string, issues: FixIssue[]): Promise<string>;
    /**
     * توليد تقرير الأداء
     */
    generatePerformanceReport(issues: FixIssue[]): string;
    private getTypeEmoji;
    private getTypeName;
}
//# sourceMappingURL=performance-optimizer.d.ts.map