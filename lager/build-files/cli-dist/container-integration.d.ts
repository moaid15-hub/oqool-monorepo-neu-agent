import { OqoolAPIClient } from './api-client.js';
export interface ContainerConfig {
    type: 'docker' | 'docker-compose' | 'kubernetes' | 'podman';
    image?: string;
    registry?: string;
    tag?: string;
    environment: Record<string, string>;
    ports: Array<{
        internal: number;
        external: number;
        protocol: string;
    }>;
    volumes: Array<{
        host: string;
        container: string;
        type: 'bind' | 'volume';
    }>;
    networks: string[];
    restart: 'no' | 'always' | 'on-failure' | 'unless-stopped';
    healthCheck?: ContainerHealthCheck;
}
export interface ContainerHealthCheck {
    command: string[];
    interval: number;
    timeout: number;
    retries: number;
    startPeriod: number;
}
export interface ContainerService {
    name: string;
    image: string;
    command?: string[];
    environment: Record<string, string>;
    ports: Array<{
        published: number;
        target: number;
    }>;
    volumes: Array<{
        type: string;
        source: string;
        target: string;
    }>;
    dependsOn: string[];
    networks: string[];
    deploy?: {
        replicas: number;
        resources: {
            limits: {
                cpu: string;
                memory: string;
            };
            reservations: {
                cpu: string;
                memory: string;
            };
        };
    };
}
export interface DockerComposeConfig {
    version: string;
    services: Record<string, ContainerService>;
    networks: Record<string, any>;
    volumes: Record<string, any>;
}
export interface KubernetesManifest {
    apiVersion: string;
    kind: string;
    metadata: {
        name: string;
        namespace?: string;
        labels?: Record<string, string>;
    };
    spec: any;
}
export interface ContainerImage {
    name: string;
    tag: string;
    size: string;
    created: string;
    architecture: string;
    os: string;
}
export interface ContainerRuntime {
    name: string;
    version: string;
    apiVersion: string;
    arch: string;
    os: string;
    kernelVersion: string;
    operatingSystem: string;
    ostype: string;
}
export interface ContainerStats {
    containerId: string;
    name: string;
    cpuUsage: number;
    memoryUsage: number;
    memoryLimit: number;
    networkIO: {
        rx: number;
        tx: number;
    };
    blockIO: {
        read: number;
        write: number;
    };
    uptime: string;
}
export declare class ContainerIntegration {
    private apiClient;
    private workingDir;
    private configPath;
    private dockerfilesPath;
    private k8sPath;
    constructor(apiClient: OqoolAPIClient, workingDir?: string);
    private initializeSystem;
    setupContainer(): Promise<void>;
    private collectContainerConfig;
    private generateContainerFiles;
    private createDockerfile;
    private detectProjectType;
    private generateNodeDockerfile;
    private generatePythonDockerfile;
    private generateGoDockerfile;
    private generateRustDockerfile;
    private generateJavaDockerfile;
    private generateGenericDockerfile;
    private createDockerCompose;
    private createDockerIgnore;
    private createKubernetesManifests;
    private createContainerConfig;
    buildImage(tag?: string): Promise<void>;
    runContainer(name?: string): Promise<void>;
    stopContainer(name?: string): Promise<void>;
    deployToKubernetes(namespace?: string): Promise<void>;
    monitorContainers(): Promise<void>;
    private getContainerList;
    private getContainerStats;
    cleanup(): Promise<void>;
    optimizeImage(): Promise<void>;
    private createOptimizedDockerfile;
    monitorSystem(): Promise<void>;
    private getContainerRuntime;
    private getSystemResources;
    private executeCommand;
    private formatBytes;
    private loadContainerConfig;
    createKubernetesIngress(domain?: string): Promise<void>;
    createKubernetesConfig(): Promise<void>;
}
export declare function createContainerIntegration(apiClient: OqoolAPIClient, workingDir?: string): ContainerIntegration;
//# sourceMappingURL=container-integration.d.ts.map