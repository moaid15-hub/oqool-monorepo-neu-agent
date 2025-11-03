export interface GitOptions {
    autoCommit?: boolean;
    autoPush?: boolean;
    branchPrefix?: string;
    commitMessage?: string;
}
export interface GitResult {
    success: boolean;
    message?: string;
    error?: string;
    branch?: string;
    commit?: string;
}
export interface BranchInfo {
    current: string;
    isClean: boolean;
    hasRemote: boolean;
}
export interface DiffInfo {
    filesChanged: number;
    additions: number;
    deletions: number;
    diff: string;
}
export declare class GitManager {
    private workingDir;
    constructor(workingDir?: string);
    /**
     * التحقق من أن المجلد هو git repository
     */
    isGitRepo(): Promise<boolean>;
    /**
     * تشغيل أمر git
     */
    private runGitCommand;
    /**
     * الحصول على معلومات الـ branch الحالي
     */
    getCurrentBranch(): Promise<BranchInfo | null>;
    /**
     * توليد اسم branch من prompt
     */
    generateBranchName(prompt: string, prefix?: string): string;
    /**
     * إنشاء branch جديد
     */
    createBranch(branchName: string): Promise<GitResult>;
    /**
     * التبديل إلى branch
     */
    switchBranch(branchName: string): Promise<GitResult>;
    /**
     * إضافة ملفات للـ staging
     */
    addFiles(files: string[]): Promise<GitResult>;
    /**
     * عمل commit
     */
    commit(message: string): Promise<GitResult>;
    /**
     * عرض الـ diff
     */
    getDiff(staged?: boolean): Promise<DiffInfo | null>;
    /**
     * عرض diff بشكل جميل
     */
    displayDiff(staged?: boolean): Promise<void>;
    /**
     * الحصول على قائمة الملفات المعدلة
     */
    getModifiedFiles(): Promise<string[]>;
    /**
     * الحصول على قائمة الملفات غير المتتبعة
     */
    getUntrackedFiles(): Promise<string[]>;
    /**
     * push للـ remote
     */
    push(branch?: string, setUpstream?: boolean): Promise<GitResult>;
    /**
     * توليد رسالة commit من الملفات
     */
    generateCommitMessage(files: string[], prompt?: string): string;
    /**
     * Workflow كامل: branch + commit + diff + (optional) push
     */
    autoWorkflow(files: string[], prompt: string, options?: GitOptions): Promise<GitResult>;
}
export declare function createGitManager(workingDir?: string): GitManager;
//# sourceMappingURL=git-manager.d.ts.map