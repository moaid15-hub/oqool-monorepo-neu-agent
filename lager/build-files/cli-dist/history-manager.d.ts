export interface HistoryEntry {
    id: string;
    action: string;
    description: string;
    timestamp: number;
    files: string[];
    before: Map<string, string>;
    after: Map<string, string>;
    metadata?: {
        prompt?: string;
        command?: string;
        provider?: string;
    };
}
export interface HistoryOptions {
    maxEntries?: number;
    autoSave?: boolean;
    historyPath?: string;
}
export interface HistoryStats {
    totalEntries: number;
    currentIndex: number;
    canUndo: boolean;
    canRedo: boolean;
    totalSize: number;
}
export declare class HistoryManager {
    private workingDir;
    private history;
    private currentIndex;
    private maxEntries;
    private autoSave;
    private historyPath;
    constructor(workingDir?: string, options?: HistoryOptions);
    /**
     * تحميل التاريخ من الملف
     */
    private loadHistory;
    /**
     * حفظ التاريخ في الملف
     */
    private saveHistory;
    /**
     * توليد ID فريد
     */
    private generateId;
    /**
     * قراءة محتويات الملفات الحالية
     */
    private readFiles;
    /**
     * إضافة entry جديد
     */
    addEntry(action: string, description: string, files: string[], metadata?: any): Promise<void>;
    /**
     * تحديث entry بعد التعديل
     */
    updateCurrentEntry(): Promise<void>;
    /**
     * التراجع (Undo)
     */
    undo(): Promise<boolean>;
    /**
     * الإعادة (Redo)
     */
    redo(): Promise<boolean>;
    /**
     * هل يمكن التراجع؟
     */
    canUndo(): boolean;
    /**
     * هل يمكن الإعادة؟
     */
    canRedo(): boolean;
    /**
     * عرض التاريخ
     */
    showHistory(): void;
    /**
     * الذهاب لـ entry محدد
     */
    goTo(index: number): Promise<boolean>;
    /**
     * مسح التاريخ
     */
    clearHistory(): Promise<void>;
    /**
     * الحصول على إحصائيات
     */
    getStats(): HistoryStats;
    /**
     * عرض إحصائيات
     */
    displayStats(): void;
    /**
     * البحث في التاريخ
     */
    search(query: string): HistoryEntry[];
    /**
     * عرض نتائج البحث
     */
    displaySearch(query: string): void;
    /**
     * تصدير التاريخ
     */
    exportHistory(format?: 'json' | 'csv'): Promise<string>;
}
export declare function createHistoryManager(workingDir?: string, options?: HistoryOptions): HistoryManager;
//# sourceMappingURL=history-manager.d.ts.map