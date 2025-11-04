import { OqoolAPIClient } from './api-client.js';
export interface DocumentationConfig {
    enabled: boolean;
    outputDir: string;
    format: 'markdown' | 'html' | 'json' | 'all';
    includeCode: boolean;
    includeMetrics: boolean;
    includeDependencies: boolean;
    includeSetup: boolean;
    includeExamples: boolean;
    language: 'ar' | 'en' | 'both';
    template: string;
}
export interface ProjectInfo {
    name: string;
    version: string;
    description: string;
    author: string;
    license: string;
    repository: string;
    keywords: string[];
    scripts: Record<string, string>;
    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
}
export interface DocumentationSection {
    id: string;
    title: string;
    content: string;
    level: number;
    children: DocumentationSection[];
    metadata: {
        generated: boolean;
        source: string;
        confidence: number;
        lastUpdated: string;
    };
}
export interface GeneratedDocumentation {
    id: string;
    title: string;
    description: string;
    sections: DocumentationSection[];
    metadata: {
        generatedAt: string;
        generator: string;
        version: string;
        format: string;
        language: string;
    };
    files: string[];
    size: number;
    completeness: number;
}
export declare class DocumentationGenerator {
    private apiClient;
    private fileManager;
    private workingDir;
    private config;
    constructor(apiClient: OqoolAPIClient, workingDir?: string);
    /**
     * تحميل التكوين الافتراضي
     */
    private loadDefaultConfig;
    /**
     * تهيئة النظام
     */
    private initializeSystem;
    /**
     * توليد التوثيق الشامل للمشروع
     */
    generateProjectDocumentation(): Promise<GeneratedDocumentation>;
    /**
     * استخراج معلومات المشروع
     */
    private extractProjectInfo;
    /**
     * تحليل بنية المشروع
     */
    private analyzeProjectStructure;
    /**
     * تحليل قاعدة الكود
     */
    private analyzeCodebase;
    /**
     * توليد أقسام التوثيق
     */
    private generateDocumentationSections;
    /**
     * توليد قسم المقدمة
     */
    private generateIntroductionSection;
    /**
     * توليد قسم التثبيت
     */
    private generateInstallationSection;
    /**
     * توليد قسم الاستخدام
     */
    private generateUsageSection;
    /**
     * توليد قسم البنية
     */
    private generateStructureSection;
    /**
     * توليد قسم مرجع API
     */
    private generateAPIReferenceSection;
    /**
     * توليد قسم التبعيات
     */
    private generateDependenciesSection;
    /**
     * توليد قسم المقاييس
     */
    private generateMetricsSection;
    /**
     * توليد قسم المساهمة
     */
    private generateContributingSection;
    /**
     * توليد ملفات التوثيق
     */
    private generateDocumentationFiles;
    /**
     * توليد محتوى README
     */
    private generateReadmeContent;
    /**
     * توليد محتوى قسم منفصل
     */
    private generateSectionContent;
    /**
     * توليد فهرس التوثيق
     */
    private generateIndexContent;
    /**
     * حفظ فهرس التوثيق
     */
    private saveDocumentationIndex;
    /**
     * حساب الاكتمال
     */
    private calculateCompleteness;
    /**
     * توليد شجرة الملفات كنص
     */
    private generateTreeText;
    /**
     * عد الملفات
     */
    private countFiles;
    /**
     * عد المجلدات
     */
    private countDirectories;
    /**
     * كشف اللغات الرئيسية
     */
    private detectMainLanguages;
    /**
     * تقييم التعقيد
     */
    private assessComplexity;
    /**
     * كشف اللغة من المسار
     */
    private getLanguageFromPath;
    /**
     * كشف اللغة من الامتداد
     */
    private getLanguageFromExtension;
    /**
     * تنسيق الحجم
     */
    private formatBytes;
    /**
     * كشف اللغة الرئيسية
     */
    private detectPrimaryLanguage;
    /**
     * حساب تعقيد الكود
     */
    private calculateCodeComplexity;
    /**
     * تقييم جودة الكود
     */
    private assessCodeQuality;
    /**
     * توليد معرف فريد
     */
    private generateId;
    /**
     * تحديث التكوين
     */
    updateConfig(newConfig: Partial<DocumentationConfig>): Promise<void>;
}
export declare function createDocumentationGenerator(apiClient: OqoolAPIClient, workingDir?: string): DocumentationGenerator;
//# sourceMappingURL=documentation-generator.d.ts.map