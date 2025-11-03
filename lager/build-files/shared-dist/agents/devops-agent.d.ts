import { type AIProvider } from '../ai-gateway/index.js';
import type { GeneratedCode, CodeFile } from '../core/god-mode.js';
export interface DeploymentConfig {
    platform: 'vercel' | 'netlify' | 'aws' | 'gcp' | 'azure' | 'docker' | 'kubernetes' | 'heroku';
    environment: 'development' | 'staging' | 'production';
    config: Record<string, any>;
    scripts?: string[];
}
export interface CICDPipeline {
    provider: 'github-actions' | 'gitlab-ci' | 'jenkins' | 'circleci' | 'travis';
    stages: string[];
    config: string;
    path: string;
}
export interface InfrastructureFile {
    type: 'dockerfile' | 'docker-compose' | 'kubernetes' | 'terraform' | 'helm';
    path: string;
    content: string;
}
export interface DevOpsResults {
    deploymentConfigs: DeploymentConfig[];
    cicdPipelines: CICDPipeline[];
    infrastructureFiles: InfrastructureFile[];
    environmentFiles: CodeFile[];
    readiness: {
        score: number;
        issues: string[];
        recommendations: string[];
    };
    summary: string;
}
export declare class DevOpsAgent {
    private aiAdapter;
    private provider;
    constructor(config: {
        deepseek?: string;
        claude?: string;
        openai?: string;
    }, provider?: AIProvider);
    prepare(code: GeneratedCode, targetPlatform?: string): Promise<DevOpsResults>;
    private detectProjectType;
    private generateDeploymentConfigs;
    private suggestPlatforms;
    private createPlatformConfig;
    private generateCICDPipeline;
    private generateInfrastructure;
    private generateDockerfile;
    private generateDockerCompose;
    private generateKubernetes;
    private generateEnvironmentFiles;
    private createEnvExample;
    private createEnvProduction;
    private checkDeploymentReadiness;
    private callClaude;
    private parseDeploymentConfig;
    private parseCICDPipeline;
    private extractCode;
    private generateSummary;
}
//# sourceMappingURL=devops-agent.d.ts.map