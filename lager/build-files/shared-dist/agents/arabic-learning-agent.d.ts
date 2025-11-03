import { type AIProvider } from '../ai-gateway/index.js';
import type { CodeFile } from '../core/god-mode.js';
/**
 * Lesson Structure - بنية الدرس
 */
export interface ArabicLesson {
    title: string;
    titleArabic: string;
    level: 'مبتدئ' | 'متوسط' | 'متقدم';
    objectives: string[];
    content: string;
    examples: CodeFile[];
    exercises: ArabicExercise[];
    summary: string;
}
/**
 * Exercise Structure - بنية التمرين
 */
export interface ArabicExercise {
    question: string;
    hints: string[];
    solution: string;
    difficulty: 'سهل' | 'متوسط' | 'صعب';
}
/**
 * Documentation Structure - بنية الوثائق
 */
export interface ArabicDocumentation {
    title: string;
    description: string;
    sections: {
        title: string;
        content: string;
        codeExamples?: CodeFile[];
    }[];
    apiReference?: {
        name: string;
        description: string;
        parameters: {
            name: string;
            type: string;
            description: string;
        }[];
        returns: string;
        examples: string[];
    }[];
}
/**
 * ArabicLearningAgent: Specialized in Arabic Technical Education
 *
 * @description متخصص في التعليم التقني والوثائق والأمثلة العملية باللغة العربية
 * @class
 * @module Agents
 *
 * @key_capabilities
 * - شرح المفاهيم التعليمية (Teaching Concepts)
 * - توليد الدروس التفاعلية (Interactive Lessons)
 * - إنشاء الوثائق التقنية (Technical Documentation)
 * - توليد الأمثلة العملية (Practical Examples)
 * - المحادثة التقنية (Technical Chat)
 * - متابعة التقدم (Progress Tracking)
 *
 * @complexity_level Expert
 * @ai_model claude-sonnet-4-20250514
 */
export declare class ArabicLearningAgent {
    private aiAdapter;
    private provider;
    constructor(config: {
        deepseek?: string;
        claude?: string;
        openai?: string;
    }, provider?: AIProvider);
    /**
     * توليد درس تعليمي شامل عن مفهوم برمجي
     * @param {string} concept - المفهوم البرمجي
     * @param {string} level - المستوى (مبتدئ، متوسط، متقدم)
     * @param {string} language - لغة البرمجة
     * @returns {Promise<ArabicLesson>}
     */
    generateLesson(concept: string, level: 'مبتدئ' | 'متوسط' | 'متقدم', language?: string): Promise<ArabicLesson>;
    /**
     * شرح مفهوم برمجي بأسلوب تعليمي مبسط
     * @param {string} concept - المفهوم
     * @param {string} context - السياق الإضافي
     * @returns {Promise<string>}
     */
    explainConcept(concept: string, context?: string): Promise<string>;
    /**
     * توليد وثائق تقنية شاملة لمشروع أو مكتبة
     * @param {string} projectName - اسم المشروع
     * @param {CodeFile[]} codeFiles - ملفات الكود
     * @param {string} description - وصف المشروع
     * @returns {Promise<ArabicDocumentation>}
     */
    generateDocumentation(projectName: string, codeFiles: CodeFile[], description: string): Promise<ArabicDocumentation>;
    /**
     * توليد أمثلة عملية من البيئة العربية
     * @param {string} concept - المفهوم
     * @param {string} domain - المجال (تجارة إلكترونية، تعليم، صحة...)
     * @param {string} language - لغة البرمجة
     * @returns {Promise<CodeFile[]>}
     */
    generateArabicContextExamples(concept: string, domain: string, language?: string): Promise<CodeFile[]>;
    /**
     * محادثة تقنية تفاعلية للإجابة على الأسئلة
     * @param {string} question - السؤال
     * @param {string[]} conversationHistory - سجل المحادثة
     * @returns {Promise<string>}
     */
    chat(question: string, conversationHistory?: string[]): Promise<string>;
    /**
     * توليد تمارين عملية لمفهوم معين
     * @param {string} concept - المفهوم
     * @param {number} count - عدد التمارين
     * @param {string} difficulty - مستوى الصعوبة
     * @returns {Promise<ArabicExercise[]>}
     */
    generateExercises(concept: string, count?: number, difficulty?: 'سهل' | 'متوسط' | 'صعب'): Promise<ArabicExercise[]>;
    /**
     * توليد ملف README شامل بالعربية
     * @param {string} projectName - اسم المشروع
     * @param {string} description - وصف المشروع
     * @param {string[]} features - الميزات
     * @param {string} techStack - التقنيات المستخدمة
     * @returns {Promise<string>}
     */
    generateReadme(projectName: string, description: string, features: string[], techStack: string): Promise<string>;
    private callClaude;
    private parseLesson;
    private parseDocumentation;
    private parseCodeFiles;
    private parseExercises;
    private detectLanguage;
    private getExtension;
}
//# sourceMappingURL=arabic-learning-agent.d.ts.map