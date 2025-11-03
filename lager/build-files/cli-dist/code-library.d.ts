export interface CodeSnippet {
    name: string;
    code: string;
    tags: string[];
    language: string;
    description?: string;
    author?: string;
    createdAt: string;
    usageCount: number;
}
export interface CodeLibraryConfig {
    libraryPath: string;
    enableSharing?: boolean;
    enableStats?: boolean;
}
export declare class CodeLibrary {
    private config;
    private snippetsPath;
    constructor(config: CodeLibraryConfig);
    private ensureLibraryExists;
    saveSnippet(name: string, code: string, tags: string[], description?: string): Promise<void>;
    searchSnippets(query: string): Promise<CodeSnippet[]>;
    shareSnippet(name: string): Promise<string | null>;
    getSnippet(name: string): Promise<CodeSnippet | null>;
    listAllSnippets(): Promise<CodeSnippet[]>;
    deleteSnippet(name: string): Promise<boolean>;
    private detectLanguage;
    getStats(): Promise<{
        totalSnippets: number;
        mostUsed: CodeSnippet[];
        byLanguage: Record<string, number>;
        totalUsage: number;
    }>;
}
export declare function createCodeLibrary(config: CodeLibraryConfig): CodeLibrary;
//# sourceMappingURL=code-library.d.ts.map