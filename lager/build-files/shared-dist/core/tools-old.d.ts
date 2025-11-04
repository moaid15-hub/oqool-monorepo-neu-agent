export declare function readFile(filePath: string): Promise<{
    success: boolean;
    content?: string;
    error?: string;
}>;
export declare function writeFile(filePath: string, content: string): Promise<{
    success: boolean;
    error?: string;
}>;
export declare function editFile(filePath: string, oldText: string, newText: string): Promise<{
    success: boolean;
    error?: string;
}>;
export declare function runCommand(command: string): Promise<{
    success: boolean;
    output?: string;
    error?: string;
}>;
export declare function listDirectory(dirPath: string): Promise<{
    success: boolean;
    files?: string[];
    error?: string;
}>;
export declare function searchInFiles(dirPath: string, searchPattern: string): Promise<{
    success: boolean;
    matches?: string[];
    error?: string;
}>;
export declare const toolDefinitions: ({
    name: string;
    description: string;
    input_schema: {
        type: string;
        properties: {
            file_path: {
                type: string;
                description: string;
            };
            content?: undefined;
            old_text?: undefined;
            new_text?: undefined;
            command?: undefined;
            dir_path?: undefined;
            search_pattern?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    input_schema: {
        type: string;
        properties: {
            file_path: {
                type: string;
                description: string;
            };
            content: {
                type: string;
                description: string;
            };
            old_text?: undefined;
            new_text?: undefined;
            command?: undefined;
            dir_path?: undefined;
            search_pattern?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    input_schema: {
        type: string;
        properties: {
            file_path: {
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
            command?: undefined;
            dir_path?: undefined;
            search_pattern?: undefined;
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
            file_path?: undefined;
            content?: undefined;
            old_text?: undefined;
            new_text?: undefined;
            dir_path?: undefined;
            search_pattern?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    input_schema: {
        type: string;
        properties: {
            dir_path: {
                type: string;
                description: string;
            };
            file_path?: undefined;
            content?: undefined;
            old_text?: undefined;
            new_text?: undefined;
            command?: undefined;
            search_pattern?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    input_schema: {
        type: string;
        properties: {
            dir_path: {
                type: string;
                description: string;
            };
            search_pattern: {
                type: string;
                description: string;
            };
            file_path?: undefined;
            content?: undefined;
            old_text?: undefined;
            new_text?: undefined;
            command?: undefined;
        };
        required: string[];
    };
})[];
export declare function executeTool(toolName: string, toolInput: any): Promise<any>;
//# sourceMappingURL=tools-old.d.ts.map