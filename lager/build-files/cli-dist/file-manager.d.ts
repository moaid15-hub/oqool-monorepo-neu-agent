export interface FileInfo {
    path: string;
    content: string;
    size: number;
    extension: string;
}
interface ProjectContext {
    files: FileInfo[];
    structure: string;
    totalFiles: number;
    totalSize: number;
}
export interface PatchOperation {
    line: number;
    remove?: number;
    add?: string;
    replace?: string;
}
export interface FilePatch {
    path: string;
    patches: PatchOperation[];
}
export declare class FileManager {
    private workingDir;
    private ig;
    private changedFiles;
    constructor(workingDir?: string);
    private loadIgnorePatterns;
    getProjectContext(maxFiles?: number): Promise<ProjectContext>;
    scanFiles(maxFiles?: number): Promise<FileInfo[]>;
    readFile(filePath: string): Promise<string | null>;
    writeFile(filePath: string, content: string): Promise<boolean>;
    deleteFile(filePath: string): Promise<boolean>;
    getDirectoryStructure(maxDepth?: number): Promise<string>;
    private buildTree;
    private getFileIcon;
    extractFilesFromResponse(response: string): Array<{
        path: string;
        content: string;
    }>;
    /**
     * تطبيق patch على ملف
     * @param filePath مسار الملف
     * @param patch عملية الـ patch
     * @returns نجاح العملية
     */
    applyPatch(filePath: string, patch: PatchOperation): Promise<boolean>;
    /**
     * تطبيق عدة patches على ملف واحد
     * @param filePath مسار الملف
     * @param patches قائمة العمليات
     * @returns نجاح العملية
     */
    applyPatches(filePath: string, patches: PatchOperation[]): Promise<boolean>;
    /**
     * استخراج patches من رد AI
     * يبحث عن نمط مثل:
     * PATCH: src/api.js
     * LINE: 45
     * REMOVE: 2
     * ADD:
     * ```
     * const result = await db.query();
     * ```
     */
    extractPatchesFromResponse(response: string): FilePatch[];
    /**
     * عرض معاينة للـ patch قبل التطبيق
     */
    previewPatch(filePath: string, patch: PatchOperation): Promise<void>;
    /**
     * الحصول على قائمة الملفات المتغيرة
     */
    getChangedFiles(): string[];
    /**
     * التحقق من وجود ملفات متغيرة
     */
    hasChangedFiles(): boolean;
    /**
     * إعادة تعيين تتبع الملفات
     */
    clearTracking(): void;
    /**
     * عرض الملفات المتغيرة
     */
    displayChangedFiles(): void;
}
export declare function createFileManager(workingDir?: string): FileManager;
export {};
//# sourceMappingURL=file-manager.d.ts.map