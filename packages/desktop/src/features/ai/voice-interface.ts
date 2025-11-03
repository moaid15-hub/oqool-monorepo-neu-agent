// Electron API types - defined in src/types/electron.d.ts

export interface VoiceCommand {
  text: string;
  intent: 'code' | 'navigate' | 'edit' | 'search' | 'git' | 'terminal' | 'help';
  parameters?: Record<string, any>;
  confidence: number;
}

export class VoiceInterface {
  private recognition: any;
  private isListening: boolean = false;
  private onCommandCallback?: (command: VoiceCommand) => void;

  constructor() {
    this.setupRecognition();
  }

  private setupRecognition(): void {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error('Speech recognition not supported');
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'ar-SA';

    this.recognition.onresult = (event: any) => {
      const last = event.results.length - 1;
      const transcript = event.results[last][0].transcript;
      const isFinal = event.results[last].isFinal;

      if (isFinal) {
        this.processCommand(transcript);
      }
    };

    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
    };

    this.recognition.onend = () => {
      if (this.isListening) {
        this.recognition.start();
      }
    };
  }

  startListening(onCommand: (command: VoiceCommand) => void): void {
    if (!this.recognition) {
      console.error('Speech recognition not available');
      return;
    }

    this.isListening = true;
    this.onCommandCallback = onCommand;
    this.recognition.start();

    console.log('Voice interface started');
  }

  stopListening(): void {
    if (!this.recognition) {return;}

    this.isListening = false;
    this.recognition.stop();

    console.log('Voice interface stopped');
  }

  private async processCommand(text: string): Promise<void> {
    console.log('Processing command:', text);

    const command = await this.parseCommand(text);

    if (this.onCommandCallback && command) {
      this.onCommandCallback(command);
    }
  }

  private async parseCommand(text: string): Promise<VoiceCommand | null> {
    const prompt = `حلل الأمر الصوتي التالي وحدد النية (intent) والمعاملات:

الأمر: "${text}"

النوايا المتاحة:
- code: كتابة أو توليد كود
- navigate: التنقل في الملفات
- edit: تعديل الكود
- search: البحث
- git: عمليات Git
- terminal: تشغيل أوامر Terminal
- help: المساعدة

أعطني JSON:
{
  "intent": "...",
  "parameters": {...},
  "confidence": 0.0-1.0
}`;

    try {
      const result = await window.electron.ipcRenderer.invoke('ai:call', prompt, 'sarah');

      if (result.success) {
        const parsed = this.extractJSON(result.response);

        if (parsed) {
          return {
            text,
            intent: parsed.intent,
            parameters: parsed.parameters || {},
            confidence: parsed.confidence || 0.5,
          };
        }
      }
    } catch (error) {
      console.error('Failed to parse command:', error);
    }

    return null;
  }

  private extractJSON(text: string): any {
    try {
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        return JSON.parse(match[0]);
      }
    } catch (error) {
      console.error('Failed to extract JSON:', error);
    }

    return null;
  }

  async executeCommand(command: VoiceCommand): Promise<void> {
    console.log('Executing command:', command);

    switch (command.intent) {
      case 'code':
        await this.handleCodeCommand(command);
        break;
      case 'navigate':
        await this.handleNavigateCommand(command);
        break;
      case 'edit':
        await this.handleEditCommand(command);
        break;
      case 'search':
        await this.handleSearchCommand(command);
        break;
      case 'git':
        await this.handleGitCommand(command);
        break;
      case 'terminal':
        await this.handleTerminalCommand(command);
        break;
      case 'help':
        await this.handleHelpCommand(command);
        break;
      default:
        console.warn('Unknown command intent:', command.intent);
    }
  }

  private async handleCodeCommand(command: VoiceCommand): Promise<void> {
    const prompt = `اكتب كود بناءً على: ${command.text}`;

    const result = await window.electron.ipcRenderer.invoke('ai:call', prompt, 'sarah');

    if (result.success) {
      window.dispatchEvent(
        new CustomEvent('voice:code-generated', {
          detail: { code: result.response },
        })
      );
    }
  }

  private async handleNavigateCommand(command: VoiceCommand): Promise<void> {
    window.dispatchEvent(
      new CustomEvent('voice:navigate', {
        detail: command.parameters,
      })
    );
  }

  private async handleEditCommand(command: VoiceCommand): Promise<void> {
    window.dispatchEvent(
      new CustomEvent('voice:edit', {
        detail: command.parameters,
      })
    );
  }

  private async handleSearchCommand(command: VoiceCommand): Promise<void> {
    window.dispatchEvent(
      new CustomEvent('voice:search', {
        detail: { query: command.parameters?.query || command.text },
      })
    );
  }

  private async handleGitCommand(command: VoiceCommand): Promise<void> {
    window.dispatchEvent(
      new CustomEvent('voice:git', {
        detail: command.parameters,
      })
    );
  }

  private async handleTerminalCommand(command: VoiceCommand): Promise<void> {
    window.dispatchEvent(
      new CustomEvent('voice:terminal', {
        detail: { command: command.parameters?.command || command.text },
      })
    );
  }

  private async handleHelpCommand(_command: VoiceCommand): Promise<void> {
    const helpText = `
الأوامر المتاحة:
- "اكتب دالة لـ..." - كتابة كود
- "افتح ملف..." - فتح ملف
- "ابحث عن..." - البحث
- "احفظ التغييرات" - حفظ
- "شغل git commit" - عمليات Git
- "شغل npm install" - أوامر Terminal
    `;

    window.dispatchEvent(
      new CustomEvent('voice:help', {
        detail: { help: helpText },
      })
    );
  }

  isSupported(): boolean {
    return !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
  }

  getListeningState(): boolean {
    return this.isListening;
  }
}
