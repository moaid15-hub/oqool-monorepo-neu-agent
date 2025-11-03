export declare function readFile(params: {
    path: string;
}): Promise<string>;
export declare function writeFile(params: {
    path: string;
    content: string;
}): Promise<string>;
export declare function listDirectory(params: {
    path: string;
    recursive?: boolean;
}): Promise<string>;
export declare function editFile(params: {
    path: string;
    old_text: string;
    new_text: string;
}): Promise<string>;
export declare function executeCommand(params: {
    command: string;
    cwd?: string;
    timeout?: number;
}): Promise<string>;
export declare function searchInFiles(params: {
    pattern: string;
    directory: string;
    filePattern?: string;
}): Promise<string>;
export declare const TOOL_DEFINITIONS: ({
    name: string;
    description: string;
    input_schema: {
        type: string;
        properties: {
            path: {
                type: string;
                description: string;
            };
            content?: undefined;
            recursive?: undefined;
            old_text?: undefined;
            new_text?: undefined;
            command?: undefined;
            cwd?: undefined;
            timeout?: undefined;
            pattern?: undefined;
            directory?: undefined;
            filePattern?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    input_schema: {
        type: string;
        properties: {
            path: {
                type: string;
                description: string;
            };
            content: {
                type: string;
                description: string;
            };
            recursive?: undefined;
            old_text?: undefined;
            new_text?: undefined;
            command?: undefined;
            cwd?: undefined;
            timeout?: undefined;
            pattern?: undefined;
            directory?: undefined;
            filePattern?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    input_schema: {
        type: string;
        properties: {
            path: {
                type: string;
                description: string;
            };
            recursive: {
                type: string;
                description: string;
                default: boolean;
            };
            content?: undefined;
            old_text?: undefined;
            new_text?: undefined;
            command?: undefined;
            cwd?: undefined;
            timeout?: undefined;
            pattern?: undefined;
            directory?: undefined;
            filePattern?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    input_schema: {
        type: string;
        properties: {
            path: {
                type: string;
                description: string;
            };
            old_text: {
                type: string;
                description: string;
            };
            new_text: {
                type: string;
                description: string;
            };
            content?: undefined;
            recursive?: undefined;
            command?: undefined;
            cwd?: undefined;
            timeout?: undefined;
            pattern?: undefined;
            directory?: undefined;
            filePattern?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    input_schema: {
        type: string;
        properties: {
            command: {
                type: string;
                description: string;
            };
            cwd: {
                type: string;
                description: string;
            };
            timeout: {
                type: string;
                description: string;
            };
            path?: undefined;
            content?: undefined;
            recursive?: undefined;
            old_text?: undefined;
            new_text?: undefined;
            pattern?: undefined;
            directory?: undefined;
            filePattern?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    input_schema: {
        type: string;
        properties: {
            pattern: {
                type: string;
                description: string;
            };
            directory: {
                type: string;
                description: string;
            };
            filePattern: {
                type: string;
                description: string;
                default: string;
            };
            path?: undefined;
            content?: undefined;
            recursive?: undefined;
            old_text?: undefined;
            new_text?: undefined;
            command?: undefined;
            cwd?: undefined;
            timeout?: undefined;
        };
        required: string[];
    };
})[];
export declare function executeTool(toolName: string, toolInput: any): Promise<string>;
//# sourceMappingURL=tools.d.ts.map