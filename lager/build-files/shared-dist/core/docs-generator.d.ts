/**
 * أنواع التوثيق المدعومة
 */
export type DocFormat = 'jsdoc' | 'markdown' | 'html' | 'json';
/**
 * خيارات توليد التوثيق
 */
export interface DocsOptions {
    /** تنسيق التوثيق */
    format?: DocFormat;
    /** استخدام AI لتحسين التوثيق */
    useAI?: boolean;
    /** تضمين أمثلة الكود */
    includeExamples?: boolean;
    /** مستوى التفصيل (basic, detailed, comprehensive) */
    level?: 'basic' | 'detailed' | 'comprehensive';
    /** المجلد الناتج */
    outputDir?: string;
    /** اللغة (ar, en) */
    language?: 'ar' | 'en';
}
/**
 * معلومات توثيق دالة
 */
export interface FunctionDoc {
    name: string;
    description: string;
    params: ParamDoc[];
    returns: ReturnDoc;
    examples: string[];
    throws?: string[];
    complexity?: string;
    performance?: string;
}
/**
 * معلومات معامل
 */
export interface ParamDoc {
    name: string;
    type: string;
    description: string;
    optional?: boolean;
    defaultValue?: string;
}
/**
 * معلومات القيمة المرجعة
 */
export interface ReturnDoc {
    type: string;
    description: string;
}
/**
 * معلومات توثيق كلاس
 */
export interface ClassDoc {
    name: string;
    description: string;
    extends?: string;
    implements?: string[];
    properties: PropertyDoc[];
    methods: FunctionDoc[];
    examples: string[];
    usage?: string;
}
/**
 * معلومات خاصية
 */
export interface PropertyDoc {
    name: string;
    type: string;
    description: string;
    access: 'public' | 'private' | 'protected';
    readonly?: boolean;
}
/**
 * معلومات توثيق ملف
 */
export interface FileDoc {
    path: string;
    description: string;
    functions: FunctionDoc[];
    classes: ClassDoc[];
    exports: string[];
    imports: string[];
    overview?: string;
}
/**
 * نتيجة توليد التوثيق
 */
export interface DocsResult {
    success: boolean;
    files: FileDoc[];
    outputPath?: string;
    stats: {
        filesProcessed: number;
        functionsDocumented: number;
        classesDocumented: number;
        linesGenerated: number;
    };
    errors?: string[];
}
/**
 * مولد التوثيق التلقائي
 */
export declare class DocsGenerator {
    private apiClient?;
    private analyzer;
    private fileManager;
    private workingDir;
    constructor(workingDir: string);
    /**
     * توليد توثيق للملفات
     */
    generateDocs(files: string[], options?: DocsOptions): Promise<DocsResult>;
    /**
     * توليد توثيق لملف واحد
     */
    private generateFileDoc;
    /**
     * توليد وصف الملف
     */
    private generateFileDescription;
    /**
     * توليد وصف ثابت للملف
     */
    private generateStaticFileDescription;
    /**
     * استخراج تعليق الملف الموجود
     */
    private extractFileComment;
    /**
     * توليد نظرة عامة شاملة
     */
    private generateOverview;
    /**
     * استخراج الـ exports
     */
    private extractExports;
    /**
     * استخراج الـ imports
     */
    private extractImports;
    /**
     * توليد توثيق دالة
     */
    private generateFunctionDoc;
    /**
     * توليد وصف دالة
     */
    private generateFunctionDescription;
    /**
     * استنتاج الغرض من اسم الدالة
     */
    private inferPurpose;
    /**
     * استخراج JSDoc موجود
     */
    private extractJSDoc;
    /**
     * توليد معلومات المعاملات
     */
    private generateParams;
    /**
     * توليد معلومات القيمة المرجعة
     */
    private generateReturns;
    /**
     * توليد أمثلة
     */
    private generateExamples;
    /**
     * تقدير التعقيد
     */
    private estimateComplexity;
    /**
     * تقدير الأداء
     */
    private estimatePerformance;
    /**
     * توليد توثيق كلاس
     */
    private generateClassDoc;
    /**
     * توليد وصف كلاس
     */
    private generateClassDescription;
    /**
     * استنتاج غرض الكلاس
     */
    private inferClassPurpose;
    /**
     * توليد معلومات الخصائص
     */
    private generateProperties;
    /**
     * توليد أمثلة للكلاس
     */
    private generateClassExamples;
    /**
     * توليد مثال استخدام
     */
    private generateUsageExample;
    /**
     * توليد توثيق Markdown
     */
    private generateMarkdownDocs;
    /**
     * توليد Markdown لملف واحد
     */
    private generateFileMarkdown;
    /**
     * توليد Markdown لدالة
     */
    private generateFunctionMarkdown;
    /**
     * توليد Markdown لكلاس
     */
    private generateClassMarkdown;
    /**
     * توليد توثيق HTML
     */
    private generateHTMLDocs;
    /**
     * توليد HTML لملف
     */
    private generateFileHTML;
    /**
     * توليد توثيق JSON
     */
    private generateJSONDocs;
    /**
     * حساب عدد الأسطر
     */
    private countLines;
    /**
     * إضافة JSDoc للملفات
     */
    addJSDocComments(files: string[], options?: Pick<DocsOptions, 'useAI' | 'language'>): Promise<{
        success: boolean;
        filesModified: number;
        errors?: string[];
    }>;
    /**
     * توليد تعليق JSDoc
     */
    private generateJSDocComment;
    /**
     * توليد JSDoc للكلاس
     */
    private generateClassJSDoc;
    /**
     * إدراج JSDoc في الكود
     */
    private insertJSDoc;
}
/**
 * إنشاء مولد توثيق
 */
export declare function createDocsGenerator(workingDir: string): DocsGenerator;
//# sourceMappingURL=docs-generator.d.ts.map