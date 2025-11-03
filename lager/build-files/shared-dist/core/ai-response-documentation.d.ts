export interface AIDocumentation {
    timestamp: string;
    prompt: string;
    response: string;
    filesGenerated: string[];
    filesModified: string[];
    language?: string;
    provider?: string;
    executionTime?: number;
    tags: string[];
    rating?: number;
}
export interface DocumentationConfig {
    enabled: boolean;
    outputDir: string;
    maxEntries: number;
    includeCode: boolean;
    includeMetadata: boolean;
    autoGenerate: boolean;
}
export declare class AIResponseDocumentation {
    private config;
    private documentationPath;
    constructor(config?: Partial<DocumentationConfig>);
    /**
     * تهيئة نظام التوثيق
     */
    private initializeDocumentation;
    /**
     * إنشاء ملف الفهرس
     */
    private createIndexFile;
    /**
     * توثيق رد AI
     */
    documentResponse(prompt: string, response: string, metadata: {
        filesGenerated?: string[];
        filesModified?: string[];
        language?: string;
        provider?: string;
        executionTime?: number;
        tags?: string[];
    }): Promise<void>;
    /**
     * تحديث ملف الفهرس
     */
    private updateIndex;
    /**
     * إنشاء ملخص الجلسة
     */
    private generateSessionSummary;
    /**
     * البحث في التوثيق
     */
    searchDocumentation(query: string): Promise<AIDocumentation[]>;
    /**
     * عرض إحصائيات التوثيق
     */
    getStatistics(): Promise<{
        totalInteractions: number;
        languagesUsed: Map<string, number>;
        providersUsed: Map<string, number>;
        averageExecutionTime: number;
        mostCommonTags: Array<[string, number]>;
    }>;
    /**
     * تصدير التوثيق
     */
    exportDocumentation(format: 'json' | 'csv' | 'markdown'): Promise<string>;
    /**
     * تصدير كـ CSV
     */
    private exportAsCSV;
    /**
     * تصدير كـ Markdown
     */
    private exportAsMarkdown;
    /**
     * تحديث التكوين
     */
    updateConfig(newConfig: Partial<DocumentationConfig>): Promise<void>;
}
export declare function createAIDocumentation(config?: Partial<DocumentationConfig>): AIResponseDocumentation;
//# sourceMappingURL=ai-response-documentation.d.ts.map