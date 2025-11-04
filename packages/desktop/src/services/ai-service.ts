const { ipcRenderer } = window.electron;

export type AIPersonality =
  | 'alex'
  | 'sarah'
  | 'mike'
  | 'guardian'
  | 'olivia'
  | 'tom'
  | 'emma'
  | 'max';

export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AICallOptions {
  personality: AIPersonality;
  messages: AIMessage[];
  maxTokens?: number;
  temperature?: number;
}

export interface AIStreamOptions extends AICallOptions {
  onChunk: (chunk: string) => void;
  onComplete: () => void;
  onError: (error: Error) => void;
}

export const aiService = {
  async call(options: AICallOptions): Promise<string> {
    const result = await ipcRenderer.invoke('ai:call', options);

    if (!result.success) {
      throw new Error(result.error);
    }

    return result.response;
  },

  async stream(options: AIStreamOptions): Promise<void> {
    const { onChunk, onComplete, onError, ...callOptions } = options;

    // Setup stream listeners
    const handleChunk = (_event: any, chunk: string) => {
      onChunk(chunk);
    };

    const handleComplete = () => {
      ipcRenderer.removeListener('ai:stream-chunk', handleChunk);
      ipcRenderer.removeListener('ai:stream-complete', handleComplete);
      ipcRenderer.removeListener('ai:stream-error', handleError);
      onComplete();
    };

    const handleError = (_event: any, error: string) => {
      ipcRenderer.removeListener('ai:stream-chunk', handleChunk);
      ipcRenderer.removeListener('ai:stream-complete', handleComplete);
      ipcRenderer.removeListener('ai:stream-error', handleError);
      onError(new Error(error));
    };

    ipcRenderer.on('ai:stream-chunk', handleChunk);
    ipcRenderer.on('ai:stream-complete', handleComplete);
    ipcRenderer.on('ai:stream-error', handleError);

    // Start streaming
    const result = await ipcRenderer.invoke('ai:stream', callOptions);

    if (!result.success) {
      handleError(null, result.error);
    }
  },

  async getInlineSuggestion(
    code: string,
    cursorPosition: number,
    language: string
  ): Promise<string> {
    const result = await ipcRenderer.invoke('ai:inline-suggest', {
      code,
      cursorPosition,
      language,
    });

    if (!result.success) {
      throw new Error(result.error);
    }

    return result.suggestion;
  },

  getPersonalities(): AIPersonality[] {
    return ['alex', 'sarah', 'mike', 'guardian', 'olivia', 'tom', 'emma', 'max'];
  },

  getPersonalityInfo(personality: AIPersonality): { name: string; description: string } {
    const personalities: Record<AIPersonality, { name: string; description: string }> = {
      alex: {
        name: 'Alex - المبرمج الصديق',
        description: 'مساعد شخصي ودود يساعدك في البرمجة بطريقة بسيطة ومريحة',
      },
      sarah: {
        name: 'Sarah - خبيرة الأكواد',
        description: 'خبيرة تقنية متخصصة في حل المشاكل المعقدة',
      },
      mike: {
        name: 'Mike - معلم البرمجة',
        description: 'معلم صبور يشرح المفاهيم البرمجية بطريقة تعليمية',
      },
      guardian: {
        name: 'Guardian - حارس الجودة',
        description: 'متخصص في مراجعة الكود وضمان الجودة والأمان',
      },
      olivia: {
        name: 'Olivia - مهندسة التصميم',
        description: 'خبيرة في تصميم واجهات المستخدم وتجربة المستخدم',
      },
      tom: {
        name: 'Tom - محلل الأداء',
        description: 'متخصص في تحسين الأداء وكفاءة الكود',
      },
      emma: {
        name: 'Emma - خبيرة الاختبار',
        description: 'متخصصة في كتابة الاختبارات وضمان جودة التطبيقات',
      },
      max: {
        name: 'Max - مهندس البنية',
        description: 'خبير في تصميم البنية التحتية وأنماط التصميم',
      },
    };

    return personalities[personality];
  },
};
