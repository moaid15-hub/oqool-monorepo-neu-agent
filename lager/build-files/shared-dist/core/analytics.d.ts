export interface UsageLog {
    command: string;
    timestamp: number;
    duration: number;
    success: boolean;
    error?: string;
}
export interface AnalyticsData {
    totalCommands: number;
    commandCounts: Record<string, number>;
    errorCounts: Record<string, number>;
    averageDuration: Record<string, number>;
    totalTimeSaved: number;
    firstUsed: number;
    lastUsed: number;
}
export interface Insights {
    productivity: string;
    mostUsed: string[];
    timesSaved: string;
    errorRate: number;
    recommendations: string[];
}
export declare class Analytics {
    private dataPath;
    private data;
    constructor(workingDirectory: string);
    private loadData;
    private saveData;
    trackUsage(log: UsageLog): Promise<void>;
    generateInsights(): Insights;
    showAnalytics(): Promise<void>;
    reset(): Promise<void>;
    exportData(format?: 'json' | 'csv'): Promise<string>;
    getData(): AnalyticsData;
}
export declare function createAnalytics(workingDirectory?: string): Analytics;
//# sourceMappingURL=analytics.d.ts.map