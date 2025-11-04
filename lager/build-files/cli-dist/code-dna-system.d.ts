import { OqoolAPIClient } from './api-client.js';
export interface CodeDNA {
    id: string;
    filePath: string;
    hash: string;
    signature: CodeSignature;
    patterns: CodePattern[];
    metrics: CodeMetrics;
    style: CodingStyle;
    complexity: ComplexityProfile;
    quality: QualityMetrics;
    evolution: EvolutionHistory;
    timestamp: string;
    version: string;
}
export interface CodeSignature {
    authorFingerprint: string;
    styleFingerprint: string;
    complexityFingerprint: string;
    patternFingerprint: string;
    qualityFingerprint: string;
    uniqueIdentifier: string;
}
export interface CodePattern {
    id: string;
    name: string;
    type: 'structural' | 'behavioral' | 'stylistic' | 'logical';
    description: string;
    confidence: number;
    frequency: number;
    examples: string[];
    implications: string[];
    category: string;
    tags: string[];
}
export interface CodeMetrics {
    linesOfCode: number;
    cyclomaticComplexity: number;
    cognitiveComplexity: number;
    maintainabilityIndex: number;
    technicalDebt: number;
    duplication: number;
    testability: number;
    modularity: number;
    coupling: number;
    cohesion: number;
}
export interface CodingStyle {
    indentation: 'spaces' | 'tabs' | 'mixed';
    spacesAfterComma: number;
    spacesAfterSemicolon: number;
    maxLineLength: number;
    braceStyle: '1tbs' | 'allman' | 'stroustrup' | 'whitesmiths' | 'banner';
    quoteStyle: 'single' | 'double' | 'mixed';
    namingConvention: 'camelCase' | 'snake_case' | 'kebab-case' | 'PascalCase' | 'mixed';
    commentStyle: 'inline' | 'block' | 'javadoc' | 'mixed';
    functionSpacing: number;
    blankLines: number;
}
export interface ComplexityProfile {
    overall: 'low' | 'moderate' | 'high' | 'extreme';
    algorithmic: number;
    structural: number;
    logical: number;
    dataFlow: number;
    controlFlow: number;
    dependencies: number;
    inheritance: number;
    composition: number;
}
export interface QualityMetrics {
    readability: number;
    maintainability: number;
    reliability: number;
    efficiency: number;
    security: number;
    testability: number;
    documentation: number;
    consistency: number;
}
export interface EvolutionHistory {
    versions: CodeVersion[];
    mutations: Mutation[];
    adaptations: Adaptation[];
    lineage: string[];
    stability: number;
    maturity: number;
}
export interface CodeVersion {
    version: string;
    timestamp: string;
    changes: string[];
    author: string;
    signature: string;
    metrics: CodeMetrics;
}
export interface Mutation {
    id: string;
    type: 'refactor' | 'enhancement' | 'bugfix' | 'optimization' | 'feature';
    description: string;
    timestamp: string;
    impact: 'minor' | 'moderate' | 'major' | 'breaking';
    confidence: number;
}
export interface Adaptation {
    id: string;
    trigger: string;
    response: string;
    success: boolean;
    timestamp: string;
    performance: number;
}
export interface DNAAnalysis {
    dominant: string[];
    recessive: string[];
    hybrid: string[];
    mutations: MutationPoint[];
    chromosomes: CodeChromosome[];
    genes: CodeGene[];
    phenotype: CodePhenotype;
}
export interface MutationPoint {
    location: string;
    line: number;
    type: 'insertion' | 'deletion' | 'modification' | 'rearrangement';
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
}
export interface CodeChromosome {
    id: string;
    name: string;
    genes: CodeGene[];
    length: number;
    function: string;
    expression: number;
}
export interface CodeGene {
    id: string;
    name: string;
    sequence: string;
    function: string;
    expression: number;
    dominance: number;
    stability: number;
}
export interface CodePhenotype {
    traits: PhenotypeTrait[];
    behavior: string[];
    characteristics: string[];
    capabilities: string[];
    limitations: string[];
}
export interface PhenotypeTrait {
    name: string;
    value: string | number | boolean;
    heritability: number;
    influence: number;
}
export declare class CodeDNASystem {
    private apiClient;
    private workingDir;
    private dnaPath;
    constructor(apiClient: OqoolAPIClient, workingDir?: string);
    /**
     * تهيئة النظام
     */
    private initializeSystem;
    /**
     * استخراج DNA الكود
     */
    extractCodeDNA(filePath: string, content?: string): Promise<CodeDNA>;
    /**
     * تحليل AST
     */
    private parseAST;
    /**
     * استخراج الأنماط
     */
    private extractPatterns;
    /**
     * تحليل الأنماط النصية
     */
    private analyzeTextPatterns;
    /**
     * حساب المقاييس
     */
    private calculateMetrics;
    /**
     * حساب التعقيد المعرفي
     */
    private calculateCognitiveComplexity;
    /**
     * تحليل أسلوب البرمجة
     */
    private analyzeCodingStyle;
    /**
     * تحليل التعقيد
     */
    private analyzeComplexity;
    /**
     * تقييم الجودة
     */
    private assessQuality;
    /**
     * حساب قابلية القراءة
     */
    private calculateReadability;
    /**
     * حساب الموثوقية
     */
    private calculateReliability;
    /**
     * حساب الكفاءة
     */
    private calculateEfficiency;
    /**
     * حساب الأمان
     */
    private calculateSecurity;
    /**
     * حساب التوثيق
     */
    private calculateDocumentation;
    /**
     * حساب التناسق
     */
    private calculateConsistency;
    /**
     * بناء تاريخ التطور
     */
    private buildEvolutionHistory;
    /**
     * الحصول على تاريخ Git
     */
    private getGitHistory;
    /**
     * توليد توقيع الكود
     */
    private generateCodeSignature;
    /**
     * حفظ DNA
     */
    private saveDNA;
    /**
     * عرض ملخص DNA
     */
    private displayDNASummary;
    /**
     * مقارنة DNA ملفين
     */
    compareCodeDNA(file1: string, file2: string): Promise<{
        similarity: number;
        differences: string[];
        recommendations: string[];
    }>;
    /**
     * حساب التشابه
     */
    private calculateSimilarity;
    /**
     * تحديد الاختلافات
     */
    private identifyDifferences;
    /**
     * توليد التوصيات
     */
    private generateRecommendations;
    /**
     * حساب اختلاف الأسلوب
     */
    private calculateStyleDifference;
    /**
     * توليد معرف فريد
     */
    private generateId;
    /**
     * عرض جميع DNA المحفوظة
     */
    listCodeDNA(): Promise<void>;
}
export declare function createCodeDNASystem(apiClient: OqoolAPIClient, workingDir?: string): CodeDNASystem;
//# sourceMappingURL=code-dna-system.d.ts.map