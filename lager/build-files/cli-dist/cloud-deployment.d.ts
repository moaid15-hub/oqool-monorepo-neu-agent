import { OqoolAPIClient } from './api-client.js';
export interface CloudProvider {
    name: 'aws' | 'gcp' | 'azure' | 'vercel' | 'netlify' | 'heroku' | 'digitalocean' | 'railway';
    displayName: string;
    region?: string;
    credentials: CloudCredentials;
    resources: CloudResource[];
}
export interface CloudCredentials {
    accessKey?: string;
    secretKey?: string;
    projectId?: string;
    subscriptionId?: string;
    token?: string;
    apiKey?: string;
    region?: string;
}
export interface CloudResource {
    type: 'compute' | 'database' | 'storage' | 'cdn' | 'dns' | 'loadbalancer';
    name: string;
    config: Record<string, any>;
    status: 'creating' | 'running' | 'stopped' | 'error';
    url?: string;
    cost?: number;
}
export interface DeploymentConfig {
    provider: CloudProvider;
    project: DeploymentProject;
    environment: 'development' | 'staging' | 'production';
    settings: DeploymentSettings;
}
export interface DeploymentProject {
    name: string;
    type: 'web' | 'api' | 'mobile' | 'desktop' | 'cli';
    framework?: string;
    language: string;
    buildCommand?: string;
    startCommand?: string;
    port?: number;
    environmentVariables: Record<string, string>;
}
export interface DeploymentSettings {
    autoDeploy: boolean;
    branch: string;
    buildTimeout: number;
    healthCheckPath: string;
    domain?: string;
    ssl: boolean;
    scaling: {
        min: number;
        max: number;
        target: number;
    };
    notifications: {
        email: string[];
        slack?: string;
        discord?: string;
    };
}
export interface DeploymentResult {
    success: boolean;
    url?: string;
    logs: string[];
    error?: string;
    deploymentId: string;
    status: 'success' | 'failed' | 'pending';
    cost?: number;
}
export declare class CloudDeployment {
    private apiClient;
    private workingDir;
    private configPath;
    private deploymentsPath;
    constructor(apiClient: OqoolAPIClient, workingDir?: string);
    private initializeSystem;
    setupCloudProvider(): Promise<void>;
    private collectProviderCredentials;
    private getProviderRegions;
    private getProviderDisplayName;
    createDeploymentProject(): Promise<void>;
    private analyzeProjectType;
    private collectEnvironmentVariables;
    generateDeploymentFiles(): Promise<void>;
    private createDockerfile;
    private generateDockerfileContent;
    private createDockerCompose;
    private generateDockerComposeContent;
    private createDeploymentConfigFiles;
    private createVercelConfig;
    private createNetlifyConfig;
    private createHerokuConfig;
    private createGenericConfig;
    private createGitHubActions;
    private generateGitHubWorkflow;
    private createEnvironmentFile;
    private tomlStringify;
    private displayDeploymentSummary;
    deploy(): Promise<DeploymentResult>;
    private validateDeploymentFiles;
    private buildProject;
    private deployToProvider;
    private calculateDeploymentCost;
    getDeploymentStatus(deploymentId: string): Promise<any>;
    stopDeployment(): Promise<void>;
    rollbackDeployment(): Promise<void>;
    private saveCloudConfig;
    private loadCloudConfig;
    private saveDeploymentConfig;
    private loadDeploymentConfig;
}
export declare function createCloudDeployment(apiClient: OqoolAPIClient, workingDir?: string): CloudDeployment;
//# sourceMappingURL=cloud-deployment.d.ts.map