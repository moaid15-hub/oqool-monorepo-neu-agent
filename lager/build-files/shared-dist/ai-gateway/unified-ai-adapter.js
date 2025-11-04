/**
 * Unified AI Adapter
 * نظام موحد لإدارة جميع مزودي الـ AI
 * يختار أفضل مزود تلقائياً حسب المهمة
 */
import { DeepSeekService } from './deepseek-service.js';
import { ClaudeService } from './claude-service.js';
import { OpenAIService } from './openai-service.js';
import { GeminiService } from './gemini-service.js';
export class UnifiedAIAdapter {
    providers = new Map();
    defaultProvider = 'deepseek';
    constructor(config) {
        // تهيئة المزودين المتاحين (فقط لو الـ key صالح)
        // Gemini (Google) - الأسرع والأرخص
        if (config.gemini && config.gemini.startsWith('AIzaSy')) {
            this.providers.set('gemini', new GeminiService(config.gemini));
        }
        if (config.deepseek && config.deepseek.startsWith('sk-')) {
            this.providers.set('deepseek', new DeepSeekService(config.deepseek));
        }
        if (config.claude && config.claude.startsWith('sk-ant-')) {
            this.providers.set('claude', new ClaudeService(config.claude));
        }
        if (config.openai && (config.openai.startsWith('sk-proj-') || config.openai.startsWith('sk-'))) {
            this.providers.set('openai', new OpenAIService(config.openai));
        }
        // تعيين المزود الافتراضي
        if (config.defaultProvider && this.providers.has(config.defaultProvider)) {
            this.defaultProvider = config.defaultProvider;
        }
        else {
            // إذا المزود الافتراضي مش متاح، استخدم أول مزود متاح
            // الترتيب: Gemini (أسرع) → DeepSeek (رخيص) → OpenAI → Claude
            if (this.providers.has('gemini')) {
                this.defaultProvider = 'gemini';
            }
            else if (this.providers.has('deepseek')) {
                this.defaultProvider = 'deepseek';
            }
            else if (this.providers.has('openai')) {
                this.defaultProvider = 'openai';
            }
            else if (this.providers.has('claude')) {
                this.defaultProvider = 'claude';
            }
        }
        if (this.providers.size === 0) {
            throw new Error('At least one AI provider must be configured with a valid API key');
        }
    }
    /**
     * الدالة الرئيسية - معالجة مع شخصية AI
     */
    async processWithPersonality(personality, prompt, context, provider = 'auto') {
        // اختيار المزود المناسب
        const selectedProvider = this.selectProvider(provider, personality, prompt);
        if (!this.providers.has(selectedProvider)) {
            throw new Error(`Provider ${selectedProvider} not available`);
        }
        const aiService = this.providers.get(selectedProvider);
        const systemMessage = this.getPersonalitySystemMessage(personality);
        // بناء الرسائل
        const messages = [
            { role: 'system', content: systemMessage }
        ];
        if (context) {
            messages.push({
                role: 'user',
                content: `السياق:\n${context}\n\nالمهمة:\n${prompt}`
            });
        }
        else {
            messages.push({
                role: 'user',
                content: prompt
            });
        }
        try {
            const startTime = Date.now();
            const response = await aiService.chatCompletion(messages, {
                systemPrompt: selectedProvider === 'claude' ? systemMessage : undefined,
            });
            const endTime = Date.now();
            // تقدير التكلفة (تقريبي)
            const estimatedInputTokens = this.estimateTokens(messages.map(m => m.content).join(' '));
            const estimatedOutputTokens = this.estimateTokens(response);
            const cost = aiService.calculateCost(estimatedInputTokens, estimatedOutputTokens);
            return {
                response: response || 'لم يتم الحصول على استجابة',
                provider: selectedProvider,
                model: aiService.getModelInfo().model,
                cost,
                tokensUsed: {
                    input: estimatedInputTokens,
                    output: estimatedOutputTokens,
                },
            };
        }
        catch (error) {
            // 🔄 نظام Fallback الذكي - DeepSeek كـ backup نهائي
            return this.handleProviderFailure(error, selectedProvider, personality, prompt, context);
        }
    }
    /**
     * معالجة عادية بدون شخصية
     */
    async process(prompt, context, provider = 'auto') {
        return this.processWithPersonality('coder', prompt, context, provider);
    }
    /**
     * Streaming Response
     */
    async *processStream(personality, prompt, context, provider = 'auto') {
        const selectedProvider = this.selectProvider(provider, personality, prompt);
        if (!this.providers.has(selectedProvider)) {
            throw new Error(`Provider ${selectedProvider} not available`);
        }
        const aiService = this.providers.get(selectedProvider);
        const systemMessage = this.getPersonalitySystemMessage(personality);
        const messages = [
            { role: 'system', content: systemMessage },
            {
                role: 'user',
                content: context ? `السياق:\n${context}\n\nالمهمة:\n${prompt}` : prompt
            }
        ];
        try {
            for await (const chunk of aiService.chatCompletionStream(messages, {
                systemPrompt: selectedProvider === 'claude' ? systemMessage : undefined,
            })) {
                yield chunk;
            }
        }
        catch (error) {
            console.error('Stream error:', error);
            throw error;
        }
    }
    /**
     * اختيار أفضل مزود تلقائياً
     */
    selectProvider(requested, personality, prompt) {
        // إذا المستخدم حدد مزود معين
        if (requested !== 'auto' && this.providers.has(requested)) {
            return requested;
        }
        // استراتيجية الاختيار الذكي
        const providerStrategies = {
            architect: ['claude', 'openai', 'gemini', 'deepseek'], // يحتاج تفكير عميق
            coder: ['gemini', 'deepseek', 'claude', 'openai'], // Gemini سريع ممتاز في الكود
            reviewer: ['claude', 'openai', 'gemini', 'deepseek'], // Claude ممتاز في المراجعة
            tester: ['gemini', 'deepseek', 'openai', 'claude'], // مهمة روتينية - Gemini أسرع
            debugger: ['gemini', 'deepseek', 'claude', 'openai'], // تحليل سريع
            optimizer: ['gemini', 'deepseek', 'openai', 'claude'], // تحسينات بسيطة
            security: ['claude', 'openai', 'gemini', 'deepseek'], // يحتاج دقة عالية
            devops: ['gemini', 'deepseek', 'openai', 'claude'], // مهام عملية
        };
        // اختيار حسب تعقيد السؤال
        const complexity = this.estimateComplexity(prompt);
        if (complexity === 'high') {
            // مهمة معقدة → Claude أو GPT-4
            if (this.providers.has('claude'))
                return 'claude';
            if (this.providers.has('openai'))
                return 'openai';
            if (this.providers.has('gemini'))
                return 'gemini';
        }
        else if (complexity === 'low') {
            // مهمة بسيطة → Gemini (أسرع) أو DeepSeek (أرخص)
            if (this.providers.has('gemini'))
                return 'gemini';
            if (this.providers.has('deepseek'))
                return 'deepseek';
        }
        // حسب الشخصية
        const preferredProviders = providerStrategies[personality] || ['gemini', 'deepseek', 'openai', 'claude'];
        for (const provider of preferredProviders) {
            if (this.providers.has(provider)) {
                return provider;
            }
        }
        return this.defaultProvider;
    }
    /**
     * 🔄 معالج فشل المزود - Fallback الذكي
     */
    async handleProviderFailure(error, failedProvider, personality, prompt, context) {
        // تحليل نوع الخطأ
        const errorType = this.categorizeError(error);
        console.warn(`⚠️ Provider ${failedProvider} failed (${errorType}): ${error.message}`);
        // استراتيجية Fallback:
        // 1. إذا فشل Claude/OpenAI → جرب DeepSeek
        // 2. إذا فشل DeepSeek → جرب defaultProvider
        // 3. إذا فشل الكل → رمي Error
        const fallbackChain = this.getFallbackChain(failedProvider);
        for (const nextProvider of fallbackChain) {
            if (this.providers.has(nextProvider)) {
                console.log(`🔄 Falling back to ${nextProvider}...`);
                try {
                    return await this.processWithPersonality(personality, prompt, context, nextProvider);
                }
                catch (fallbackError) {
                    console.warn(`⚠️ Fallback ${nextProvider} also failed: ${fallbackError.message}`);
                    continue; // جرب المزود التالي
                }
            }
        }
        // إذا فشلت كل المحاولات
        throw new Error(`❌ All AI providers failed. Last error from ${failedProvider}: ${error.message}\n` +
            `Available providers: ${Array.from(this.providers.keys()).join(', ')}\n` +
            `Please check your API keys and balance.`);
    }
    /**
     * 🎯 تحديد سلسلة Fallback حسب المزود الفاشل
     */
    getFallbackChain(failedProvider) {
        // Gemini دائماً الخيار الأول (الأسرع والأرخص)
        const fallbackStrategies = {
            'claude': ['gemini', 'deepseek', 'openai'], // Claude فشل → Gemini → DeepSeek → OpenAI
            'openai': ['gemini', 'deepseek', 'claude'], // OpenAI فشل → Gemini → DeepSeek → Claude
            'deepseek': ['gemini', 'openai', 'claude'], // DeepSeek فشل → Gemini → OpenAI → Claude
            'gemini': ['deepseek', 'openai', 'claude'], // Gemini فشل → DeepSeek → OpenAI → Claude
            'auto': ['gemini', 'deepseek', 'openai', 'claude'], // Auto → Gemini أولاً
        };
        return fallbackStrategies[failedProvider] || ['gemini', 'deepseek'];
    }
    /**
     * 🔍 تصنيف نوع الخطأ
     */
    categorizeError(error) {
        const errorMsg = error.message?.toLowerCase() || '';
        if (errorMsg.includes('401') || errorMsg.includes('authentication') || errorMsg.includes('invalid x-api-key')) {
            return 'Invalid API Key';
        }
        if (errorMsg.includes('403') || errorMsg.includes('forbidden')) {
            return 'Access Forbidden';
        }
        if (errorMsg.includes('429') || errorMsg.includes('rate limit') || errorMsg.includes('quota')) {
            return 'Rate Limit / No Credits';
        }
        if (errorMsg.includes('insufficient') || errorMsg.includes('balance')) {
            return 'Insufficient Balance';
        }
        if (errorMsg.includes('500') || errorMsg.includes('503')) {
            return 'Server Error';
        }
        if (errorMsg.includes('timeout') || errorMsg.includes('network')) {
            return 'Network Error';
        }
        return 'Unknown Error';
    }
    /**
     * تقدير تعقيد السؤال
     */
    estimateComplexity(prompt) {
        const keywords = {
            high: ['architecture', 'design pattern', 'optimize', 'security', 'review', 'معماري', 'تصميم', 'أمان', 'مراجعة'],
            low: ['simple', 'basic', 'quick', 'بسيط', 'سريع', 'صغير'],
        };
        const lowerPrompt = prompt.toLowerCase();
        if (keywords.high.some(k => lowerPrompt.includes(k))) {
            return 'high';
        }
        if (keywords.low.some(k => lowerPrompt.includes(k))) {
            return 'low';
        }
        if (prompt.length > 500) {
            return 'high';
        }
        return 'medium';
    }
    /**
     * تقدير عدد الـ Tokens (تقريبي)
     */
    estimateTokens(text) {
        // قاعدة بسيطة: كل 4 أحرف = 1 token تقريباً
        return Math.ceil(text.length / 4);
    }
    /**
     * تعريف الشخصيات الـ8
     */
    getPersonalitySystemMessage(personality) {
        const personalities = {
            architect: `أنت مهندس معماري برمجي خبير. مهمتك تصميم بنى معمارية متينة وقابلة للتطوير.
المجال: تصميم الأنظمة، أنماط التصميم، قابلية التوسع، الأمان.
أسلوبك: محترف، استراتيجي، يفكر بالصورة الكبيرة.`,
            coder: `أنت مبرمج خبير. مهمتك كتابة كود نظيف وفعال وقابل للصيانة.
المجال: كتابة الكود، best practices، كفاءة الأداء، معالجة الأخطاء.
أسلوبك: عملي، مباشر، يركز على التنفيذ.`,
            reviewer: `أنت مراجع كود محترف. مهمتك تحليل الجودة واكتشاف المشاكل.
المجال: مراجعة الكود، كشف الثغرات، الالتزام بالمعايير، اقتراح التحسينات.
أسلوبك: ناقد بناء، دقيق، يهتم بالجودة.`,
            tester: `أنت مختبر برمجيات خبير. مهمتك ضمان الجودة والموثوقية.
المجال: كتابة الاختبارات، حالات الاختبار، تغطية الاختبارات، جودة المنتج.
أسلوبك: شامل، يفكر في كل الاحتمالات، وقائي.`,
            debugger: `أنت محلل أخطاء استثنائي. مهمتك تشخيص وحل المشكلات المعقدة.
المجال: تحليل الأخطاء، تتبع الجذور، حلول عملية، تحسين الأداء.
أسلوبك: تحليلي، منهجي، صبور.`,
            optimizer: `أنت محسن أداء متميز. مهمتك جعل التطبيقات أسرع وأكثر كفاءة.
المجال: تحسين السرعة، تقليل استخدام الموارد، كفاءة الذاكرة، تحسين الخوارزميات.
أسلوبك: دقيق، يقيس بالأرقام، يركز على النتائج.`,
            security: `أنت خبير أمن سيبراني. مهمتك حماية التطبيقات من التهديدات.
المجال: الأمان السيبراني، منع الثغرات، best practices أمنية، حماية البيانات.
أسلوبك: حذر، شامل، يفكر مثل المهاجم.`,
            devops: `أنت خبير DevOps. مهمتك تبسيط العمليات وضمان الموثوقية.
المجال: الأتمتة، CI/CD، البنية التحتية، المراقبة، إدارة النشر.
أسلوبك: عملي، يهتم بالأتمتة، يفكر بالبنية التحتية.`,
        };
        return personalities[personality] || 'أنت مساعد برمجي خبير. قدم مساعدة تقنية متخصصة.';
    }
    /**
     * وظائف مساعدة سريعة
     */
    async quickCodeHelp(prompt, codeContext, provider) {
        const result = await this.processWithPersonality('coder', prompt, codeContext, provider);
        return result.response;
    }
    async quickReview(code, provider) {
        const result = await this.processWithPersonality('reviewer', 'راجع هذا الكود', code, provider);
        return result.response;
    }
    async quickOptimize(code, provider) {
        const result = await this.processWithPersonality('optimizer', 'حسن أداء هذا الكود', code, provider);
        return result.response;
    }
    async quickDebug(error, code, provider) {
        const context = code ? `الكود:\n${code}\n\nالخطأ:\n${error}` : error;
        const result = await this.processWithPersonality('debugger', 'حلل وأصلح هذا الخطأ', context, provider);
        return result.response;
    }
    /**
     * الحصول على إحصائيات
     */
    getAvailableProviders() {
        return [
            { id: 'gemini', name: 'Gemini (Google)', available: this.providers.has('gemini') },
            { id: 'deepseek', name: 'DeepSeek', available: this.providers.has('deepseek') },
            { id: 'claude', name: 'Claude (Anthropic)', available: this.providers.has('claude') },
            { id: 'openai', name: 'OpenAI (GPT-4)', available: this.providers.has('openai') },
        ];
    }
    /**
     * تغيير المزود الافتراضي
     */
    setDefaultProvider(provider) {
        if (this.providers.has(provider)) {
            this.defaultProvider = provider;
        }
        else {
            throw new Error(`Provider ${provider} is not available`);
        }
    }
    /**
     * الحصول على معلومات التكلفة
     */
    getCostComparison() {
        const costs = [];
        if (this.providers.has('gemini')) {
            costs.push({ provider: 'Gemini 2.0 Flash', inputCost: 0.10, outputCost: 0.40 });
        }
        if (this.providers.has('deepseek')) {
            costs.push({ provider: 'DeepSeek', inputCost: 0.14, outputCost: 0.28 });
        }
        if (this.providers.has('claude')) {
            costs.push({ provider: 'Claude 3.5 Sonnet', inputCost: 3.0, outputCost: 15.0 });
        }
        if (this.providers.has('openai')) {
            costs.push({ provider: 'GPT-4 Turbo', inputCost: 10.0, outputCost: 30.0 });
        }
        return costs;
    }
}
export default UnifiedAIAdapter;
//# sourceMappingURL=unified-ai-adapter.js.map