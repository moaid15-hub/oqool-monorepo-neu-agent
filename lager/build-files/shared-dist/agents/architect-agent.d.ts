import { type AIProvider } from '../ai-gateway/index.js';
import type { Architecture } from '../core/god-mode.js';
export declare class ArchitectAgent {
    private aiAdapter;
    private provider;
    constructor(config: {
        deepseek?: string;
        claude?: string;
        openai?: string;
    }, provider?: AIProvider);
    design(task: string): Promise<Architecture>;
    private callClaude;
    private extractComponents;
    private extractDatabase;
    private extractAPI;
    private extractFrontend;
    private extractTags;
    private parseJSON;
}
//# sourceMappingURL=architect-agent.d.ts.map