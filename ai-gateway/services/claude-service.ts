/**
 * Claude AI Service (Anthropic)
 * الأفضل جودة - للمهام المعقدة والحرجة
 */

import Anthropic from '@anthropic-ai/sdk';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatCompletionOptions {
  model?: string;
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
}

export class ClaudeService {
  private client: Anthropic;
  
  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('Anthropic API key is required');
    }
    
    this.client = new Anthropic({
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
      model = 'claude-3-5-sonnet-20241022',
      maxTokens = 4096,
      temperature = 0.7,
      systemPrompt,
    } = options;

    try {
      // تحويل الرسائل لصيغة Claude
      const claudeMessages = messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await this.client.messages.create({
        model,
        max_tokens: maxTokens,
        temperature,
        ...(systemPrompt && { system: systemPrompt }),
        messages: claudeMessages,
      });

      const content = response.content[0];
      if (content.type === 'text') {
        return content.text;
      }

      throw new Error('Unexpected response type from Claude');
    } catch (error: any) {
      console.error('Claude Error:', error);
      throw new Error(`Claude failed: ${error.message}`);
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
      model = 'claude-3-5-sonnet-20241022',
      maxTokens = 4096,
      temperature = 0.7,
      systemPrompt,
    } = options;

    try {
      const claudeMessages = messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      const stream = await this.client.messages.stream({
        model,
        max_tokens: maxTokens,
        temperature,
        ...(systemPrompt && { system: systemPrompt }),
        messages: claudeMessages,
      });

      for await (const event of stream) {
        if (
          event.type === 'content_block_delta' &&
          event.delta.type === 'text_delta'
        ) {
          yield event.delta.text;
        }
      }
    } catch (error: any) {
      console.error('Claude Stream Error:', error);
      throw error;
    }
  }

  /**
   * حساب التكلفة التقريبية
   */
  calculateCost(inputTokens: number, outputTokens: number, model: string = 'claude-3-5-sonnet-20241022'): number {
    // Claude pricing
    const pricing: Record<string, { input: number; output: number }> = {
      'claude-3-5-sonnet-20241022': {
        input: 3.0,   // $3 per 1M tokens
        output: 15.0, // $15 per 1M tokens
      },
      'claude-3-opus-20240229': {
        input: 15.0,  // $15 per 1M tokens
        output: 75.0, // $75 per 1M tokens
      },
      'claude-3-sonnet-20240229': {
        input: 3.0,   // $3 per 1M tokens
        output: 15.0, // $15 per 1M tokens
      },
    };

    const modelPricing = pricing[model] || pricing['claude-3-5-sonnet-20241022'];
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
        id: 'claude-3-5-sonnet-20241022',
        name: 'Claude 3.5 Sonnet',
        description: 'الأذكى والأسرع - موصى به',
        maxTokens: 200000,
        cost: { input: 3.0, output: 15.0 },
      },
      {
        id: 'claude-3-opus-20240229',
        name: 'Claude 3 Opus',
        description: 'الأقوى للمهام شديدة التعقيد',
        maxTokens: 200000,
        cost: { input: 15.0, output: 75.0 },
      },
      {
        id: 'claude-3-sonnet-20240229',
        name: 'Claude 3 Sonnet',
        description: 'متوازن بين الجودة والسرعة',
        maxTokens: 200000,
        cost: { input: 3.0, output: 15.0 },
      },
    ];
  }

  /**
   * الحصول على معلومات النموذج
   */
  getModelInfo() {
    return {
      name: 'Claude (Anthropic)',
      model: 'claude-3-5-sonnet-20241022',
      maxTokens: 200000,
      costPer1MTokens: {
        input: 3.0,
        output: 15.0,
      },
      description: 'أفضل نموذج للمهام المعقدة والبرمجة',
      strengths: ['ذكاء عالي', 'ممتاز في البرمجة', 'فهم عميق للسياق', 'آمن جداً'],
      weaknesses: ['غالي نسبياً', 'بطيء قليلاً'],
    };
  }
}

export default ClaudeService;
