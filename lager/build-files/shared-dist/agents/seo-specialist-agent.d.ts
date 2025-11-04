import { type AIProvider } from '../ai-gateway/index.js';
export interface SEOMetadata {
    page: string;
    title: string;
    description: string;
    keywords: string[];
    ogTags: {
        title: string;
        description: string;
        image: string;
        type: string;
    };
    twitterCard: {
        card: string;
        title: string;
        description: string;
        image: string;
    };
    canonical?: string;
    robots?: string;
}
export interface StructuredData {
    type: string;
    data: Record<string, any>;
    code: string;
}
export interface SEOResult {
    metadata: SEOMetadata[];
    structuredData: StructuredData[];
    sitemap: {
        urls: Array<{
            loc: string;
            changefreq: string;
            priority: number;
        }>;
        code: string;
    };
    robotsTxt: string;
    performance: {
        recommendations: string[];
        criticalIssues: string[];
    };
    accessibility: {
        score: number;
        issues: string[];
        fixes: string[];
    };
    mobileOptimization: string[];
    technicalSEO: {
        https: boolean;
        redirects: string[];
        canonicalization: string;
        hreflang?: string;
    };
    contentStrategy: string[];
    analytics: string[];
}
export declare class SEOSpecialistAgent {
    private aiAdapter;
    private provider;
    constructor(config: {
        deepseek?: string;
        claude?: string;
        openai?: string;
    }, provider?: AIProvider);
    optimize(specification: {
        siteName: string;
        siteUrl: string;
        description: string;
        pages: string[];
        industry: string;
        targetAudience: string;
        competitors?: string[];
        framework: string;
    }): Promise<SEOResult>;
    private generateMetadata;
    private generatePageMetadata;
    private generateStructuredData;
    private generateSchemaCode;
    private generateSitemap;
    private generateRobotsTxt;
    private analyzePerformance;
    private auditAccessibility;
    private getMobileOptimizations;
    private getTechnicalSEO;
    private createContentStrategy;
    private setupAnalytics;
    private callClaude;
    private parseJSON;
}
//# sourceMappingURL=seo-specialist-agent.d.ts.map