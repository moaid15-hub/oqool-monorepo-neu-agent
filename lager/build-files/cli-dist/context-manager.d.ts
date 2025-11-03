export interface FileContext {
    path: string;
    content?: string;
    lastRead: number;
    size: number;
    symbols?: string[];
    dependencies?: string[];
}
export interface ProjectContext {
    root: string;
    name: string;
    type: 'node' | 'python' | 'web' | 'unknown';
    framework?: string;
    dependencies: Record<string, string>;
    structure: string[];
}
export declare class ContextManager {
    private workingDirectory;
    private fileCache;
    private projectContext?;
    private openFiles;
    private recentChanges;
    private readonly MAX_CACHE_SIZE;
    private readonly CACHE_TTL;
    constructor(workingDirectory: string);
    analyzeProject(): Promise<ProjectContext>;
    private discoverStructure;
    getFile(filePath: string): Promise<string>;
    private updateCache;
    openFile(filePath: string): Promise<void>;
    closeFile(filePath: string): void;
    recordChange(filePath: string): void;
    searchFiles(pattern: string, options?: {
        includeContent?: boolean;
        fileTypes?: string[];
    }): Promise<string[]>;
    getContextInfo(): {
        project: ProjectContext | undefined;
        openFiles: string[];
        cachedFiles: number;
        recentChanges: string[];
    };
    clearCache(): void;
    generateProjectSummary(): Promise<string>;
    private resolvePath;
    getRelatedFiles(filePath: string): Promise<string[]>;
}
//# sourceMappingURL=context-manager.d.ts.map