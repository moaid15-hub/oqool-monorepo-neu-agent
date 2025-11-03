import type { Pattern, ErrorAnalysis, Strategy } from './self-learning-system.js';
export interface CloudPattern extends Pattern {
    userId?: string;
    shared: boolean;
    downloads: number;
    upvotes: number;
}
export interface CloudKnowledge {
    patterns: CloudPattern[];
    errors: ErrorAnalysis[];
    strategies: Strategy[];
    metadata: {
        totalUsers: number;
        totalProjects: number;
        lastUpdate: number;
    };
}
export interface SyncOptions {
    apiUrl?: string;
    userId?: string;
    autoSync?: boolean;
    shareMyLearning?: boolean;
}
export declare class CloudLearningSync {
    private apiUrl;
    private userId?;
    private autoSync;
    private shareMyLearning;
    constructor(options?: SyncOptions);
    uploadPattern(pattern: Pattern): Promise<void>;
    downloadCommunityKnowledge(task: string): Promise<CloudPattern[]>;
    getGlobalStats(): Promise<CloudKnowledge['metadata']>;
    getTopPatterns(category?: string, limit?: number): Promise<CloudPattern[]>;
    upvotePattern(patternId: string): Promise<void>;
    reportError(error: ErrorAnalysis): Promise<void>;
    getCommunityRecommendations(task: string): Promise<string[]>;
    sync(localPatterns: Pattern[]): Promise<CloudPattern[]>;
    enableSharing(): void;
    disableSharing(): void;
    getPrivacySettings(): {
        shareMyLearning: boolean;
        autoSync: boolean;
        userId?: string;
    };
}
export declare function createCloudLearningSync(options?: SyncOptions): CloudLearningSync;
export declare const CLOUD_LEARNING_INFO = "\n\uD83D\uDCE1 Cloud Learning Sync\n\n\uD83C\uDF0D How it works:\n1. Your successful projects (score > 90) are uploaded to community\n2. You download best practices from developers worldwide\n3. Everyone learns from everyone's experience\n\n\uD83D\uDD10 Privacy:\n- Only anonymized patterns are shared (no code)\n- You control what to share (on/off)\n- Your API key is never shared\n\n\u2601\uFE0F API Endpoints:\n- POST /learning/patterns          - Upload pattern\n- GET  /learning/patterns/search   - Search patterns\n- GET  /learning/patterns/top      - Top patterns\n- POST /learning/patterns/:id/upvote - Upvote\n- POST /learning/errors            - Report error\n- GET  /learning/stats             - Global stats\n\n\uD83D\uDE80 Commands:\n- oqool learn                      - View local stats\n- oqool learn --sync               - Sync with cloud\n- oqool learn --privacy            - Privacy settings\n- oqool learn --top                - Top community patterns\n\n\uD83C\uDF1F Benefits:\n- Learn from millions of projects worldwide\n- Avoid common mistakes others made\n- Share your expertise with the community\n- Collective intelligence improving together\n";
//# sourceMappingURL=cloud-learning-sync.d.ts.map