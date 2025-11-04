import { CodeAnalysis } from './code-analyzer.js';
export interface FileSnapshot {
    path: string;
    hash: string;
    size: number;
    mtime: number;
    analysis?: CodeAnalysis;
}
export interface IncrementalResult {
    changed: string[];
    unchanged: string[];
    added: string[];
    removed: string[];
    totalAnalyzed: number;
    skippedCount: number;
    duration: number;
}
export declare class IncrementalAnalyzer {
    private workingDir;
    private analyzer;
    private cacheManager;
    private snapshotsPath;
    private snapshots;
    constructor(workingDir?: string);
    /**
     * تحميل snapshots من الملف
     */
    private loadSnapshots;
    /**
     * حفظ snapshots في الملف
     */
    private saveSnapshots;
    /**
     * حساب hash للملف
     */
    private calculateHash;
    /**
     * إنشاء snapshot للملف
     */
    private createSnapshot;
    /**
     * التحقق من تغيير الملف
     */
    private hasChanged;
    /**
     * تحليل تدريجي للملفات
     */
    analyzeIncremental(files: string[]): Promise<IncrementalResult>;
    /**
     * عرض التغييرات
     */
    private displayChanges;
    /**
     * عرض نتائج التحليل التدريجي
     */
    displayResult(result: IncrementalResult): void;
    /**
     * الحصول على analysis من snapshot
     */
    getAnalysis(filePath: string): Promise<CodeAnalysis | null>;
    /**
     * تحديث snapshot يدوياً
     */
    updateSnapshot(filePath: string): Promise<void>;
    /**
     * مسح جميع snapshots
     */
    clearSnapshots(): Promise<void>;
    /**
     * عرض snapshots الحالية
     */
    displaySnapshots(): void;
    /**
     * إحصائيات الـ cache
     */
    displayCacheStats(): void;
}
export declare function createIncrementalAnalyzer(workingDir?: string): IncrementalAnalyzer;
//# sourceMappingURL=incremental-analyzer.d.ts.map