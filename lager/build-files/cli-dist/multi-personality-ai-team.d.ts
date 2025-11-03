import { OqoolAPIClient } from './api-client.js';
export interface AIPersonality {
    id: string;
    name: string;
    role: 'architect' | 'developer' | 'reviewer' | 'tester' | 'optimizer' | 'security' | 'documenter' | 'mentor';
    personality: string;
    expertise: string[];
    strengths: string[];
    weaknesses: string[];
    communicationStyle: 'formal' | 'casual' | 'technical' | 'friendly' | 'mentor';
    avatar?: string;
    bio: string;
    active: boolean;
    performance: {
        tasksCompleted: number;
        successRate: number;
        averageRating: number;
        lastActive: string;
    };
}
export interface AITeam {
    id: string;
    name: string;
    description: string;
    members: AIPersonality[];
    leader: string;
    projectType: string;
    complexity: 'simple' | 'moderate' | 'complex' | 'enterprise';
    createdAt: string;
    lastUsed: string;
    performance: TeamPerformance;
    preferences: TeamPreferences;
}
export interface TeamPerformance {
    overallScore: number;
    collaborationScore: number;
    efficiency: number;
    creativity: number;
    reliability: number;
    tasksCompleted: number;
    averageTime: number;
}
export interface TeamPreferences {
    communication: 'sync' | 'async' | 'hybrid';
    decisionMaking: 'consensus' | 'leader' | 'democratic';
    codeStyle: 'strict' | 'flexible' | 'adaptive';
    testingStrategy: 'comprehensive' | 'balanced' | 'minimal';
    documentationLevel: 'detailed' | 'standard' | 'minimal';
}
export interface TeamDiscussion {
    id: string;
    teamId: string;
    topic: string;
    messages: TeamMessage[];
    decision?: string;
    status: 'active' | 'resolved' | 'escalated';
    createdAt: string;
    resolvedAt?: string;
}
export interface TeamMessage {
    id: string;
    personalityId: string;
    personalityName: string;
    message: string;
    timestamp: string;
    type: 'proposal' | 'opinion' | 'question' | 'agreement' | 'disagreement' | 'solution';
    confidence: number;
    influence: number;
}
export declare class MultiPersonalityAITeam {
    private apiClient;
    private workingDir;
    private personalitiesPath;
    private teamsPath;
    constructor(apiClient: OqoolAPIClient, workingDir?: string);
    /**
     * تهيئة النظام
     */
    private initializeSystem;
    /**
     * التحقق من وجود الشخصيات الافتراضية
     */
    private hasDefaultPersonalities;
    /**
     * إنشاء الشخصيات الافتراضية
     */
    private createDefaultPersonalities;
    /**
     * إنشاء فريق AI جديد
     */
    createTeam(name: string, description: string, projectType: string, complexity?: AITeam['complexity']): Promise<AITeam>;
    /**
     * بدء نقاش فريق
     */
    startTeamDiscussion(teamId: string, topic: string, initialPrompt: string): Promise<TeamDiscussion>;
    /**
     * الحصول على رد الشخصية
     */
    private getPersonalityResponse;
    /**
     * بناء سياق الشخصية
     */
    private buildPersonalityContext;
    /**
     * تحديد نوع الرسالة
     */
    private determineMessageType;
    /**
     * حساب الثقة
     */
    private calculateConfidence;
    /**
     * حساب التأثير
     */
    private calculateInfluence;
    /**
     * عرض ملخص النقاش
     */
    private displayDiscussionSummary;
    /**
     * الحصول على الشخصيات المتاحة
     */
    private getAvailablePersonalities;
    /**
     * الحصول على فريق
     */
    private getTeam;
    /**
     * حفظ فريق
     */
    private saveTeam;
    /**
     * حفظ شخصية
     */
    private savePersonality;
    /**
     * حفظ نقاش
     */
    private saveDiscussion;
    /**
     * توليد معرف فريد
     */
    private generateId;
    /**
     * وصف الدور
     */
    private getRoleDescription;
    /**
     * تأخير
     */
    private delay;
    /**
     * عرض جميع الفرق
     */
    listTeams(): Promise<void>;
    /**
     * الحصول على جميع الفرق
     */
    getAllTeams(): Promise<AITeam[]>;
    /**
     * عرض الشخصيات المتاحة
     */
    listPersonalities(): Promise<void>;
}
export declare function createMultiPersonalityAITeam(apiClient: OqoolAPIClient, workingDir?: string): MultiPersonalityAITeam;
//# sourceMappingURL=multi-personality-ai-team.d.ts.map