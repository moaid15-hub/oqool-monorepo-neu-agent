import { OqoolAPIClient } from './api-client.js';
export interface CodeCompletionOptions {
    language?: 'typescript' | 'javascript' | 'python' | 'go' | 'rust' | 'java' | 'php';
    maxSuggestions?: number;
    useContext?: boolean;
    includeImports?: boolean;
    includeComments?: boolean;
    style?: 'minimal' | 'detailed' | 'verbose';
}
export interface CompletionSuggestion {
    code: string;
    description: string;
    confidence: number;
    type: 'function' | 'class' | 'variable' | 'import' | 'statement' | 'block';
    imports?: string[];
    explanation?: string;
}
export interface CompletionResult {
    success: boolean;
    suggestions: CompletionSuggestion[];
    context?: string;
    error?: string;
}
export interface InlineCompletionOptions {
    file: string;
    line: number;
    column: number;
    prefix?: string;
    suffix?: string;
}
export interface SmartSnippet {
    id: string;
    name: string;
    description: string;
    language: string;
    trigger: string;
    template: string;
    variables: string[];
    category: 'function' | 'class' | 'api' | 'database' | 'testing' | 'utility';
    usageCount: number;
    rating: number;
}
export interface CodePattern {
    pattern: string;
    description: string;
    examples: string[];
    bestPractices: string[];
    antiPatterns: string[];
}
export declare class AICodeCompletion {
    private projectRoot;
    private client;
    private analyzer;
    private snippetsCache;
    private patternsCache;
    private completionHistory;
    constructor(projectRoot: string, client: OqoolAPIClient);
    /**
     * إكمال الكود الذكي بناءً على السياق
     */
    completeCode(prompt: string, options?: CodeCompletionOptions): Promise<CompletionResult>;
    /**
     * إكمال سطر الكود في الموقع الحالي
     */
    inlineComplete(options: InlineCompletionOptions): Promise<CompletionResult>;
    /**
     * إكمال دالة كاملة بناءً على التعليق أو الاسم
     */
    completeFunctionFromComment(comment: string, functionName?: string, options?: CodeCompletionOptions): Promise<CompletionResult>;
    /**
     * إكمال كلاس كامل
     */
    completeClass(className: string, description: string, options?: CodeCompletionOptions): Promise<CompletionResult>;
    /**
     * اقتراح تحسينات على كود موجود
     */
    suggestImprovements(code: string, language?: string): Promise<CompletionResult>;
    /**
     * الحصول على snippets ذكية بناءً على السياق
     */
    getSmartSnippets(context: string, language?: string, category?: SmartSnippet['category']): Promise<SmartSnippet[]>;
    /**
     * البحث عن snippet
     */
    searchSnippets(query: string, language?: string): Promise<SmartSnippet[]>;
    /**
     * استخدام snippet
     */
    useSnippet(snippetId: string, variables?: Record<string, string>): Promise<string>;
    /**
     * التعرف على الأنماط في الكود
     */
    recognizePatterns(code: string, language?: string): Promise<CodePattern[]>;
    /**
     * جمع سياق المشروع
     */
    private gatherProjectContext;
    /**
     * بناء prompt للإكمال
     */
    private buildCompletionPrompt;
    /**
     * تحليل الاقتراحات من رد AI
     */
    private parseSuggestions;
    /**
     * تحليل الأنماط من الاقتراحات
     */
    private parsePatterns;
    /**
     * توليد snippets ذكية
     */
    private generateSmartSnippets;
    /**
     * الحصول على السياق المحيط
     */
    private getContextLines;
    /**
     * اكتشاف اللغة من امتداد الملف
     */
    private detectLanguage;
    /**
     * الحصول على الامتداد من اللغة
     */
    private getExtension;
    /**
     * البحث عن ملفات بامتداد معين
     */
    private findFiles;
    /**
     * الحصول على إحصائيات الاستخدام
     */
    getStatistics(): {
        totalCompletions: number;
        acceptedCompletions: number;
        acceptanceRate: string;
        totalSnippets: number;
        mostUsedSnippets: SmartSnippet[];
    };
    /**
     * الحصول على أكثر snippets استخداماً
     */
    private getMostUsedSnippets;
    /**
     * تعليم النظام من الاستخدام
     */
    learnFromUsage(prompt: string, acceptedSuggestion: string, rating: number): Promise<void>;
}
export declare function createAICodeCompletion(projectRoot: string, client: OqoolAPIClient): AICodeCompletion;
//# sourceMappingURL=ai-code-completion.d.ts.map