/**
 * OpenAI Service (GPT-4)
 * متوازن - جودة عالية بسعر معقول
 */
export interface Message {
    role: 'system' | 'user' | 'assistant';
    content: string;
}
export interface ChatCompletionOptions {
    model?: string;
    maxTokens?: number;
    temperature?: number;
}
export declare class OpenAIService {
    private client;
    constructor(apiKey: string);
    /**
     * إرسال رسالة للـ AI
     */
    chatCompletion(messages: Message[], options?: ChatCompletionOptions): Promise<string>;
    /**
     * Streaming Response
     */
    chatCompletionStream(messages: Message[], options?: ChatCompletionOptions): AsyncGenerator<string, void, unknown>;
    /**
     * حساب التكلفة التقريبية
     */
    calculateCost(inputTokens: number, outputTokens: number, model?: string): number;
    /**
     * التحقق من صلاحية الـ API Key
     */
    validateApiKey(): Promise<boolean>;
    /**
     * الحصول على النماذج المتاحة
     */
    getAvailableModels(): {
        id: string;
        name: string;
        description: string;
        maxTokens: number;
        cost: {
            input: number;
            output: number;
        };
    }[];
    /**
     * 🔍 تحسين رسائل الخطأ
     */
    private enhanceError;
    /**
     * الحصول على معلومات النموذج
     */
    getModelInfo(): {
        name: string;
        model: string;
        maxTokens: number;
        costPer1MTokens: {
            input: number;
            output: number;
        };
        description: string;
        strengths: string[];
        weaknesses: string[];
    };
}
export default OpenAIService;
//# sourceMappingURL=openai-service.d.ts.map