/**
 * DeepSeek AI Service
 * المزود الأرخص - مناسب للمهام البسيطة والمتوسطة
 */
export interface Message {
    role: 'system' | 'user' | 'assistant';
    content: string;
}
export interface ChatCompletionOptions {
    model?: string;
    maxTokens?: number;
    temperature?: number;
    stream?: boolean;
}
export declare class DeepSeekService {
    private apiKey;
    private baseURL;
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
    calculateCost(inputTokens: number, outputTokens: number): number;
    /**
     * التحقق من صلاحية الـ API Key
     */
    validateApiKey(): Promise<boolean>;
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
export default DeepSeekService;
//# sourceMappingURL=deepseek-service.d.ts.map