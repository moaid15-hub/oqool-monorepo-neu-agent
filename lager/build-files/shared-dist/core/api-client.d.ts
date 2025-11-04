export interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
}
export interface ChatRequest {
    messages: Message[];
    provider?: string;
    temperature?: number;
}
export interface ChatResponse {
    success: boolean;
    message: string;
    usedProvider?: string;
    error?: string;
}
export interface VerifyKeyResponse {
    success: boolean;
    userId?: string;
    email?: string;
    plan?: string;
    remainingMessages?: number;
    error?: string;
}
export declare class OqoolAPIClient {
    private client;
    private apiKey;
    private baseURL;
    constructor(apiKey: string, baseURL?: string);
    verifyApiKey(): Promise<VerifyKeyResponse>;
    sendChatMessage(messages: Message[], provider?: string): Promise<ChatResponse>;
    generateCode(prompt: string, fileContext: {
        path: string;
        content: string;
    }[]): Promise<ChatResponse>;
    private buildContextMessage;
}
export declare function createClientFromConfig(): Promise<any | null>;
//# sourceMappingURL=api-client.d.ts.map