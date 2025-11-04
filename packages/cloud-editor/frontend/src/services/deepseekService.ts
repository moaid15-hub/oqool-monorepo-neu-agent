// packages/cloud-editor/frontend/src/services/deepseekService.ts
export class DeepSeekService {
  private apiKey: string;
  private baseURL: string = 'https://api.deepseek.com/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getCodeCompletion(prompt: string, context: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek-coder',
          messages: [
            {
              role: 'system',
              content:
                'You are an expert coding assistant. Provide helpful code completions and explanations in Arabic when needed.',
            },
            {
              role: 'user',
              content: `Context: ${context}\n\nCode: ${prompt}\n\nPlease provide a code completion:`,
            },
          ],
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        throw new Error(`DeepSeek API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('DeepSeek API error:', error);
      throw error;
    }
  }

  async explainCode(code: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek-coder',
          messages: [
            {
              role: 'user',
              content: `Please explain this code in Arabic:\n\n${code}`,
            },
          ],
          max_tokens: 300,
        }),
      });

      const data = await response.json();
      return data.choices[0]?.message?.content || 'Unable to explain code';
    } catch (error) {
      console.error('DeepSeek API error:', error);
      return 'Error explaining code';
    }
  }

  async generateCode(description: string, language: string = 'javascript'): Promise<string> {
    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek-coder',
          messages: [
            {
              role: 'system',
              content: `You are an expert ${language} developer. Generate clean, efficient code based on the user's description.`,
            },
            {
              role: 'user',
              content: `Generate ${language} code for: ${description}`,
            },
          ],
          max_tokens: 800,
        }),
      });

      const data = await response.json();
      return data.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('DeepSeek API error:', error);
      throw error;
    }
  }

  async fixCode(code: string, error: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek-coder',
          messages: [
            {
              role: 'system',
              content:
                'You are an expert debugging assistant. Fix the provided code and explain the issue in Arabic.',
            },
            {
              role: 'user',
              content: `Code with error:\n${code}\n\nError message:\n${error}\n\nPlease fix the code and explain the issue:`,
            },
          ],
          max_tokens: 600,
        }),
      });

      const data = await response.json();
      return data.choices[0]?.message?.content || 'Unable to fix code';
    } catch (error) {
      console.error('DeepSeek API error:', error);
      throw error;
    }
  }

  async optimizeCode(code: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek-coder',
          messages: [
            {
              role: 'system',
              content:
                'You are a code optimization expert. Improve the provided code for better performance, readability, and best practices.',
            },
            {
              role: 'user',
              content: `Please optimize this code and explain the improvements in Arabic:\n\n${code}`,
            },
          ],
          max_tokens: 700,
        }),
      });

      const data = await response.json();
      return data.choices[0]?.message?.content || 'Unable to optimize code';
    } catch (error) {
      console.error('DeepSeek API error:', error);
      throw error;
    }
  }
}
