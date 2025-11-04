import { OqoolAPIClient } from './api-client.js';
export interface CollectiveDecision {
    id: string;
    topic: string;
    question: string;
    options: DecisionOption[];
    participants: CollectiveParticipant[];
    consensus: DecisionConsensus;
    confidence: number;
    reasoning: string[];
    createdAt: string;
    resolvedAt?: string;
    status: 'open' | 'voting' | 'resolved' | 'implemented';
}
export interface DecisionOption {
    id: string;
    title: string;
    description: string;
    votes: number;
    confidence: Map<string, number>;
    pros: string[];
    cons: string[];
    impact: 'low' | 'medium' | 'high' | 'critical';
    complexity: 'simple' | 'moderate' | 'complex';
}
export interface CollectiveParticipant {
    id: string;
    name: string;
    type: 'ai' | 'human' | 'system';
    expertise: string[];
    influence: number;
    bias?: string;
    reliability: number;
}
export interface DecisionConsensus {
    winner?: string;
    score: number;
    agreement: number;
    confidence: number;
    reasoning: string[];
}
export interface IntelligenceCluster {
    id: string;
    name: string;
    topic: string;
    participants: CollectiveParticipant[];
    knowledgeBase: KnowledgeEntry[];
    patterns: Pattern[];
    insights: Insight[];
    accuracy: number;
    lastUpdated: string;
}
export interface KnowledgeEntry {
    id: string;
    content: string;
    source: string;
    confidence: number;
    tags: string[];
    timestamp: string;
    validated: boolean;
}
export interface Pattern {
    id: string;
    name: string;
    description: string;
    confidence: number;
    occurrences: number;
    examples: string[];
    implications: string[];
}
export interface Insight {
    id: string;
    type: 'trend' | 'correlation' | 'anomaly' | 'prediction' | 'optimization';
    title: string;
    description: string;
    confidence: number;
    impact: 'low' | 'medium' | 'high';
    actionItems: string[];
}
export interface SwarmIntelligence {
    id: string;
    topic: string;
    agents: SwarmAgent[];
    communication: CommunicationNetwork;
    decisions: CollectiveDecision[];
    performance: SwarmPerformance;
    evolution: EvolutionMetrics;
}
export interface SwarmAgent {
    id: string;
    name: string;
    role: string;
    expertise: string[];
    learningRate: number;
    adaptability: number;
    communication: number;
    decisionQuality: number;
}
export interface CommunicationNetwork {
    nodes: Map<string, CommunicationNode>;
    connections: Map<string, number>;
    efficiency: number;
}
export interface CommunicationNode {
    agentId: string;
    connections: string[];
    influence: number;
    centrality: number;
}
export interface SwarmPerformance {
    accuracy: number;
    speed: number;
    collaboration: number;
    innovation: number;
    reliability: number;
}
export interface EvolutionMetrics {
    generations: number;
    improvements: number;
    adaptations: number;
    survivalRate: number;
}
export declare class CollectiveIntelligenceSystem {
    private apiClient;
    private workingDir;
    private decisionsPath;
    private clustersPath;
    private swarmPath;
    constructor(apiClient: OqoolAPIClient, workingDir?: string);
    /**
     * تهيئة النظام
     */
    private initializeSystem;
    /**
     * إنشاء قرار جماعي
     */
    createCollectiveDecision(topic: string, question: string, options: Array<{
        title: string;
        description: string;
        pros: string[];
        cons: string[];
    }>): Promise<CollectiveDecision>;
    /**
     * جمع الآراء الجماعية
     */
    collectOpinions(decisionId: string): Promise<CollectiveDecision>;
    /**
     * الحصول على رأي AI
     */
    private getAIOpinion;
    /**
     * تحليل النتائج
     */
    private analyzeResults;
    /**
     * حساب درجة الخيار
     */
    private calculateOptionScore;
    /**
     * حساب درجة التوافق
     */
    private calculateConsensus;
    /**
     * بناء prompt للقرار
     */
    private buildDecisionPrompt;
    /**
     * تحليل رأي AI
     */
    private parseAIOpinion;
    /**
     * استخراج التقييمات من الرد
     */
    private extractEvaluations;
    /**
     * الحصول على رأي المطور البشري
     */
    private getHumanOpinion;
    /**
     * عرض نتائج القرار
     */
    private displayDecisionResults;
    /**
     * إنشاء مجموعة ذكاء
     */
    createIntelligenceCluster(name: string, topic: string, participants: CollectiveParticipant[]): Promise<IntelligenceCluster>;
    /**
     * إضافة معرفة للمجموعة
     */
    addKnowledge(clusterId: string, content: string, source: string, tags?: string[]): Promise<void>;
    /**
     * تحديث رؤى المجموعة
     */
    private updateClusterInsights;
    /**
     * استخراج الأنماط
     */
    private extractPatterns;
    /**
     * توليد الرؤى
     */
    private generateInsights;
    /**
     * حساب الدقة
     */
    private calculateAccuracy;
    /**
     * تقييم التأثير
     */
    private assessImpact;
    /**
     * تقييم التعقيد
     */
    private assessComplexity;
    /**
     * الحصول على قرار
     */
    private getDecision;
    /**
     * حفظ قرار
     */
    private saveDecision;
    /**
     * الحصول على مجموعة
     */
    private getCluster;
    /**
     * حفظ مجموعة
     */
    private saveCluster;
    /**
     * توليد معرف فريد
     */
    private generateId;
    /**
     * عرض جميع القرارات
     */
    listDecisions(): Promise<void>;
    /**
     * الحصول على جميع القرارات
     */
    getAllDecisions(): Promise<CollectiveDecision[]>;
    /**
     * عرض المجموعات الذكية
     */
    listClusters(): Promise<void>;
    /**
     * الحصول على جميع المجموعات
     */
    getAllClusters(): Promise<IntelligenceCluster[]>;
}
export declare function createCollectiveIntelligenceSystem(apiClient: OqoolAPIClient, workingDir?: string): CollectiveIntelligenceSystem;
//# sourceMappingURL=collective-intelligence.d.ts.map