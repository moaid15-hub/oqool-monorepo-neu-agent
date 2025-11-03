import { FixIssue } from '../auto-fix-system.js';
export declare class StyleFixer {
    private workingDir;
    private config;
    constructor(workingDir?: string);
    /**
     * تحليل الكود للبحث عن مشاكل الأسلوب
     */
    analyze(code: string, file: string): Promise<FixIssue[]>;
    /**
     * إصلاح مشاكل الأسلوب
     */
    fix(code: string, issues: FixIssue[]): Promise<string>;
    /**
     * فحص اصطلاحات التسمية
     */
    private checkNamingConventions;
    /**
     * فحص بنية الكود
     */
    private checkCodeStructure;
    /**
     * فحص التنسيق
     */
    private checkFormatting;
    /**
     * فحص أفضل الممارسات
     */
    private checkBestPractices;
    /**
     * تطبيق إصلاحات الأسلوب على الـ AST
     */
    private applyStyleFixes;
    /**
     * تطبيق إصلاحات نصية
     */
    private applyTextFixes;
    /**
     * فحص camelCase
     */
    private isCamelCase;
    /**
     * فحص PascalCase
     */
    private isPascalCase;
    /**
     * فحص UPPER_CASE
     */
    private isUpperCase;
    /**
     * فحص إذا كان ثابت
     */
    private isConstant;
    /**
     * تحويل إلى camelCase
     */
    private toCamelCase;
    /**
     * تحويل إلى PascalCase
     */
    private toPascalCase;
    /**
     * تحويل إلى UPPER_CASE
     */
    private toUpperCase;
    /**
     * تحديث إعدادات الأسلوب
     */
    updateConfig(config: Partial<typeof this.config>): void;
}
//# sourceMappingURL=style-fixer.d.ts.map