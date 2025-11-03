import { FileManager } from './file-manager.js';
import { CodeAnalyzer } from './code-analyzer.js';
export interface ProcessingOptions {
    concurrency?: number;
    timeout?: number;
    retries?: number;
    onProgress?: (completed: number, total: number) => void;
}
export interface ProcessingResult<T> {
    success: boolean;
    results: T[];
    errors: Array<{
        file: string;
        error: string;
    }>;
    duration: number;
    completedCount: number;
    failedCount: number;
}
export interface TaskResult<T> {
    file: string;
    success: boolean;
    result?: T;
    error?: string;
    duration: number;
}
export declare class ParallelProcessor {
    private concurrency;
    private timeout;
    private retries;
    constructor(options?: ProcessingOptions);
    /**
     * معالجة ملفات متعددة بالتوازي
     */
    processFiles<T>(files: string[], processor: (file: string) => Promise<T>, options?: ProcessingOptions): Promise<ProcessingResult<T>>;
    /**
     * معالجة مع إعادة المحاولة
     */
    private processWithRetry;
    /**
     * قراءة ملفات متعددة بالتوازي
     */
    readFilesInParallel(fileManager: FileManager, files: string[]): Promise<ProcessingResult<string>>;
    /**
     * تحليل ملفات متعددة بالتوازي
     */
    analyzeFilesInParallel(analyzer: CodeAnalyzer, files: string[]): Promise<ProcessingResult<any>>;
    /**
     * كتابة ملفات متعددة بالتوازي
     */
    writeFilesInParallel(fileManager: FileManager, files: Array<{
        path: string;
        content: string;
    }>): Promise<ProcessingResult<boolean>>;
    /**
     * معالجة دفعات (batches)
     */
    processBatches<T>(items: string[], batchSize: number, processor: (batch: string[]) => Promise<T[]>): Promise<ProcessingResult<T>>;
    /**
     * معالجة مع progress bar
     */
    processWithProgress<T>(files: string[], processor: (file: string) => Promise<T>, label?: string): Promise<ProcessingResult<T>>;
    /**
     * إنشاء progress bar
     */
    private createProgressBar;
    /**
     * عرض إحصائيات النتائج
     */
    displayResults<T>(result: ProcessingResult<T>, label?: string): void;
}
export declare function createParallelProcessor(options?: ProcessingOptions): ParallelProcessor;
//# sourceMappingURL=parallel-processor.d.ts.map