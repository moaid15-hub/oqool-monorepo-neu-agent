import { type AIProvider } from '../ai-gateway/index.js';
export interface APIIntegration {
    endpoint: string;
    method: string;
    frontendFunction: string;
    hookName?: string;
    stateManagement?: string;
    errorHandling: string;
    loading: string;
    code: string;
}
export interface DataFlow {
    component: string;
    action: string;
    apiCall: string;
    dataTransformation?: string;
    stateUpdate: string;
    uiUpdate: string;
}
export interface IntegrationResult {
    apiClient: {
        baseUrl: string;
        code: string;
        interceptors: string[];
    };
    hooks: Array<{
        name: string;
        purpose: string;
        code: string;
    }>;
    integrations: APIIntegration[];
    dataFlows: DataFlow[];
    errorBoundary: string;
    loadingStates: string;
    typeDefinitions: string;
    envVariables: string[];
}
export declare class FullStackIntegratorAgent {
    private aiAdapter;
    private provider;
    constructor(config: {
        deepseek?: string;
        claude?: string;
        openai?: string;
    }, provider?: AIProvider);
    integrate(specification: {
        frontend: {
            framework: string;
            components: string[];
            stateManagement: string;
        };
        backend: {
            baseUrl: string;
            endpoints: Array<{
                method: string;
                path: string;
                description: string;
            }>;
            authentication: string;
        };
        features: string[];
    }): Promise<IntegrationResult>;
    private createAPIClient;
    private generateHooks;
    private createIntegrations;
    private createSingleIntegration;
    private mapDataFlows;
    private createErrorBoundary;
    private designLoadingStates;
    private generateTypeDefinitions;
    private listEnvVariables;
    private callClaude;
    private parseJSON;
}
//# sourceMappingURL=fullstack-integrator-agent.d.ts.map