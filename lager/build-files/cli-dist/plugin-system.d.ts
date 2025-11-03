export interface ToolDefinition {
    name: string;
    description: string;
    parameters: any;
    execute: (params: any) => Promise<any>;
}
export interface Command {
    name: string;
    description: string;
    action: (...args: any[]) => Promise<void>;
}
export interface oqoolPlugin {
    name: string;
    version: string;
    description?: string;
    author?: string;
    onLoad?: () => void | Promise<void>;
    onUnload?: () => void | Promise<void>;
    onStart?: () => void | Promise<void>;
    onError?: (error: Error) => void | Promise<void>;
    onFileChange?: (file: string) => void | Promise<void>;
    tools?: ToolDefinition[];
    commands?: Command[];
}
export declare class PluginManager {
    private plugins;
    private pluginDir;
    constructor(workingDirectory: string);
    load(pluginPath: string): Promise<void>;
    unload(pluginName: string): Promise<void>;
    getAllTools(): ToolDefinition[];
    getAllCommands(): Command[];
    list(): oqoolPlugin[];
    triggerHook(hookName: keyof oqoolPlugin, ...args: any[]): Promise<void>;
    saveConfig(): Promise<void>;
    loadFromConfig(): Promise<void>;
}
export declare const examplePlugin: oqoolPlugin;
//# sourceMappingURL=plugin-system.d.ts.map