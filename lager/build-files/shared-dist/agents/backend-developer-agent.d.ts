import { type AIProvider } from '../ai-gateway/index.js';
export interface APIEndpoint {
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    path: string;
    description: string;
    authentication: boolean;
    authorization?: string[];
    requestBody?: Record<string, any>;
    responseBody: Record<string, any>;
    statusCodes: Array<{
        code: number;
        description: string;
    }>;
    rateLimit?: string;
}
export interface DatabaseSchema {
    name: string;
    type: 'sql' | 'nosql';
    tables?: Array<{
        name: string;
        columns: Array<{
            name: string;
            type: string;
            constraints: string[];
        }>;
        indexes: string[];
        relationships: Array<{
            type: 'one-to-one' | 'one-to-many' | 'many-to-many';
            table: string;
        }>;
    }>;
    collections?: Array<{
        name: string;
        schema: Record<string, any>;
        indexes: string[];
    }>;
}
export interface BackendArchitecture {
    framework: string;
    language: string;
    architecture: 'monolithic' | 'microservices' | 'serverless';
    api: {
        type: 'REST' | 'GraphQL' | 'gRPC';
        endpoints: APIEndpoint[];
        documentation: string;
    };
    database: DatabaseSchema;
    authentication: {
        strategy: 'JWT' | 'OAuth' | 'Session' | 'API-Key';
        implementation: string;
    };
    caching: {
        strategy: 'Redis' | 'Memcached' | 'In-Memory' | 'None';
        layers: string[];
    };
    fileStructure: string;
    middleware: string[];
    errorHandling: string;
    logging: string;
    validation: string;
}
export declare class BackendDeveloperAgent {
    private aiAdapter;
    private provider;
    constructor(config: {
        deepseek?: string;
        claude?: string;
        openai?: string;
    }, provider?: AIProvider);
    design(requirements: {
        projectName: string;
        description: string;
        features: string[];
        users?: string[];
        expectedLoad?: 'low' | 'medium' | 'high';
        language?: 'javascript' | 'typescript' | 'python' | 'go' | 'rust';
        database?: 'postgresql' | 'mysql' | 'mongodb' | 'redis';
    }): Promise<BackendArchitecture>;
    private chooseTechStack;
    private designAPI;
    private designDatabase;
    private designAuthentication;
    private chooseCaching;
    private planMiddleware;
    private designErrorHandling;
    private designLogging;
    private designValidation;
    private generateFileStructure;
    private callClaude;
    private parseJSON;
}
//# sourceMappingURL=backend-developer-agent.d.ts.map