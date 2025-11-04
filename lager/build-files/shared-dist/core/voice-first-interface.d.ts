import { OqoolAPIClient } from './api-client.js';
export interface VoiceConfig {
    enabled: boolean;
    language: 'ar' | 'en' | 'mixed';
    voice: 'male' | 'female' | 'neutral';
    speed: number;
    pitch: number;
    volume: number;
    engine: 'google' | 'azure' | 'aws' | 'local';
    apiKey?: string;
    region?: string;
}
export interface VoiceCommand {
    id: string;
    text: string;
    intent: VoiceIntent;
    confidence: number;
    entities: VoiceEntity[];
    timestamp: string;
    processed: boolean;
    response?: string;
}
export interface VoiceIntent {
    type: 'create' | 'modify' | 'analyze' | 'execute' | 'search' | 'navigate' | 'configure' | 'help';
    action: string;
    parameters: Map<string, any>;
    urgency: 'low' | 'normal' | 'high';
    context: string;
}
export interface VoiceEntity {
    type: 'file' | 'function' | 'variable' | 'language' | 'command' | 'number' | 'path';
    value: string;
    confidence: number;
    start: number;
    end: number;
}
export interface VoiceSession {
    id: string;
    startTime: string;
    endTime?: string;
    commands: VoiceCommand[];
    transcript: string[];
    feedback: VoiceFeedback[];
    performance: SessionPerformance;
    preferences: VoicePreferences;
}
export interface VoiceFeedback {
    id: string;
    type: 'positive' | 'negative' | 'neutral' | 'correction';
    message: string;
    timestamp: string;
    accuracy: number;
}
export interface SessionPerformance {
    totalCommands: number;
    successfulCommands: number;
    averageResponseTime: number;
    accuracy: number;
    userSatisfaction: number;
}
export interface VoicePreferences {
    voiceCommands: string[];
    shortcuts: Map<string, string>;
    contextAwareness: boolean;
    autoComplete: boolean;
    errorTolerance: number;
}
export interface SpeechRecognition {
    provider: 'google' | 'azure' | 'aws' | 'whisper' | 'local';
    language: string;
    model: string;
    accuracy: number;
    latency: number;
}
export interface TextToSpeech {
    provider: 'google' | 'azure' | 'aws' | 'elevenlabs' | 'local';
    voice: string;
    language: string;
    speed: number;
    pitch: number;
    style: 'neutral' | 'conversational' | 'professional' | 'friendly';
}
export declare class VoiceFirstInterface {
    private apiClient;
    private workingDir;
    private config;
    private sessionsPath;
    private commandsPath;
    constructor(apiClient: OqoolAPIClient, workingDir?: string);
    /**
     * تحميل التكوين الافتراضي
     */
    private loadDefaultConfig;
    /**
     * تهيئة النظام
     */
    private initializeSystem;
    /**
     * بدء جلسة صوتية
     */
    startVoiceSession(): Promise<VoiceSession | null>;
    /**
     * بدء الاستماع للأوامر الصوتية
     */
    private startListening;
    /**
     * معالجة الأمر الصوتي
     */
    private processVoiceCommand;
    /**
     * تحليل النية من النص
     */
    private analyzeIntent;
    /**
     * استخراج الإجراء
     */
    private extractAction;
    /**
     * استخراج المعاملات
     */
    private extractParameters;
    /**
     * تحديد الإلحاح
     */
    private assessUrgency;
    /**
     * تحديد السياق
     */
    private determineContext;
    /**
     * استخراج الكيانات
     */
    private extractEntities;
    /**
     * تنفيذ الأمر الصوتي
     */
    private executeVoiceCommand;
    /**
     * معالجة أمر الإنشاء
     */
    private handleCreateCommand;
    /**
     * معالجة أمر التعديل
     */
    private handleModifyCommand;
    /**
     * معالجة أمر التحليل
     */
    private handleAnalyzeCommand;
    /**
     * معالجة أمر التنفيذ
     */
    private handleExecuteCommand;
    /**
     * معالجة أمر البحث
     */
    private handleSearchCommand;
    /**
     * معالجة أمر التنقل
     */
    private handleNavigateCommand;
    /**
     * معالجة أمر التكوين
     */
    private handleConfigureCommand;
    /**
     * معالجة أمر المساعدة
     */
    private handleHelpCommand;
    /**
     * تشغيل الرد الصوتي
     */
    private speakResponse;
    /**
     * التحقق من أدوات الصوت
     */
    private checkVoiceTools;
    /**
     * التحقق من الأمر
     */
    private checkCommand;
    /**
     * تحميل الأوامر الصوتية
     */
    private loadVoiceCommands;
    /**
     * حفظ الجلسة
     */
    private saveSession;
    /**
     * توليد معرف فريد
     */
    private generateId;
    /**
     * تكوين النظام الصوتي
     */
    configureVoice(config: Partial<VoiceConfig>): Promise<void>;
    /**
     * عرض جلسات الصوت
     */
    listVoiceSessions(): Promise<void>;
    /**
     * تدريب النظام الصوتي
     */
    trainVoiceSystem(): Promise<void>;
    /**
     * جمع عينات التدريب
     */
    private collectTrainingSamples;
    /**
     * تحسين نماذج النية
     */
    private improveIntentModels;
    /**
     * تحسين استخراج الكيانات
     */
    private improveEntityExtraction;
    /**
     * تحليل أنماط الكيانات
     */
    private analyzeEntityPatterns;
    /**
     * عرض إحصائيات الصوت
     */
    getVoiceStats(): Promise<void>;
}
export declare function createVoiceFirstInterface(apiClient: OqoolAPIClient, workingDir?: string): VoiceFirstInterface;
//# sourceMappingURL=voice-first-interface.d.ts.map