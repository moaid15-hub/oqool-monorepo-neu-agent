// arabic-quality-agent.ts
// ============================================
// 🔍 Arabic Code Quality Agent - وكيل جودة الكود العربي
// ============================================
import { UnifiedAIAdapter } from '../ai-gateway/index.js';
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
export class ArabicQualityAgent {
    aiAdapter;
    provider;
    constructor(config, provider = 'auto') {
        const hasValidClaude = config.claude?.startsWith('sk-ant-');
        this.aiAdapter = new UnifiedAIAdapter({
            deepseek: config.deepseek,
            claude: config.claude,
            openai: config.openai,
            defaultProvider: hasValidClaude ? 'claude' : 'deepseek',
        });
        this.provider = provider;
    }
    // ============================================
    // 🔍 مراجعة الكود بالعربية
    // Arabic Code Review
    // ============================================
    /**
     * مراجعة شاملة للكود مع اقتراحات التحسين بالعربية
     * @param {CodeFile} codeFile - ملف الكود
     * @param {string} context - سياق إضافي
     * @returns {Promise<ArabicCodeReview>}
     */
    async reviewCode(codeFile, context) {
        const prompt = `
أنت خبير مراجعة كود محترف متخصص في تقديم مراجعات شاملة باللغة العربية.

الملف: ${codeFile.path}
اللغة: ${codeFile.language}
${context ? `السياق: ${context}` : ''}

الكود:
${codeFile.content}

قم بمراجعة شاملة للكود واستخرج:

1. **التقييم العام** (من 100)

2. **نقاط القوة** (3-5 نقاط):
   - ما الذي تم عمله بشكل جيد؟

3. **نقاط الضعف** (3-5 نقاط):
   - ما الذي يحتاج تحسين؟

4. **اقتراحات التحسين** (مع التفاصيل):
   - النوع (تحسين، إعادة هيكلة، أداء، أمان، قراءة)
   - الأولوية (منخفض، متوسط، عالي، حرج)
   - الموقع في الكود
   - المشكلة
   - الشرح التفصيلي
   - الحل المقترح
   - مثال على الكود المحسن

5. **المشاكل الأمنية** (إن وجدت):
   - الخطورة
   - النوع
   - الوصف
   - الموقع
   - كيفية الإصلاح

6. **مشاكل الأداء** (إن وجدت):
   - النوع
   - التأثير
   - الوصف
   - الموقع
   - التحسين المقترح

7. **روائح الكود** (Code Smells):
   - النوع
   - الوصف
   - الموقع
   - إعادة الهيكلة المقترحة

8. **ملخص عام**

أرجع الناتج بصيغة JSON منظمة.
استخدم لغة عربية واضحة ومهنية.
`;
        try {
            const response = await this.callClaude(prompt);
            return this.parseCodeReview(response);
        }
        catch (error) {
            console.error('فشل مراجعة الكود:', error);
            throw error;
        }
    }
    // ============================================
    // 🛡️ تحليل الأمان
    // Security Analysis
    // ============================================
    /**
     * تحليل شامل للثغرات الأمنية
     * @param {CodeFile} codeFile - ملف الكود
     * @returns {Promise<SecurityIssue[]>}
     */
    async analyzeSecurityIssues(codeFile) {
        const prompt = `
أنت خبير أمن سيبراني متخصص في تحليل الثغرات الأمنية.

الملف: ${codeFile.path}
اللغة: ${codeFile.language}

الكود:
${codeFile.content}

ابحث عن الثغرات الأمنية الشائعة:

1. **SQL Injection** - حقن SQL
2. **XSS** - البرمجة النصية عبر المواقع
3. **CSRF** - تزوير الطلبات
4. **Authentication Issues** - مشاكل المصادقة
5. **Sensitive Data Exposure** - تسريب البيانات الحساسة
6. **Insecure Dependencies** - تبعيات غير آمنة
7. **Broken Access Control** - التحكم في الوصول المكسور
8. **Security Misconfiguration** - خطأ في الإعدادات الأمنية

لكل ثغرة:
- الخطورة (منخفض، متوسط، عالي، حرج)
- النوع
- الوصف التفصيلي بالعربية
- الموقع في الكود
- كيفية الإصلاح مع مثال

أرجع الناتج بصيغة JSON:
[
  {
    "severity": "...",
    "type": "...",
    "description": "...",
    "location": "...",
    "fix": "..."
  }
]
`;
        try {
            const response = await this.callClaude(prompt);
            return this.parseSecurityIssues(response);
        }
        catch (error) {
            console.error('فشل تحليل الأمان:', error);
            throw error;
        }
    }
    // ============================================
    // ⚡ تحليل الأداء
    // Performance Analysis
    // ============================================
    /**
     * تحليل الأداء واقتراح التحسينات
     * @param {CodeFile} codeFile - ملف الكود
     * @returns {Promise<PerformanceIssue[]>}
     */
    async analyzePerformance(codeFile) {
        const prompt = `
أنت خبير في تحسين الأداء وتحليل الكود.

الملف: ${codeFile.path}
اللغة: ${codeFile.language}

الكود:
${codeFile.content}

حلل الكود من ناحية الأداء:

1. **التعقيد الزمني** (Time Complexity)
2. **التعقيد المكاني** (Space Complexity)
3. **الحلقات غير الفعالة** (Inefficient Loops)
4. **العمليات المكررة** (Redundant Operations)
5. **استخدام الذاكرة** (Memory Usage)
6. **قاعدة البيانات** (Database Queries)
7. **الشبكة** (Network Calls)

لكل مشكلة:
- النوع
- التأثير (منخفض، متوسط، عالي)
- الوصف بالعربية
- الموقع
- التحسين المقترح مع مثال

أرجع الناتج بصيغة JSON.
`;
        try {
            const response = await this.callClaude(prompt);
            return this.parsePerformanceIssues(response);
        }
        catch (error) {
            console.error('فشل تحليل الأداء:', error);
            throw error;
        }
    }
    // ============================================
    // 🧪 توليد اختبارات شاملة
    // Generate Comprehensive Tests
    // ============================================
    /**
     * توليد اختبارات Unit Tests شاملة بالعربية
     * @param {CodeFile} codeFile - ملف الكود المراد اختباره
     * @param {string} testingFramework - إطار الاختبار (jest, mocha, pytest...)
     * @returns {Promise<ArabicTestSuite>}
     */
    async generateTests(codeFile, testingFramework = 'jest') {
        const prompt = `
أنت خبير في كتابة الاختبارات الشاملة.

الملف: ${codeFile.path}
اللغة: ${codeFile.language}
إطار الاختبار: ${testingFramework}

الكود المراد اختباره:
${codeFile.content}

أنشئ مجموعة اختبارات شاملة تغطي:

1. **الحالات العادية** (Happy Path)
2. **الحالات الحدية** (Edge Cases)
3. **حالات الخطأ** (Error Cases)
4. **اختبارات التكامل** (Integration Tests) إن أمكن
5. **اختبارات الأداء** (Performance Tests) إن لزم

لكل اختبار:
- اسم واضح بالإنجليزية
- وصف بالعربية
- الكود

استخدم تعليقات عربية لشرح كل اختبار.

قدم الناتج بالتنسيق:
\`\`\`filename:${codeFile.path.replace(/\.(js|ts|py)$/, '.test.$1')}
// الاختبارات هنا
\`\`\`

أضف أيضاً:
- نسبة التغطية المتوقعة
- عدد الاختبارات
- وصف عام
`;
        try {
            const response = await this.callClaude(prompt);
            return this.parseTestSuite(response);
        }
        catch (error) {
            console.error('فشل توليد الاختبارات:', error);
            throw error;
        }
    }
    // ============================================
    // 🌐 الترجمة التقنية
    // Technical Translation
    // ============================================
    /**
     * ترجمة كود كامل من/إلى العربية
     * @param {CodeFile[]} files - ملفات الكود
     * @param {string} direction - اتجاه الترجمة (ar-to-en أو en-to-ar)
     * @param {boolean} translateComments - ترجمة التعليقات
     * @param {boolean} translateVariables - ترجمة أسماء المتغيرات
     * @returns {Promise<TranslationResult>}
     */
    async translateCode(files, direction, translateComments = true, translateVariables = false) {
        const prompt = `
أنت مترجم تقني محترف متخصص في ترجمة الكود والوثائق.

اتجاه الترجمة: ${direction === 'ar-to-en' ? 'من العربية للإنجليزية' : 'من الإنجليزية للعربية'}
ترجمة التعليقات: ${translateComments ? 'نعم' : 'لا'}
ترجمة أسماء المتغيرات: ${translateVariables ? 'نعم' : 'لا'}

الملفات:
${files.map(f => `\n=== ${f.path} ===\n${f.content}`).join('\n')}

المطلوب:
1. ترجمة ${translateComments ? 'التعليقات' : ''} ${translateVariables ? 'وأسماء المتغيرات' : ''}
2. الحفاظ على بنية الكود
3. استخدام مصطلحات برمجية دقيقة
4. إنشاء قاموس المصطلحات المستخدمة

لكل ملف، قدم:
\`\`\`filename:[اسم-الملف-المترجم]
// الكود المترجم
\`\`\`

قدم أيضاً:
- قاموس المصطلحات (عربي <-> إنجليزي)
- ملاحظات الترجمة
`;
        try {
            const response = await this.callClaude(prompt);
            return this.parseTranslation(response, files);
        }
        catch (error) {
            console.error('فشل ترجمة الكود:', error);
            throw error;
        }
    }
    // ============================================
    // 📐 تحليل تعقيد الكود
    // Code Complexity Analysis
    // ============================================
    /**
     * تحليل تعقيد الكود (Cyclomatic Complexity)
     * @param {CodeFile} codeFile - ملف الكود
     * @returns {Promise<{complexity: number, analysis: string, suggestions: string[]}>}
     */
    async analyzeComplexity(codeFile) {
        const prompt = `
حلل تعقيد هذا الكود:

الملف: ${codeFile.path}
${codeFile.content}

قدم:
1. **التعقيد الدوري** (Cyclomatic Complexity) - رقم من 1-100
2. **تحليل مفصل** بالعربية:
   - ما مدى تعقيد الكود؟
   - ما هي الأجزاء الأكثر تعقيداً؟
   - هل الكود قابل للصيانة؟

3. **اقتراحات التبسيط** (3-5 اقتراحات):
   - كيف يمكن تبسيط الكود؟
   - إعادة هيكلة مقترحة

أرجع الناتج بصيغة JSON:
{
  "complexity": 25,
  "analysis": "...",
  "suggestions": ["...", "..."]
}
`;
        try {
            const response = await this.callClaude(prompt);
            const parsed = JSON.parse(response);
            return parsed;
        }
        catch (error) {
            console.error('فشل تحليل التعقيد:', error);
            return {
                complexity: 0,
                analysis: 'فشل التحليل',
                suggestions: []
            };
        }
    }
    // ============================================
    // 🎨 اقتراحات إعادة الهيكلة
    // Refactoring Suggestions
    // ============================================
    /**
     * اقتراحات تفصيلية لإعادة هيكلة الكود
     * @param {CodeFile} codeFile - ملف الكود
     * @returns {Promise<{original: string, refactored: string, explanation: string}[]>}
     */
    async suggestRefactoring(codeFile) {
        const prompt = `
اقترح إعادة هيكلة لهذا الكود:

${codeFile.content}

لكل اقتراح، قدم:
1. **الكود الأصلي** (الجزء المراد تحسينه)
2. **الكود المُعاد هيكلته**
3. **الشرح بالعربية**: لماذا هذا التحسين أفضل؟

ركز على:
- تبسيط الكود المعقد
- إزالة التكرار (DRY)
- تحسين القراءة
- تطبيق Design Patterns
- فصل المسؤوليات (SRP)

أرجع الناتج بصيغة JSON:
[
  {
    "original": "...",
    "refactored": "...",
    "explanation": "..."
  }
]
`;
        try {
            const response = await this.callClaude(prompt);
            const jsonMatch = response.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            return [];
        }
        catch (error) {
            console.error('فشل اقتراح إعادة الهيكلة:', error);
            return [];
        }
    }
    // ============================================
    // Private Helper Methods
    // ============================================
    async callClaude(prompt) {
        const result = await this.aiAdapter.processWithPersonality('coder', prompt, undefined, this.provider);
        return result.response;
    }
    parseCodeReview(text) {
        try {
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                return {
                    overallScore: parsed.overallScore || 0,
                    strengths: parsed.strengths || [],
                    weaknesses: parsed.weaknesses || [],
                    suggestions: parsed.suggestions || [],
                    securityIssues: parsed.securityIssues || [],
                    performanceIssues: parsed.performanceIssues || [],
                    codeSmells: parsed.codeSmells || [],
                    summary: parsed.summary || text
                };
            }
        }
        catch (error) {
            console.error('فشل تحليل المراجعة:', error);
        }
        return {
            overallScore: 0,
            strengths: [],
            weaknesses: [],
            suggestions: [],
            securityIssues: [],
            performanceIssues: [],
            codeSmells: [],
            summary: text
        };
    }
    parseSecurityIssues(text) {
        try {
            const jsonMatch = text.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
        }
        catch (error) {
            console.error('فشل تحليل المشاكل الأمنية:', error);
        }
        return [];
    }
    parsePerformanceIssues(text) {
        try {
            const jsonMatch = text.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
        }
        catch (error) {
            console.error('فشل تحليل مشاكل الأداء:', error);
        }
        return [];
    }
    parseTestSuite(text) {
        const files = this.parseCodeFiles(text);
        // استخراج معلومات إضافية من النص
        const coverageMatch = text.match(/coverage.*?(\d+)%/i);
        const testsMatch = text.match(/(\d+)\s*(tests|اختبار)/i);
        return {
            testFiles: files,
            coverage: coverageMatch ? parseInt(coverageMatch[1]) : 80,
            totalTests: testsMatch ? parseInt(testsMatch[1]) : files.length * 5,
            description: 'مجموعة اختبارات شاملة'
        };
    }
    parseCodeFiles(text) {
        const files = [];
        const pattern = /```(?:filename:)?([^\n]+)\n([\s\S]*?)```/g;
        let match;
        while ((match = pattern.exec(text)) !== null) {
            const filePath = match[1].trim();
            const content = match[2].trim();
            if (filePath && content) {
                files.push({
                    path: filePath,
                    content: content,
                    language: this.detectLanguage(filePath),
                    lines: content.split('\n').length
                });
            }
        }
        return files;
    }
    parseTranslation(text, originalFiles) {
        const translatedFiles = this.parseCodeFiles(text);
        const glossary = new Map();
        const notes = [];
        // محاولة استخراج القاموس
        const glossaryMatch = text.match(/قاموس المصطلحات:?\s*([\s\S]*?)(?=\n\n|$)/i);
        if (glossaryMatch) {
            const glossaryLines = glossaryMatch[1].split('\n');
            for (const line of glossaryLines) {
                const parts = line.split(/[:-]/);
                if (parts.length === 2) {
                    glossary.set(parts[0].trim(), parts[1].trim());
                }
            }
        }
        return {
            originalFiles,
            translatedFiles,
            glossary,
            notes
        };
    }
    detectLanguage(filePath) {
        const ext = filePath.split('.').pop()?.toLowerCase();
        const langMap = {
            'js': 'javascript',
            'ts': 'typescript',
            'py': 'python',
            'test.js': 'javascript',
            'test.ts': 'typescript',
            'spec.js': 'javascript',
            'spec.ts': 'typescript'
        };
        return langMap[ext || ''] || 'text';
    }
}
//# sourceMappingURL=arabic-quality-agent.js.map