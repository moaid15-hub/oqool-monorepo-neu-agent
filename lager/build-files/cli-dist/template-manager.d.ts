export interface TemplateFile {
    path: string;
    content: string;
    description?: string;
}
export interface TemplateVariable {
    name: string;
    description: string;
    defaultValue?: string;
    required?: boolean;
}
export interface Template {
    name: string;
    description: string;
    language: string;
    category: 'backend' | 'frontend' | 'fullstack' | 'library' | 'cli' | 'other';
    files: TemplateFile[];
    variables: TemplateVariable[];
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    scripts?: Record<string, string>;
    author?: string;
    license?: string;
    tags?: string[];
}
export interface CreateOptions {
    projectName: string;
    outputDir?: string;
    variables?: Record<string, string>;
    initGit?: boolean;
    installDeps?: boolean;
}
export declare class TemplateManager {
    private workingDir;
    private templatesPath;
    private fileManager;
    private builtInTemplates;
    constructor(workingDir?: string);
    /**
     * تحميل القوالب المدمجة
     */
    private loadBuiltInTemplates;
    /**
     * استبدال المتغيرات في النص
     */
    private replaceVariables;
    /**
     * إنشاء مشروع من قالب
     */
    createFromTemplate(templateName: string, options: CreateOptions): Promise<boolean>;
    /**
     * تحميل قالب مخصص
     */
    private loadCustomTemplate;
    /**
     * حفظ قالب مخصص
     */
    saveAsTemplate(name: string, template: Template): Promise<boolean>;
    /**
     * قراءة جميع الملفات في مجلد بشكل متكرر
     */
    private getAllFiles;
    /**
     * إنشاء قالب من مشروع موجود
     */
    createTemplateFromProject(projectPath: string, name: string, description: string, options?: {
        language?: string;
        category?: Template['category'];
        variables?: TemplateVariable[];
    }): Promise<boolean>;
    /**
     * عرض جميع القوالب
     */
    listTemplates(): Promise<void>;
    /**
     * عرض تفاصيل قالب
     */
    showTemplateDetails(templateName: string): Promise<void>;
    /**
     * حذف قالب مخصص
     */
    deleteTemplate(name: string): Promise<boolean>;
    /**
     * البحث في القوالب
     */
    searchTemplates(query: string): Promise<Template[]>;
    /**
     * عرض نتائج البحث
     */
    displaySearchResults(results: Template[], query: string): void;
}
export declare function createTemplateManager(workingDir?: string): TemplateManager;
//# sourceMappingURL=template-manager.d.ts.map