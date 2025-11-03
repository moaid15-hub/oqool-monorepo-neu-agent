export interface ExecutionOptions {
    file: string;
    env?: 'sandbox' | 'normal';
    timeout?: number;
    args?: string[];
    cwd?: string;
}
export interface ExecutionResult {
    success: boolean;
    output?: string;
    error?: string;
    exitCode?: number;
    runtime?: number;
    errorType?: 'syntax' | 'runtime' | 'timeout' | 'other';
    errorLine?: number;
    errorStack?: string;
}
export interface FixOptions {
    file: string;
    error: string;
    errorType?: string;
    maxAttempts?: number;
    autoApply?: boolean;
}
export interface FixResult {
    success: boolean;
    fixed: boolean;
    message: string;
    attempts: number;
    patches?: any[];
}
export declare class CodeExecutor {
    private workingDir;
    constructor(workingDir?: string);
    /**
     * تنفيذ ملف كود
     */
    executeCode(options: ExecutionOptions): Promise<ExecutionResult>;
    /**
     * تحليل رسالة الخطأ
     */
    private parseError;
    /**
     * إصلاح خطأ تلقائياً
     */
    fixError(options: FixOptions): Promise<FixResult>;
    /**
     * تشغيل وإصلاح تلقائي
     */
    runAndFix(file: string, options?: Partial<ExecutionOptions & FixOptions>): Promise<ExecutionResult>;
}
export declare function createCodeExecutor(workingDir?: string): CodeExecutor;
//# sourceMappingURL=code-executor.d.ts.map