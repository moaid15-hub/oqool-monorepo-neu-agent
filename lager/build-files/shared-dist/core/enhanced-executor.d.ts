export type SupportedLanguage = 'javascript' | 'typescript' | 'python' | 'go' | 'rust' | 'ruby' | 'php';
export interface LanguageConfig {
    name: string;
    extensions: string[];
    executor: string;
    buildCommand?: string;
    formatCommand?: string;
    lintCommand?: string;
    testCommand?: string;
}
export interface ExecutionResult {
    success: boolean;
    output: string;
    error?: string;
    exitCode: number;
    duration: number;
}
export interface FormatResult {
    success: boolean;
    formatted: boolean;
    changes?: string;
    error?: string;
}
export interface LintResult {
    success: boolean;
    issues: LintIssue[];
    fixedCount: number;
    error?: string;
}
export interface LintIssue {
    file: string;
    line: number;
    column?: number;
    severity: 'error' | 'warning' | 'info';
    message: string;
    rule?: string;
}
export declare class EnhancedExecutor {
    private workingDir;
    private fileManager;
    private languageConfigs;
    constructor(workingDir?: string);
    /**
     * تهيئة إعدادات اللغات
     */
    private initializeLanguageConfigs;
    /**
     * كشف لغة الملف
     */
    detectLanguage(filePath: string): SupportedLanguage | undefined;
    /**
     * تنفيذ ملف
     */
    executeFile(filePath: string, args?: string[]): Promise<ExecutionResult>;
    /**
     * بناء مشروع
     */
    buildProject(language?: SupportedLanguage): Promise<ExecutionResult>;
    /**
     * تنسيق الكود (Formatting)
     */
    formatFile(filePath: string): Promise<FormatResult>;
    /**
     * فحص الكود (Linting)
     */
    lintFile(filePath: string, autoFix?: boolean): Promise<LintResult>;
    /**
     * تنسيق وفحص ملفات متعددة
     */
    formatAndLintFiles(files: string[], autoFix?: boolean): Promise<{
        formatted: number;
        linted: number;
        issues: LintIssue[];
    }>;
    /**
     * تشغيل الاختبارات
     */
    runTests(language?: SupportedLanguage): Promise<ExecutionResult>;
    /**
     * كشف لغة المشروع
     */
    private detectProjectLanguage;
    /**
     * عرض اللغات المدعومة
     */
    listSupportedLanguages(): void;
    /**
     * التحقق من توفر أدوات اللغة
     */
    checkLanguageTools(language: SupportedLanguage): Promise<{
        executor: boolean;
        formatter: boolean;
        linter: boolean;
        tester: boolean;
    }>;
}
export declare function createEnhancedExecutor(workingDir?: string): EnhancedExecutor;
//# sourceMappingURL=enhanced-executor.d.ts.map