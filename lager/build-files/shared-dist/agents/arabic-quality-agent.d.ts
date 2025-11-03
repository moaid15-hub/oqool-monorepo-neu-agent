import { type AIProvider } from '../ai-gateway/index.js';
import type { CodeFile } from '../core/god-mode.js';
/**
 * Code Review Result - نتيجة المراجعة
 */
export interface ArabicCodeReview {
    overallScore: number;
    strengths: string[];
    weaknesses: string[];
    suggestions: ReviewSuggestion[];
    securityIssues: SecurityIssue[];
    performanceIssues: PerformanceIssue[];
    codeSmells: CodeSmell[];
    summary: string;
}
/**
 * Review Suggestion - اقتراح تحسين
 */
export interface ReviewSuggestion {
    type: 'تحسين' | 'إعادة هيكلة' | 'أداء' | 'أمان' | 'قراءة';
    severity: 'منخفض' | 'متوسط' | 'عالي' | 'حرج';
    location: string;
    issue: string;
    explanation: string;
    solution: string;
    codeExample?: string;
}
/**
 * Security Issue - مشكلة أمنية
 */
export interface SecurityIssue {
    severity: 'منخفض' | 'متوسط' | 'عالي' | 'حرج';
    type: string;
    description: string;
    location: string;
    fix: string;
}
/**
 * Performance Issue - مشكلة أداء
 */
export interface PerformanceIssue {
    type: string;
    impact: 'منخفض' | 'متوسط' | 'عالي';
    description: string;
    location: string;
    optimization: string;
}
/**
 * Code Smell - رائحة كود
 */
export interface CodeSmell {
    type: string;
    description: string;
    location: string;
    refactoring: string;
}
/**
 * Test Suite - مجموعة اختبارات
 */
export interface ArabicTestSuite {
    testFiles: CodeFile[];
    coverage: number;
    totalTests: number;
    description: string;
}
/**
 * Translation Result - نتيجة الترجمة
 */
export interface TranslationResult {
    originalFiles: CodeFile[];
    translatedFiles: CodeFile[];
    glossary: Map<string, string>;
    notes: string[];
}
/**
 * ArabicQualityAgent: Code Quality, Review, Testing & Translation
 *
 * @description متخصص في مراجعة الكود، الجودة، الاختبارات، والترجمة التقنية
 * @class
 * @module Agents
 *
 * @key_capabilities
 * - مراجعة الكود (Code Review)
 * - كشف الثغرات الأمنية (Security Analysis)
 * - تحليل الأداء (Performance Analysis)
 * - توليد الاختبارات (Test Generation)
 * - الترجمة التقنية (Technical Translation)
 * - تحليل الجودة (Quality Analysis)
 *
 * @complexity_level Expert
 * @ai_model claude-sonnet-4-20250514
 */
export declare class ArabicQualityAgent {
    private aiAdapter;
    private provider;
    constructor(config: {
        deepseek?: string;
        claude?: string;
        openai?: string;
    }, provider?: AIProvider);
    /**
     * مراجعة شاملة للكود مع اقتراحات التحسين بالعربية
     * @param {CodeFile} codeFile - ملف الكود
     * @param {string} context - سياق إضافي
     * @returns {Promise<ArabicCodeReview>}
     */
    reviewCode(codeFile: CodeFile, context?: string): Promise<ArabicCodeReview>;
    /**
     * تحليل شامل للثغرات الأمنية
     * @param {CodeFile} codeFile - ملف الكود
     * @returns {Promise<SecurityIssue[]>}
     */
    analyzeSecurityIssues(codeFile: CodeFile): Promise<SecurityIssue[]>;
    /**
     * تحليل الأداء واقتراح التحسينات
     * @param {CodeFile} codeFile - ملف الكود
     * @returns {Promise<PerformanceIssue[]>}
     */
    analyzePerformance(codeFile: CodeFile): Promise<PerformanceIssue[]>;
    /**
     * توليد اختبارات Unit Tests شاملة بالعربية
     * @param {CodeFile} codeFile - ملف الكود المراد اختباره
     * @param {string} testingFramework - إطار الاختبار (jest, mocha, pytest...)
     * @returns {Promise<ArabicTestSuite>}
     */
    generateTests(codeFile: CodeFile, testingFramework?: string): Promise<ArabicTestSuite>;
    /**
     * ترجمة كود كامل من/إلى العربية
     * @param {CodeFile[]} files - ملفات الكود
     * @param {string} direction - اتجاه الترجمة (ar-to-en أو en-to-ar)
     * @param {boolean} translateComments - ترجمة التعليقات
     * @param {boolean} translateVariables - ترجمة أسماء المتغيرات
     * @returns {Promise<TranslationResult>}
     */
    translateCode(files: CodeFile[], direction: 'ar-to-en' | 'en-to-ar', translateComments?: boolean, translateVariables?: boolean): Promise<TranslationResult>;
    /**
     * تحليل تعقيد الكود (Cyclomatic Complexity)
     * @param {CodeFile} codeFile - ملف الكود
     * @returns {Promise<{complexity: number, analysis: string, suggestions: string[]}>}
     */
    analyzeComplexity(codeFile: CodeFile): Promise<{
        complexity: number;
        analysis: string;
        suggestions: string[];
    }>;
    /**
     * اقتراحات تفصيلية لإعادة هيكلة الكود
     * @param {CodeFile} codeFile - ملف الكود
     * @returns {Promise<{original: string, refactored: string, explanation: string}[]>}
     */
    suggestRefactoring(codeFile: CodeFile): Promise<{
        original: string;
        refactored: string;
        explanation: string;
    }[]>;
    private callClaude;
    private parseCodeReview;
    private parseSecurityIssues;
    private parsePerformanceIssues;
    private parseTestSuite;
    private parseCodeFiles;
    private parseTranslation;
    private detectLanguage;
}
//# sourceMappingURL=arabic-quality-agent.d.ts.map