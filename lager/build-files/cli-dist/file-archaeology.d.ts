export interface FileSnapshot {
    snapshotId: string;
    timestamp: string;
    size: number;
    action: 'created' | 'modified' | 'deleted';
    author?: string;
}
export interface FileHistory {
    filePath: string;
    created: string;
    totalModifications: number;
    currentSize: number;
    sizeGrowth: number;
    snapshots: FileSnapshot[];
    status: 'active' | 'deleted';
}
export interface ArchaeologyAnalysis {
    history: FileHistory;
    insights: string[];
    recommendations: string[];
}
export declare class FileArchaeology {
    private workingDir;
    private guardianPath;
    constructor(workingDir?: string);
    /**
     * تتبع تاريخ ملف معين عبر جميع الإصدارات
     */
    traceFile(filePath: string): Promise<FileHistory>;
    /**
     * تحليل متقدم لتاريخ الملف
     */
    analyzeFile(filePath: string): Promise<ArchaeologyAnalysis>;
    /**
     * عرض تاريخ الملف بشكل جميل
     */
    displayFileHistory(filePath: string): Promise<void>;
    /**
     * مقارنة ملف بين snapshot معينة والحالية
     */
    compareWithSnapshot(filePath: string, snapshotId: string): Promise<void>;
    /**
     * البحث عن الملفات الأكثر تغييراً في المشروع
     */
    findMostChangedFiles(limit?: number): Promise<void>;
    /**
     * الحصول على جميع الملفات في مجلد
     */
    private getAllFiles;
    /**
     * تنسيق التاريخ
     */
    private formatDate;
    /**
     * تنسيق الحجم
     */
    private formatSize;
}
export declare function createFileArchaeology(workingDir?: string): FileArchaeology;
//# sourceMappingURL=file-archaeology.d.ts.map