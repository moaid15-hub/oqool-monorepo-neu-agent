export interface AgentConfig {
    apiKey: string;
    model?: string;
    maxIterations?: number;
    workingDirectory?: string;
    enablePlanning?: boolean;
    enableContext?: boolean;
    enableLearning?: boolean;
}
export declare class AgentClient {
    private client;
    private config;
    private conversationHistory;
    private contextManager?;
    private planner?;
    private learningSystem?;
    constructor(config: AgentConfig);
    run(userMessage: string): Promise<string>;
    private shouldPlan;
    private getSystemPrompt;
    private processResponse;
    chat(message: string): Promise<string>;
    verifyApiKey(): Promise<boolean>;
    resetConversation(): void;
    getStats(): {
        messagesCount: number;
        iterations: number;
    };
}
export declare function createAgentClient(config: AgentConfig): AgentClient;
//# sourceMappingURL=agent-client.d.ts.map