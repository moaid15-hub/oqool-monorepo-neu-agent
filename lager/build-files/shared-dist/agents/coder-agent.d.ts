import { type AIProvider } from '../ai-gateway/index.js';
import type { Architecture, GeneratedCode } from '../core/god-mode.js';
export declare class CoderAgent {
    private aiAdapter;
    private provider;
    constructor(config: {
        deepseek?: string;
        claude?: string;
        openai?: string;
    }, provider?: AIProvider);
    implement(architecture: Architecture, task: string): Promise<GeneratedCode>;
    private generateComponent;
    private generateRoute;
    private generateModel;
    private generateFrontendComponent;
    private generateConfigFiles;
    private detectDependencies;
    private callClaude;
    private parseCode;
    private detectLanguage;
}
//# sourceMappingURL=coder-agent.d.ts.map