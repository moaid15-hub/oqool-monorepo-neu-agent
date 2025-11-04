/**
 * إطار عمل الاختبارات المدعوم
 */
export type TestFramework = 'jest' | 'mocha' | 'vitest' | 'ava';
/**
 * نوع الاختبار
 */
export type TestType = 'unit' | 'integration' | 'e2e';
/**
 * خيارات توليد الاختبارات
 */
export interface TestOptions {
    /** إطار العمل */
    framework?: TestFramework;
    /** نوع الاختبار */
    type?: TestType;
    /** استخدام AI لتوليد حالات اختبار ذكية */
    useAI?: boolean;
    /** توليد mocks */
    generateMocks?: boolean;
    /** تغطية الـ edge cases */
    includeEdgeCases?: boolean;
    /** المجلد الناتج */
    outputDir?: string;
    /** اللغة */
    language?: 'ar' | 'en';
}
/**
 * معلومات حالة اختبار
 */
export interface TestCase {
    name: string;
    description: string;
    input: any;
    expected: any;
    type: 'normal' | 'edge' | 'error';
}
/**
 * معلومات اختبار دالة
 */
export interface FunctionTest {
    functionName: string;
    testCases: TestCase[];
    mocks?: MockDefinition[];
    setup?: string;
    teardown?: string;
}
/**
 * تعريف Mock
 */
export interface MockDefinition {
    name: string;
    type: string;
    implementation: string;
}
/**
 * معلومات اختبار كلاس
 */
export interface ClassTest {
    className: string;
    methods: FunctionTest[];
    beforeEach?: string;
    afterEach?: string;
}
/**
 * نتيجة توليد الاختبارات
 */
export interface TestGenerationResult {
    success: boolean;
    testsGenerated: number;
    files: string[];
    coverage: {
        functions: number;
        classes: number;
        lines: number;
    };
    errors?: string[];
}
/**
 * مولد الاختبارات التلقائي
 */
export declare class TestGenerator {
    private apiClient?;
    private analyzer;
    private workingDir;
    constructor(workingDir: string);
    /**
     * توليد اختبارات للملفات
     */
    generateTests(files: string[], options?: TestOptions): Promise<TestGenerationResult>;
    /**
     * توليد ملف اختبار لملف واحد
     */
    private generateTestFile;
    /**
     * توليد header ملف الاختبار
     */
    private generateTestHeader;
    /**
     * الحصول على مسار ملف الاختبار
     */
    private getTestFilePath;
    /**
     * توليد اختبار دالة
     */
    private generateFunctionTest;
    /**
     * توليد حالات اختبار
     */
    private generateTestCases;
    /**
     * توليد حالة عادية
     */
    private generateNormalCase;
    /**
     * توليد edge cases
     */
    private generateEdgeCases;
    /**
     * توليد حالات الأخطاء
     */
    private generateErrorCases;
    /**
     * توليد مدخلات عينة
     */
    private generateSampleInputs;
    /**
     * توليد قيمة عينة بناءً على النوع
     */
    private generateSampleValue;
    /**
     * توليد الناتج المتوقع
     */
    private generateExpectedOutput;
    /**
     * توليد mocks
     */
    private generateMocks;
    /**
     * التحقق من نوع بدائي
     */
    private isPrimitiveType;
    /**
     * Capitalize أول حرف
     */
    private capitalize;
    /**
     * توليد كود الاختبار
     */
    private generateTestCode;
    /**
     * توليد كود حالة اختبار واحدة
     */
    private generateTestCaseCode;
    /**
     * توليد اختبار كلاس
     */
    private generateClassTest;
    /**
     * توليد كود اختبار الكلاس
     */
    private generateClassTestCode;
    /**
     * توليد حالة اختبار ميثود
     */
    private generateMethodTestCase;
    /**
     * حساب تغطية الاختبارات
     */
    private calculateCoverage;
    /**
     * توليد package.json للاختبارات
     */
    generateTestConfig(framework: TestFramework, outputDir: string): Promise<string>;
    /**
     * تشغيل الاختبارات
     */
    runTests(framework?: TestFramework): Promise<{
        success: boolean;
        output: string;
    }>;
}
/**
 * إنشاء مولد اختبارات
 */
export declare function createTestGenerator(workingDir: string): TestGenerator;
//# sourceMappingURL=test-generator.d.ts.map