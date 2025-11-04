import type { CodeFile, Architecture } from '../core/god-mode.js';
/**
 * AI Provider Configuration - إعدادات مزودي الذكاء الاصطناعي
 */
export interface AIProviderConfig {
    name: 'anthropic' | 'openai' | 'deepseek' | 'google';
    apiKey: string;
    model?: string;
    baseURL?: string;
    maxTokens?: number;
    temperature?: number;
}
/**
 * Multi-Provider Configuration - إعدادات متعددة المزودين
 */
export interface MultiProviderConfig {
    providers: AIProviderConfig[];
    defaultProvider?: 'anthropic' | 'openai' | 'deepseek' | 'google';
    fallbackEnabled?: boolean;
    costOptimization?: boolean;
    retryAttempts?: number;
    timeout?: number;
}
/**
 * Task Complexity - مستوى تعقيد المهمة
 */
export type TaskComplexity = 'simple' | 'medium' | 'complex' | 'expert';
/**
 * Cache Entry - بيانات الكاش
 */
interface CacheEntry {
    prompt: string;
    response: string;
    timestamp: number;
    provider: string;
    ttl: number;
}
/**
 * Performance Metrics - مقاييس الأداء
 */
interface PerformanceMetrics {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    totalCost: number;
    totalTokens: number;
    averageLatency: number;
    cacheHits: number;
    cacheMisses: number;
}
/**
 * Request Options - خيارات الطلب
 */
interface RequestOptions {
    complexity?: TaskComplexity;
    preferredProvider?: 'anthropic' | 'openai' | 'deepseek' | 'google';
    useCache?: boolean;
    maxRetries?: number;
    temperature?: number;
    maxTokens?: number;
}
/**
 * ArabicAgent: Advanced Arabic Language Understanding for Programming
 *
 * @description متخصص في فهم اللغة العربية وتحويل الأفكار إلى كود برمجي احترافي
 * مع دعم Multi-Provider وتوفير 70-80% من التكاليف
 *
 * @key_features
 * - ✅ Multi-Provider Support (Anthropic, OpenAI, DeepSeek, Google)
 * - ✅ Intelligent Provider Routing بناءً على التعقيد
 * - ✅ Cost Optimization (توفير 70-80%)
 * - ✅ Smart Caching System
 * - ✅ Retry Logic & Error Handling
 * - ✅ Performance Metrics & Analytics
 * - ✅ Arabic NLP & Programming Terms Translation
 */
export declare class ArabicAgent {
    private aiAdapter;
    private programmingTerms;
    private conversationHistory;
    private logger;
    /**
     * Initialize ArabicAgent
     * @param config - Multi-provider configuration
     */
    constructor(config: MultiProviderConfig);
    /**
     * فهم وتحليل المتطلبات المكتوبة بالعربية
     * @param arabicRequirement - المتطلب بالعربية
     * @param useCache - استخدام الكاش (افتراضي: true)
     * @returns معمارية المشروع المستخلصة
     */
    understandArabicRequirement(arabicRequirement: string, useCache?: boolean): Promise<Architecture>;
    /**
     * تحويل فكرة برمجية بالعربية إلى كود قابل للتنفيذ
     * @param arabicIdea - الفكرة بالعربية
     * @param targetLanguage - لغة البرمجة
     * @param complexity - مستوى التعقيد
     * @returns ملف الكود المولد
     */
    ideaToCode(arabicIdea: string, targetLanguage?: string, complexity?: TaskComplexity): Promise<CodeFile>;
    /**
     * شرح كود برمجي باللغة العربية بشكل مفصل وتعليمي
     * @param codeFile - ملف الكود المراد شرحه
     * @param level - مستوى الشرح (مبتدئ، متوسط، متقدم)
     * @returns شرح تفصيلي بالعربية
     */
    explainCodeInArabic(codeFile: CodeFile, level?: 'beginner' | 'intermediate' | 'advanced'): Promise<string>;
    /**
     * استخراج نية المستخدم من جملة عربية (Intent Recognition)
     * @param arabicText - النص العربي
     * @returns النية والكيانات المستخرجة
     */
    extractIntent(arabicText: string): Promise<{
        intent: string;
        entities: Array<{
            type: string;
            value: string;
        }>;
        confidence: number;
    }>;
    /**
     * ترجمة مصطلح برمجي من العربية للإنجليزية
     * @param arabicTerm - المصطلح بالعربية
     * @returns المصطلح بالإنجليزية
     */
    translateTerm(arabicTerm: string): string;
    /**
     * ترجمة نص برمجي كامل من العربية للإنجليزية
     * @param arabicCode - النص بالعربية
     * @returns النص بالإنجليزية
     */
    translateCodeText(arabicCode: string): string;
    /**
     * Escape special characters for regex
     */
    private escapeRegex;
    /**
     * توليد مثال برمجي عملي بناءً على مفهوم معين
     * @param concept - المفهوم البرمجي بالعربية
     * @param language - لغة البرمجة
     * @param contextType - سياق المثال (عام، تطبيق ويب، تطبيق موبايل، إلخ)
     * @returns كود + شرح
     */
    generateExample(concept: string, language?: string, contextType?: 'general' | 'web' | 'mobile' | 'backend' | 'database'): Promise<{
        code: string;
        explanation: string;
    }>;
    /**
     * تحليل رسالة خطأ وشرحها بالعربية مع حل مقترح
     * @param errorMessage - رسالة الخطأ
     * @param code - الكود الذي سبب الخطأ
     * @param language - لغة البرمجة
     * @returns شرح الخطأ والحل
     */
    explainError(errorMessage: string, code: string, language: string): Promise<string>;
    /**
     * محادثة تفاعلية مع سياق محفوظ
     * @param message - رسالة المستخدم
     * @param resetHistory - إعادة تعيين سجل المحادثة
     * @returns رد المساعد
     */
    chat(message: string, resetHistory?: boolean): Promise<string>;
    /**
     * عرض إحصائيات الاستخدام والتكلفة
     */
    displayStatistics(): void;
    /**
     * الحصول على مقاييس الأداء
     */
    getMetrics(): PerformanceMetrics;
    /**
     * إعادة تعيين المقاييس
     */
    resetMetrics(): void;
    /**
     * مسح الكاش
     */
    clearCache(): void;
    /**
     * تهيئة قاموس المصطلحات البرمجية العربية-الإنجليزية
     */
    private initializeProgrammingTerms;
    /**
     * استخراج معمارية من نص JSON
     */
    private parseArchitecture;
    /**
     * استخراج ملف كود من النص
     */
    private parseCodeFile;
    /**
     * الحصول على امتداد الملف من لغة البرمجة
     */
    private getFileExtension;
    /**
     * تحليل JSON مع معالجة أخطاء
     */
    private parseJSON;
}
export type { RequestOptions, PerformanceMetrics, CacheEntry };
//# sourceMappingURL=arabic-agent.d.ts.map