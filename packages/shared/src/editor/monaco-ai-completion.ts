// monaco-ai-completion.ts
// ============================================
// 🤖 Monaco Editor AI Completion Provider
// ============================================
// AI-powered code completions for Monaco Editor

import type * as Monaco from 'monaco-editor';

// ============================================
// Types
// ============================================

export interface AICompletionConfig {
  provider: 'ollama' | 'openai' | 'deepseek';
  model: string;
  apiKey?: string;
  baseURL?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface AICompletionContext {
  code: string;
  cursorPosition: { line: number; column: number };
  filePath?: string;
  language: string;
}

export interface AICompletionResult {
  text: string;
  description?: string;
  confidence: number;
  source: 'ai' | 'cache' | 'local';
}

// ============================================
// Monaco AI Completion Provider
// ============================================

export class MonacoAICompletionProvider {
  private config: AICompletionConfig;
  private cache = new Map<string, AICompletionResult[]>();
  private pendingRequests = new Map<string, Promise<AICompletionResult[]>>();

  constructor(config: AICompletionConfig) {
    this.config = config;
  }

  /**
   * Register AI completion provider with Monaco
   */
  register(monaco: typeof Monaco, language: string): Monaco.IDisposable {
    return monaco.languages.registerCompletionItemProvider(language, {
      triggerCharacters: ['.', ' ', '(', '{', '['],

      provideCompletionItems: async (model, position, context, token) => {
        try {
          const context: AICompletionContext = {
            code: model.getValue(),
            cursorPosition: {
              line: position.lineNumber,
              column: position.column,
            },
            filePath: model.uri.path,
            language,
          };

          const completions = await this.getCompletions(context);

          return {
            suggestions: completions.map((completion) =>
              this.createMonacoCompletion(monaco, completion, position)
            ),
          };
        } catch (error) {
          console.error('AI Completion error:', error);
          return { suggestions: [] };
        }
      },
    });
  }

  /**
   * Get AI completions
   */
  private async getCompletions(
    context: AICompletionContext
  ): Promise<AICompletionResult[]> {
    // Generate cache key
    const cacheKey = this.generateCacheKey(context);

    // Check cache first
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)!;
      return cached.map((c) => ({ ...c, source: 'cache' as const }));
    }

    // Check if request is pending
    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey)!;
    }

    // Create new request
    const promise = this.fetchAICompletions(context);
    this.pendingRequests.set(cacheKey, promise);

    try {
      const results = await promise;

      // Cache results
      this.cache.set(cacheKey, results);

      return results;
    } finally {
      this.pendingRequests.delete(cacheKey);
    }
  }

  /**
   * Fetch AI completions from provider
   */
  private async fetchAICompletions(
    context: AICompletionContext
  ): Promise<AICompletionResult[]> {
    const prompt = this.buildPrompt(context);

    switch (this.config.provider) {
      case 'ollama':
        return this.fetchFromOllama(prompt, context);
      case 'openai':
        return this.fetchFromOpenAI(prompt, context);
      case 'deepseek':
        return this.fetchFromDeepSeek(prompt, context);
      default:
        throw new Error(`Unknown provider: ${this.config.provider}`);
    }
  }

  /**
   * Build AI prompt
   */
  private buildPrompt(context: AICompletionContext): string {
    const { code, cursorPosition, language } = context;

    // Get code before cursor
    const lines = code.split('\n');
    const beforeCursor = lines
      .slice(0, cursorPosition.line)
      .join('\n')
      .concat(lines[cursorPosition.line - 1]?.substring(0, cursorPosition.column) || '');

    // Get code after cursor (for context)
    const afterCursor = lines[cursorPosition.line - 1]
      ?.substring(cursorPosition.column)
      .concat('\n')
      .concat(lines.slice(cursorPosition.line).join('\n'));

    return `
You are an expert ${language} programmer. Complete the following code:

\`\`\`${language}
${beforeCursor}[CURSOR]${afterCursor}
\`\`\`

Provide 3 intelligent code completions. Each completion should:
1. Be syntactically correct
2. Follow best practices
3. Be contextually appropriate
4. Be concise

Format: Return JSON array of completions:
[
  {
    "text": "completion text",
    "description": "what this does",
    "confidence": 0.9
  }
]
`;
  }

  /**
   * Fetch from Ollama
   */
  private async fetchFromOllama(
    prompt: string,
    context: AICompletionContext
  ): Promise<AICompletionResult[]> {
    const response = await fetch(this.config.baseURL || 'http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.config.model,
        prompt,
        stream: false,
        options: {
          temperature: this.config.temperature || 0.7,
          num_predict: this.config.maxTokens || 150,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const data = await response.json();
    return this.parseAIResponse(data.response);
  }

  /**
   * Fetch from OpenAI
   */
  private async fetchFromOpenAI(
    prompt: string,
    context: AICompletionContext
  ): Promise<AICompletionResult[]> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert code completion assistant.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: this.config.temperature || 0.7,
        max_tokens: this.config.maxTokens || 150,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '[]';
    return this.parseAIResponse(content);
  }

  /**
   * Fetch from DeepSeek
   */
  private async fetchFromDeepSeek(
    prompt: string,
    context: AICompletionContext
  ): Promise<AICompletionResult[]> {
    const response = await fetch(
      this.config.baseURL || 'https://api.deepseek.com/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          model: this.config.model,
          messages: [
            { role: 'system', content: 'You are a code completion expert.' },
            { role: 'user', content: prompt },
          ],
          temperature: this.config.temperature || 0.7,
          max_tokens: this.config.maxTokens || 150,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '[]';
    return this.parseAIResponse(content);
  }

  /**
   * Parse AI response
   */
  private parseAIResponse(response: string): AICompletionResult[] {
    try {
      // Try to extract JSON from response
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return parsed.map((item: any) => ({
          text: item.text || '',
          description: item.description,
          confidence: item.confidence || 0.7,
          source: 'ai' as const,
        }));
      }

      // Fallback: treat entire response as single completion
      return [
        {
          text: response.trim(),
          confidence: 0.5,
          source: 'ai' as const,
        },
      ];
    } catch (error) {
      console.error('Error parsing AI response:', error);
      return [];
    }
  }

  /**
   * Create Monaco completion item
   */
  private createMonacoCompletion(
    monaco: typeof Monaco,
    completion: AICompletionResult,
    position: Monaco.Position
  ): Monaco.languages.CompletionItem {
    return {
      label: completion.text.split('\n')[0] || completion.text,
      kind: monaco.languages.CompletionItemKind.Snippet,
      insertText: completion.text,
      documentation: completion.description
        ? {
            value: `**AI Suggestion** (${(completion.confidence * 100).toFixed(0)}%)\n\n${
              completion.description
            }`,
            isTrusted: true,
          }
        : undefined,
      detail: `⚡ AI (${completion.source})`,
      sortText: `0_ai_${completion.confidence}`,
      range: {
        startLineNumber: position.lineNumber,
        startColumn: position.column,
        endLineNumber: position.lineNumber,
        endColumn: position.column,
      },
    };
  }

  /**
   * Generate cache key
   */
  private generateCacheKey(context: AICompletionContext): string {
    const { code, cursorPosition } = context;

    // Use last 500 chars before cursor as key
    const lines = code.split('\n');
    const beforeCursor = lines
      .slice(Math.max(0, cursorPosition.line - 10), cursorPosition.line)
      .join('\n')
      .slice(-500);

    return `${beforeCursor}_${cursorPosition.line}_${cursorPosition.column}`;
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<AICompletionConfig>): void {
    this.config = { ...this.config, ...config };
    this.clearCache();
  }
}

// ============================================
// Factory
// ============================================

export function createAICompletionProvider(
  config: AICompletionConfig
): MonacoAICompletionProvider {
  return new MonacoAICompletionProvider(config);
}

// ============================================
// Usage Example
// ============================================

export const MONACO_AI_COMPLETION_EXAMPLE = `
// 📝 استخدام AI Completion مع Monaco

import * as monaco from 'monaco-editor';
import { createAICompletionProvider } from '@oqool/shared';

// Initialize provider
const aiProvider = createAICompletionProvider({
  provider: 'ollama',
  model: 'deepseek-coder',
  baseURL: 'http://localhost:11434',
  temperature: 0.7,
  maxTokens: 150
});

// Register with Monaco
aiProvider.register(monaco, 'typescript');
aiProvider.register(monaco, 'javascript');
aiProvider.register(monaco, 'python');

// أثناء الكتابة، سيظهر AI completions تلقائياً!
`;

export default MonacoAICompletionProvider;
