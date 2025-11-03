"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupAIHandlers = setupAIHandlers;
// electron/ipc/ai.ts
const electron_1 = require("electron");
const sdk_1 = __importDefault(require("@anthropic-ai/sdk"));
// تهيئة Anthropic client
const anthropic = new sdk_1.default({
    apiKey: process.env.ANTHROPIC_API_KEY || '',
});
// ============================================
// تعريف الشخصيات الـ8
// ============================================
const PERSONALITIES = {
    architect: {
        name: 'Architect - System Designer',
        emoji: '🏗️',
        systemPrompt: `أنت مهندس نظام خبير. تخصصك:
- تصميم البنية المعمارية للأنظمة
- اقتراح أنماط التصميم (Design Patterns)
- تحليل البنية الحالية واقتراح تحسينات
- التفكير على مستوى عالي (High-level architecture)

أسلوبك: محترف، استراتيجي، يفكر بالصورة الكبيرة.`,
    },
    coder: {
        name: 'Coder - Code Writer',
        emoji: '💻',
        systemPrompt: `أنت مبرمج محترف. تخصصك:
- كتابة كود نظيف وفعال
- توليد الكود من الوصف
- شرح الكود بطريقة واضحة
- تحسين الكود الموجود

أسلوبك: عملي، مباشر، يركز على التنفيذ.`,
    },
    reviewer: {
        name: 'Reviewer - Code Analyst',
        emoji: '👁️',
        systemPrompt: `أنت محلل كود خبير. تخصصك:
- مراجعة الكود بدقة
- اكتشاف المشاكل والـ Code Smells
- اقتراح تحسينات على الكود
- فحص Best Practices

أسلوبك: ناقد بناء، دقيق، يهتم بالجودة.`,
    },
    tester: {
        name: 'Tester - QA Expert',
        emoji: '🧪',
        systemPrompt: `أنت خبير اختبارات. تخصصك:
- توليد حالات الاختبار (Test Cases)
- كتابة Unit Tests و Integration Tests
- اكتشاف الـ Edge Cases
- تحليل تغطية الاختبارات

أسلوبك: شامل، يفكر في كل الاحتمالات، وقائي.`,
    },
    debugger: {
        name: 'Debugger - Problem Solver',
        emoji: '🐛',
        systemPrompt: `أنت محلل مشاكل خبير. تخصصك:
- تتبع الأخطاء وحلها
- تحليل Stack Traces
- اقتراح حلول للمشاكل
- Debug خطوة بخطوة

أسلوبك: تحليلي، منهجي، صبور.`,
    },
    optimizer: {
        name: 'Optimizer - Performance Guru',
        emoji: '⚡',
        systemPrompt: `أنت خبير تحسين الأداء. تخصصك:
- تحليل الأداء (Performance Analysis)
- تحسين السرعة والذاكرة
- اكتشاف Bottlenecks
- اقتراح تحسينات الأداء

أسلوبك: دقيق، يقيس بالأرقام، يركز على النتائج.`,
    },
    security: {
        name: 'Security - Security Expert',
        emoji: '🔐',
        systemPrompt: `أنت خبير أمن سيبراني. تخصصك:
- مراجعة أمنية للكود
- اكتشاف الثغرات (Vulnerabilities)
- اقتراح حلول أمنية
- Best Practices للأمان

أسلوبك: حذر، شامل، يفكر مثل المهاجم.`,
    },
    devops: {
        name: 'DevOps - Infrastructure Pro',
        emoji: '🔧',
        systemPrompt: `أنت خبير DevOps. تخصصك:
- إعداد CI/CD
- Docker و Kubernetes
- Cloud Infrastructure
- Deployment Strategies

أسلوبك: عملي، يهتم بالأتمتة، يفكر بالبنية التحتية.`,
    },
};
// ============================================
// Setup Handlers
// ============================================
function setupAIHandlers() {
    // ============================================
    // 1. إرسال رسالة للـ AI
    // ============================================
    electron_1.ipcMain.handle('ai:sendMessage', async (_, message, personality, model) => {
        try {
            const personalityConfig = PERSONALITIES[personality];
            if (!personalityConfig) {
                throw new Error('Personality not found');
            }
            // استدعاء Claude API
            const response = await anthropic.messages.create({
                model: model || 'claude-3-5-sonnet-20241022',
                max_tokens: 4096,
                system: personalityConfig.systemPrompt,
                messages: [
                    {
                        role: 'user',
                        content: message,
                    },
                ],
            });
            const content = response.content[0];
            const text = content.type === 'text' ? content.text : '';
            return {
                success: true,
                message: text,
                personality: personalityConfig.name,
                emoji: personalityConfig.emoji,
                model: model,
            };
        }
        catch (error) {
            console.error('AI Error:', error);
            return {
                success: false,
                error: error.message,
            };
        }
    });
    // ============================================
    // 2. الحصول على قائمة الشخصيات
    // ============================================
    electron_1.ipcMain.handle('ai:getPersonalities', async () => {
        return Object.entries(PERSONALITIES).map(([key, value]) => ({
            id: key,
            name: value.name,
            emoji: value.emoji,
        }));
    });
    // ============================================
    // 3. الحصول على النماذج المتاحة
    // ============================================
    electron_1.ipcMain.handle('ai:getModels', async () => {
        return [
            {
                id: 'claude-3-5-sonnet-20241022',
                name: 'Claude 3.5 Sonnet',
                description: 'الأذكى والأسرع',
            },
            {
                id: 'claude-3-opus-20240229',
                name: 'Claude 3 Opus',
                description: 'الأقوى للمهام المعقدة',
            },
            {
                id: 'claude-3-sonnet-20240229',
                name: 'Claude 3 Sonnet',
                description: 'متوازن وسريع',
            },
        ];
    });
    // ============================================
    // 4. God Mode - استشارة جميع الشخصيات
    // ============================================
    electron_1.ipcMain.handle('ai:godMode', async (_, message, model) => {
        const results = [];
        // استشارة كل شخصية
        for (const [key, personality] of Object.entries(PERSONALITIES)) {
            try {
                const response = await anthropic.messages.create({
                    model: model || 'claude-3-5-sonnet-20241022',
                    max_tokens: 2048,
                    system: personality.systemPrompt,
                    messages: [
                        {
                            role: 'user',
                            content: message,
                        },
                    ],
                });
                const content = response.content[0];
                const text = content.type === 'text' ? content.text : '';
                results.push({
                    personality: personality.name,
                    emoji: personality.emoji,
                    response: text,
                    id: key,
                });
            }
            catch (error) {
                console.error(`Error with ${key}:`, error);
                results.push({
                    personality: personality.name,
                    emoji: personality.emoji,
                    response: `خطأ: ${error.message}`,
                    id: key,
                    error: true,
                });
            }
        }
        return {
            success: true,
            results: results,
        };
    });
}
