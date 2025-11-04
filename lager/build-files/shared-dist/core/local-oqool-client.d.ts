import { Message, ChatResponse } from './api-client.js';
export declare class LocalClaudeClient {
    private client;
    private apiKey;
    constructor(apiKey: string);
    sendChatMessage(messages: Message[]): Promise<ChatResponse>;
    generateCode(prompt: string, fileContext: {
        path: string;
        content: string;
    }[]): Promise<ChatResponse>;
    private buildContextMessage;
    verifyApiKey(): Promise<boolean>;
}
export declare function createLocalClaudeClient(): LocalClaudeClient | null;
//# sourceMappingURL=local-oqool-client.d.ts.map