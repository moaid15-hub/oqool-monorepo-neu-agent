/**
 * Unified AI Adapter
 * نظام موحد لإدارة جميع مزودي الـ AI
 * يختار أفضل مزود تلقائياً حسب المهمة
 */
export type AIProvider = 'deepseek' | 'claude' | 'openai' | 'gemini' | 'auto';
export type AIRole = 'architect' | 'coder' | 'reviewer' | 'tester' | 'debugger' | 'optimizer' | 'security' | 'devops';
export interface Message {
    role: 'system' | 'user' | 'assistant';
    content: string;
}
export interface AIResponse {
    response: string;
    provider: AIProvider;
    model: string;
    cost: number;
    tokensUsed: {
        input: number;
        output: number;
    };
}
export interface UnifiedAIAdapterConfig {
    deepseek?: string;
    claude?: string;
    openai?: string;
    gemini?: string;
    defaultProvider?: AIProvider;
}
export declare class UnifiedAIAdapter {
    private providers;
    private defaultProvider;
    constructor(config: UnifiedAIAdapterConfig);
    /**
     * الدالة الرئيسية - معالجة مع شخصية AI
     */
    processWithPersonality(personality: AIRole, prompt: string, context?: string, provider?: AIProvider): Promise<AIResponse>;
    /**
     * معالجة عادية بدون شخصية
     */
    process(prompt: string, context?: string, provider?: AIProvider): Promise<AIResponse>;
    /**
     * Streaming Response
     */
    processStream(personality: AIRole, prompt: string, context?: string, provider?: AIProvider): AsyncGenerator<string, void, unknown>;
    /**
     * اختيار أفضل مزود تلقائياً
     */
    private selectProvider;
    /**
     * 🔄 معالج فشل المزود - Fallback الذكي
     */
    private handleProviderFailure;
    /**
     * 🎯 تحديد سلسلة Fallback حسب المزود الفاشل
     */
    private getFallbackChain;
    /**
     * 🔍 تصنيف نوع الخطأ
     */
    private categorizeError;
    /**
     * تقدير تعقيد السؤال
     */
    private estimateComplexity;
    /**
     * تقدير عدد الـ Tokens (تقريبي)
     */
    private estimateTokens;
    /**
     * تعريف الشخصيات الـ8
     */
    private getPersonalitySystemMessage;
    /**
     * وظائف مساعدة سريعة
     */
    quickCodeHelp(prompt: string, codeContext?: string, provider?: AIProvider): Promise<string>;
    quickReview(code: string, provider?: AIProvider): Promise<string>;
    quickOptimize(code: string, provider?: AIProvider): Promise<string>;
    quickDebug(error: string, code?: string, provider?: AIProvider): Promise<string>;
    /**
     * الحصول على إحصائيات
     */
    getAvailableProviders(): Array<{
        id: AIProvider;
        name: string;
        available: boolean;
    }>;
    /**
     * تغيير المزود الافتراضي
     */
    setDefaultProvider(provider: AIProvider): void;
    /**
     * الحصول على معلومات التكلفة
     */
    getCostComparison(): Array<{
        provider: string;
        inputCost: number;
        outputCost: number;
    }>;
}
export default UnifiedAIAdapter;
//# sourceMappingURL=unified-ai-adapter.d.ts.map