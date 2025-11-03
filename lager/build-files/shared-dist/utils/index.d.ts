export declare function formatCode(code: string, language: string): string;
export declare function validateProjectStructure(files: string[]): boolean;
export declare function generateId(): string;
export declare function debounce<T extends (...args: any[]) => any>(func: T, delay: number): (...args: Parameters<T>) => void;
export declare class Logger {
    static info(message: string, ...args: any[]): void;
    static error(message: string, ...args: any[]): void;
    static warn(message: string, ...args: any[]): void;
}
//# sourceMappingURL=index.d.ts.map