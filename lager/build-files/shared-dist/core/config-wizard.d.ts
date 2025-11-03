/**
 * نوع المشروع
 */
export type ProjectType = 'nodejs' | 'typescript' | 'react' | 'vue' | 'angular' | 'nextjs' | 'express' | 'nestjs' | 'python' | 'go' | 'rust' | 'other';
/**
 * إعدادات المشروع
 */
export interface ProjectConfig {
    projectType: ProjectType;
    name: string;
    description: string;
    apiKey?: string;
    apiUrl?: string;
    gitEnabled: boolean;
    aiEnabled: boolean;
    caching: {
        enabled: boolean;
        ttl: number;
        maxSize: number;
    };
    performance: {
        parallel: boolean;
        concurrency: number;
        incremental: boolean;
    };
    features: {
        templates: boolean;
        hooks: boolean;
        review: boolean;
        docs: boolean;
        tests: boolean;
    };
    language: 'ar' | 'en';
}
/**
 * نتيجة المعالج
 */
export interface WizardResult {
    success: boolean;
    config: ProjectConfig;
    configPath: string;
    message: string;
}
/**
 * معالج الإعدادات التفاعلي
 */
export declare class ConfigWizard {
    private rl;
    private workingDir;
    constructor(workingDir: string);
    /**
     * بدء المعالج التفاعلي
     */
    start(language?: 'ar' | 'en'): Promise<WizardResult>;
    /**
     * جمع الإعدادات من المستخدم
     */
    private collectConfig;
    /**
     * سؤال عن نوع المشروع
     */
    private askProjectType;
    /**
     * طرح سؤال
     */
    private ask;
    /**
     * سؤال نعم/لا
     */
    private askYesNo;
    /**
     * حفظ الإعدادات
     */
    private saveConfig;
    /**
     * الحصول على إعدادات افتراضية
     */
    private getDefaultConfig;
    /**
     * إنشاء إعدادات سريعة
     */
    quickSetup(preset: 'minimal' | 'recommended' | 'full', language?: 'ar' | 'en'): Promise<WizardResult>;
    /**
     * تحديث إعدادات موجودة
     */
    updateConfig(updates: Partial<ProjectConfig>): Promise<WizardResult>;
    /**
     * قراءة الإعدادات الحالية
     */
    loadConfig(): Promise<ProjectConfig | null>;
    /**
     * عرض الإعدادات الحالية
     */
    showConfig(language?: 'ar' | 'en'): Promise<void>;
    /**
     * التحقق من صحة الإعدادات
     */
    validateConfig(): Promise<{
        valid: boolean;
        errors: string[];
        warnings: string[];
    }>;
    /**
     * تصدير الإعدادات
     */
    exportConfig(format: 'json' | 'yaml' | 'env'): Promise<string>;
    /**
     * تحويل إلى YAML
     */
    private convertToYAML;
    /**
     * تحويل إلى ENV
     */
    private convertToEnv;
    /**
     * استيراد الإعدادات
     */
    importConfig(source: string, format: 'json' | 'yaml' | 'env'): Promise<WizardResult>;
    /**
     * تحليل YAML
     */
    private parseYAML;
    /**
     * تحليل ENV
     */
    private parseEnv;
}
/**
 * إنشاء معالج إعدادات
 */
export declare function createConfigWizard(workingDir: string): ConfigWizard;
//# sourceMappingURL=config-wizard.d.ts.map