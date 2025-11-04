export interface PRTemplate {
    name: string;
    title: string;
    body: string;
    labels?: string[];
    reviewers?: string[];
    assignees?: string[];
}
export interface PROptions {
    title?: string;
    body?: string;
    base?: string;
    head?: string;
    draft?: boolean;
    labels?: string[];
    reviewers?: string[];
    assignees?: string[];
    template?: string;
}
export interface PRInfo {
    number: number;
    title: string;
    url: string;
    state: 'open' | 'closed' | 'merged';
    author: string;
    createdAt: string;
    updatedAt: string;
}
export interface PRStats {
    open: number;
    closed: number;
    merged: number;
    total: number;
}
export declare class PRManager {
    private workingDir;
    private templatesPath;
    private builtInTemplates;
    constructor(workingDir?: string);
    /**
     * تحميل القوالب المدمجة
     */
    private loadBuiltInTemplates;
    /**
     * التحقق من وجود gh CLI
     */
    private checkGHCLI;
    /**
     * الحصول على الـ branch الحالي
     */
    private getCurrentBranch;
    /**
     * الحصول على الـ base branch الافتراضي
     */
    private getDefaultBaseBranch;
    /**
     * استبدال المتغيرات في القالب
     */
    private replaceVariables;
    /**
     * إنشاء PR من قالب
     */
    createFromTemplate(templateName: string, variables: Record<string, string>, options?: PROptions): Promise<boolean>;
    /**
     * إنشاء PR بشكل تفاعلي
     */
    createInteractive(): Promise<boolean>;
    /**
     * إنشاء PR مباشرة
     */
    create(options: PROptions): Promise<boolean>;
    /**
     * عرض جميع PRs
     */
    listPRs(state?: 'open' | 'closed' | 'merged' | 'all'): Promise<void>;
    /**
     * عرض تفاصيل PR
     */
    viewPR(number: number): Promise<void>;
    /**
     * دمج PR
     */
    mergePR(number: number, method?: 'merge' | 'squash' | 'rebase'): Promise<boolean>;
    /**
     * إغلاق PR
     */
    closePR(number: number): Promise<boolean>;
    /**
     * إحصائيات PRs
     */
    getStats(): Promise<PRStats>;
    /**
     * عرض إحصائيات
     */
    displayStats(): Promise<void>;
    /**
     * عرض القوالب
     */
    listTemplates(): void;
    /**
     * تحميل قالب مخصص
     */
    private loadCustomTemplate;
    /**
     * حفظ قالب مخصص
     */
    saveTemplate(template: PRTemplate): Promise<boolean>;
}
export declare function createPRManager(workingDir?: string): PRManager;
//# sourceMappingURL=pr-manager.d.ts.map