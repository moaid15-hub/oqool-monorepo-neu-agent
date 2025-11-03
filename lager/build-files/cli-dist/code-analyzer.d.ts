export interface FunctionInfo {
    name: string;
    type: 'function' | 'arrow' | 'method';
    params: string[];
    async: boolean;
    lineStart: number;
    lineEnd: number;
    complexity?: number;
}
export interface VariableInfo {
    name: string;
    kind: 'const' | 'let' | 'var';
    lineNumber: number;
    scope: string;
}
export interface ImportInfo {
    source: string;
    imported: string[];
    type: 'default' | 'named' | 'namespace' | 'all';
    lineNumber: number;
}
export interface ExportInfo {
    name: string;
    type: 'default' | 'named';
    lineNumber: number;
}
export interface ClassInfo {
    name: string;
    methods: string[];
    properties: string[];
    extends?: string;
    lineStart: number;
    lineEnd: number;
}
export interface CodeIssue {
    type: 'error' | 'warning' | 'info';
    message: string;
    line?: number;
    suggestion?: string;
}
export interface CodeAnalysis {
    filePath: string;
    language: 'javascript' | 'typescript' | 'jsx' | 'tsx';
    functions: FunctionInfo[];
    variables: VariableInfo[];
    imports: ImportInfo[];
    exports: ExportInfo[];
    classes: ClassInfo[];
    stats: {
        totalLines: number;
        codeLines: number;
        commentLines: number;
        blankLines: number;
        complexity: number;
    };
    issues: CodeIssue[];
    dependencies: string[];
    unusedImports?: string[];
}
export declare class CodeAnalyzer {
    private workingDir;
    constructor(workingDir?: string);
    /**
     * تحليل ملف JavaScript/TypeScript
     */
    analyzeFile(filePath: string): Promise<CodeAnalysis>;
    /**
     * تحديد لغة الملف
     */
    private detectLanguage;
    /**
     * حساب الإحصائيات
     */
    private calculateStats;
    /**
     * المرور على AST وجمع المعلومات
     */
    private traverseAST;
    /**
     * استخراج اسم المعامل
     */
    private getParamName;
    /**
     * حساب تعقيد الدالة
     */
    private calculateFunctionComplexity;
    /**
     * كشف المشاكل المحتملة
     */
    private detectIssues;
    /**
     * عرض نتائج التحليل
     */
    displayAnalysis(analysis: CodeAnalysis): void;
}
export declare function createCodeAnalyzer(workingDir?: string): CodeAnalyzer;
//# sourceMappingURL=code-analyzer.d.ts.map