/**
 * Unified AI Adapter
 * نظام موحد لإدارة جميع مزودي الـ AI
 * يختار أفضل مزود تلقائياً حسب المهمة
 */

import { DeepSeekService } from './services/deepseek-service';
import { ClaudeService } from './services/claude-service';
import { OpenAIService } from './services/openai-service';

export type AIProvider = 'deepseek' | 'claude' | 'openai' | 'auto';

export type AIPersonality = 
  | 'architect' 
  | 'coder' 
  | 'reviewer' 
  | 'tester' 
  | 'debugger' 
  | 'optimizer' 
  | 'security' 
  | 'devops';

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIResponse {
  response: string;
  provider: AIProvider;
  model: string;
  cost: number;
  tokensUsed: {
    input: number;
    output: number;
  };
}

export interface UnifiedAIAdapterConfig {
  deepseek?: string;
  claude?: string;
  openai?: string;
  defaultProvider?: AIProvider;
}

export class UnifiedAIAdapter {
  private providers: Map<AIProvider, any> = new Map();
  private defaultProvider: AIProvider = 'deepseek';
  
  constructor(config: UnifiedAIAdapterConfig) {
    // تهيئة المزودين المتاحين
    if (config.deepseek) {
      this.providers.set('deepseek', new DeepSeekService(config.deepseek));
    }
    
    if (config.claude) {
      this.providers.set('claude', new ClaudeService(config.claude));
    }
    
    if (config.openai) {
      this.providers.set('openai', new OpenAIService(config.openai));
    }

    // تعيين المزود الافتراضي
    if (config.defaultProvider && this.providers.has(config.defaultProvider)) {
      this.defaultProvider = config.defaultProvider;
    }

    if (this.providers.size === 0) {
      throw new Error('At least one AI provider must be configured');
    }
  }

  /**
   * الدالة الرئيسية - معالجة مع شخصية AI
   */
  async processWithPersonality(
    personality: AIPersonality,
    prompt: string,
    context?: string,
    provider: AIProvider = 'auto'
  ): Promise<AIResponse> {
    // اختيار المزود المناسب
    const selectedProvider = this.selectProvider(provider, personality, prompt);
    
    if (!this.providers.has(selectedProvider)) {
      throw new Error(`Provider ${selectedProvider} not available`);
    }

    const aiService = this.providers.get(selectedProvider);
    const systemMessage = this.getPersonalitySystemMessage(personality);
    
    // بناء الرسائل
    const messages: Message[] = [
      { role: 'system', content: systemMessage }
    ];

    if (context) {
      messages.push({
        role: 'user',
        content: `السياق:\n${context}\n\nالمهمة:\n${prompt}`
      });
    } else {
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
    } catch (error: any) {
      // Fallback إلى مزود آخر
      if (selectedProvider !== this.defaultProvider && this.providers.has(this.defaultProvider)) {
        console.warn(`Provider ${selectedProvider} failed, falling back to ${this.defaultProvider}`);
        return this.processWithPersonality(personality, prompt, context, this.defaultProvider);
      }
      throw error;
    }
  }

  /**
   * معالجة عادية بدون شخصية
   */
  async process(
    prompt: string,
    context?: string,
    provider: AIProvider = 'auto'
  ): Promise<AIResponse> {
    return this.processWithPersonality('coder', prompt, context, provider);
  }

  /**
   * Streaming Response
   */
  async *processStream(
    personality: AIPersonality,
    prompt: string,
    context?: string,
    provider: AIProvider = 'auto'
  ): AsyncGenerator<string, void, unknown> {
    const selectedProvider = this.selectProvider(provider, personality, prompt);
    
    if (!this.providers.has(selectedProvider)) {
      throw new Error(`Provider ${selectedProvider} not available`);
    }

    const aiService = this.providers.get(selectedProvider);
    const systemMessage = this.getPersonalitySystemMessage(personality);
    
    const messages: Message[] = [
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
    } catch (error: any) {
      console.error('Stream error:', error);
      throw error;
    }
  }

  /**
   * اختيار أفضل مزود تلقائياً
   */
  private selectProvider(
    requested: AIProvider,
    personality: AIPersonality,
    prompt: string
  ): AIProvider {
    // إذا المستخدم حدد مزود معين
    if (requested !== 'auto' && this.providers.has(requested)) {
      return requested;
    }

    // استراتيجية الاختيار الذكي
    const providerStrategies: Record<AIPersonality, AIProvider[]> = {
      architect: ['claude', 'openai', 'deepseek'],    // يحتاج تفكير عميق
      coder: ['deepseek', 'claude', 'openai'],        // DeepSeek ممتاز في الكود
      reviewer: ['claude', 'openai', 'deepseek'],     // Claude ممتاز في المراجعة
      tester: ['deepseek', 'openai', 'claude'],       // مهمة روتينية
      debugger: ['deepseek', 'claude', 'openai'],     // تحليل سريع
      optimizer: ['deepseek', 'openai', 'claude'],    // تحسينات بسيطة
      security: ['claude', 'openai', 'deepseek'],     // يحتاج دقة عالية
      devops: ['deepseek', 'openai', 'claude'],       // مهام عملية
    };

    // اختيار حسب تعقيد السؤال
    const complexity = this.estimateComplexity(prompt);
    
    if (complexity === 'high') {
      // مهمة معقدة → Claude أو GPT-4
      if (this.providers.has('claude')) return 'claude';
      if (this.providers.has('openai')) return 'openai';
    } else if (complexity === 'low') {
      // مهمة بسيطة → DeepSeek (أرخص)
      if (this.providers.has('deepseek')) return 'deepseek';
    }

    // حسب الشخصية
    const preferredProviders = providerStrategies[personality] || ['deepseek', 'claude', 'openai'];
    
    for (const provider of preferredProviders) {
      if (this.providers.has(provider)) {
        return provider;
      }
    }

    return this.defaultProvider;
  }

  /**
   * تقدير تعقيد السؤال
   */
  private estimateComplexity(prompt: string): 'low' | 'medium' | 'high' {
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
  private estimateTokens(text: string): number {
    // قاعدة بسيطة: كل 4 أحرف = 1 token تقريباً
    return Math.ceil(text.length / 4);
  }

  /**
   * تعريف الشخصيات الـ8
   */
  private getPersonalitySystemMessage(personality: AIPersonality): string {
    const personalities: Record<AIPersonality, string> = {
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
  async quickCodeHelp(prompt: string, codeContext?: string, provider?: AIProvider): Promise<string> {
    const result = await this.processWithPersonality('coder', prompt, codeContext, provider);
    return result.response;
  }

  async quickReview(code: string, provider?: AIProvider): Promise<string> {
    const result = await this.processWithPersonality('reviewer', 'راجع هذا الكود', code, provider);
    return result.response;
  }

  async quickOptimize(code: string, provider?: AIProvider): Promise<string> {
    const result = await this.processWithPersonality('optimizer', 'حسن أداء هذا الكود', code, provider);
    return result.response;
  }

  async quickDebug(error: string, code?: string, provider?: AIProvider): Promise<string> {
    const context = code ? `الكود:\n${code}\n\nالخطأ:\n${error}` : error;
    const result = await this.processWithPersonality('debugger', 'حلل وأصلح هذا الخطأ', context, provider);
    return result.response;
  }

  /**
   * الحصول على إحصائيات
   */
  getAvailableProviders(): Array<{ id: AIProvider; name: string; available: boolean }> {
    return [
      { id: 'deepseek', name: 'DeepSeek', available: this.providers.has('deepseek') },
      { id: 'claude', name: 'Claude (Anthropic)', available: this.providers.has('claude') },
      { id: 'openai', name: 'OpenAI (GPT-4)', available: this.providers.has('openai') },
    ];
  }

  /**
   * تغيير المزود الافتراضي
   */
  setDefaultProvider(provider: AIProvider): void {
    if (this.providers.has(provider)) {
      this.defaultProvider = provider;
    } else {
      throw new Error(`Provider ${provider} is not available`);
    }
  }

  /**
   * الحصول على معلومات التكلفة
   */
  getCostComparison(): Array<{ provider: string; inputCost: number; outputCost: number }> {
    const costs: Array<{ provider: string; inputCost: number; outputCost: number }> = [];

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
