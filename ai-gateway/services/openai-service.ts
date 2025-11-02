/**
 * OpenAI Service (GPT-4)
 * متوازن - جودة عالية بسعر معقول
 */

import OpenAI from 'openai';

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatCompletionOptions {
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

export class OpenAIService {
  private client: OpenAI;
  
  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('OpenAI API key is required');
    }
    
    this.client = new OpenAI({
      apiKey: apiKey,
    });
  }

  /**
   * إرسال رسالة للـ AI
   */
  async chatCompletion(
    messages: Message[],
    options: ChatCompletionOptions = {}
  ): Promise<string> {
    const {
      model = 'gpt-4-turbo-preview',
      maxTokens = 4096,
      temperature = 0.7,
    } = options;

    try {
      const response = await this.client.chat.completions.create({
        model,
        messages,
        max_tokens: maxTokens,
        temperature,
      });

      const content = response.choices[0]?.message?.content;
      
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      return content;
    } catch (error: any) {
      console.error('OpenAI Error:', error);
      throw new Error(`OpenAI failed: ${error.message}`);
    }
  }

  /**
   * Streaming Response
   */
  async *chatCompletionStream(
    messages: Message[],
    options: ChatCompletionOptions = {}
  ): AsyncGenerator<string, void, unknown> {
    const {
      model = 'gpt-4-turbo-preview',
      maxTokens = 4096,
      temperature = 0.7,
    } = options;

    try {
      const stream = await this.client.chat.completions.create({
        model,
        messages,
        max_tokens: maxTokens,
        temperature,
        stream: true,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          yield content;
        }
      }
    } catch (error: any) {
      console.error('OpenAI Stream Error:', error);
      throw error;
    }
  }

  /**
   * حساب التكلفة التقريبية
   */
  calculateCost(inputTokens: number, outputTokens: number, model: string = 'gpt-4-turbo-preview'): number {
    // OpenAI pricing
    const pricing: Record<string, { input: number; output: number }> = {
      'gpt-4-turbo-preview': {
        input: 10.0,  // $10 per 1M tokens
        output: 30.0, // $30 per 1M tokens
      },
      'gpt-4': {
        input: 30.0,  // $30 per 1M tokens
        output: 60.0, // $60 per 1M tokens
      },
      'gpt-3.5-turbo': {
        input: 0.5,   // $0.50 per 1M tokens
        output: 1.5,  // $1.50 per 1M tokens
      },
      'gpt-4o': {
        input: 5.0,   // $5 per 1M tokens
        output: 15.0, // $15 per 1M tokens
      },
      'gpt-4o-mini': {
        input: 0.15,  // $0.15 per 1M tokens
        output: 0.60, // $0.60 per 1M tokens
      },
    };

    const modelPricing = pricing[model] || pricing['gpt-4-turbo-preview'];
    const inputCost = (inputTokens / 1_000_000) * modelPricing.input;
    const outputCost = (outputTokens / 1_000_000) * modelPricing.output;
    
    return inputCost + outputCost;
  }

  /**
   * التحقق من صلاحية الـ API Key
   */
  async validateApiKey(): Promise<boolean> {
    try {
      await this.chatCompletion([
        { role: 'user', content: 'Hello' }
      ], { maxTokens: 10 });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * الحصول على النماذج المتاحة
   */
  getAvailableModels() {
    return [
      {
        id: 'gpt-4o',
        name: 'GPT-4o',
        description: 'الأحدث - أسرع وأرخص من GPT-4',
        maxTokens: 128000,
        cost: { input: 5.0, output: 15.0 },
      },
      {
        id: 'gpt-4o-mini',
        name: 'GPT-4o Mini',
        description: 'صغير وسريع ورخيص جداً',
        maxTokens: 128000,
        cost: { input: 0.15, output: 0.60 },
      },
      {
        id: 'gpt-4-turbo-preview',
        name: 'GPT-4 Turbo',
        description: 'قوي وسريع - موصى به',
        maxTokens: 128000,
        cost: { input: 10.0, output: 30.0 },
      },
      {
        id: 'gpt-4',
        name: 'GPT-4',
        description: 'النموذج الأصلي - الأقوى',
        maxTokens: 8192,
        cost: { input: 30.0, output: 60.0 },
      },
      {
        id: 'gpt-3.5-turbo',
        name: 'GPT-3.5 Turbo',
        description: 'سريع ورخيص للمهام البسيطة',
        maxTokens: 16384,
        cost: { input: 0.5, output: 1.5 },
      },
    ];
  }

  /**
   * الحصول على معلومات النموذج
   */
  getModelInfo() {
    return {
      name: 'OpenAI (GPT-4)',
      model: 'gpt-4-turbo-preview',
      maxTokens: 128000,
      costPer1MTokens: {
        input: 10.0,
        output: 30.0,
      },
      description: 'نموذج متوازن بين الجودة والسعر',
      strengths: ['ذكاء عالي', 'سريع', 'موثوق', 'دعم واسع'],
      weaknesses: ['أغلى من DeepSeek', 'أقل ذكاءً قليلاً من Claude'],
    };
  }
}

export default OpenAIService;
