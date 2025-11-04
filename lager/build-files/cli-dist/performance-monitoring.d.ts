import { OqoolAPIClient } from './api-client.js';
export interface PerformanceMetrics {
    timestamp: string;
    responseTime: number;
    memoryUsage: number;
    cpuUsage: number;
    networkLatency: number;
    errorRate: number;
    throughput: number;
    activeConnections: number;
    databaseQueries: number;
    cacheHitRate: number;
    diskUsage: number;
    loadAverage: number;
}
export interface PerformanceAlert {
    id: string;
    type: 'warning' | 'error' | 'critical';
    message: string;
    value: number;
    threshold: number;
    timestamp: string;
    resolved: boolean;
    resolvedAt?: string;
}
export interface PerformanceReport {
    period: {
        start: string;
        end: string;
        duration: number;
    };
    summary: {
        averageResponseTime: number;
        averageMemoryUsage: number;
        averageCpuUsage: number;
        totalErrors: number;
        totalRequests: number;
        uptime: number;
        availability: number;
    };
    metrics: PerformanceMetrics[];
    alerts: PerformanceAlert[];
    recommendations: string[];
    trends: {
        responseTime: TrendData[];
        memoryUsage: TrendData[];
        cpuUsage: TrendData[];
        errorRate: TrendData[];
    };
}
export interface TrendData {
    timestamp: string;
    value: number;
    change: number;
    status: 'improving' | 'degrading' | 'stable';
}
export interface MonitoringConfig {
    enabled: boolean;
    interval: number;
    thresholds: {
        responseTime: number;
        memoryUsage: number;
        cpuUsage: number;
        errorRate: number;
        networkLatency: number;
    };
    alerts: {
        email: string[];
        webhook?: string;
        slack?: string;
    };
    endpoints: string[];
    database: {
        enabled: boolean;
        queries: boolean;
        slowQueries: number;
    };
    retention: {
        metrics: number;
        logs: number;
        reports: number;
    };
}
export interface ApplicationHealth {
    status: 'healthy' | 'degraded' | 'unhealthy';
    uptime: number;
    lastCheck: string;
    services: ServiceHealth[];
    metrics: PerformanceMetrics;
    issues: string[];
}
export interface ServiceHealth {
    name: string;
    status: 'up' | 'down' | 'degraded';
    responseTime: number;
    lastCheck: string;
    error?: string;
}
export declare class PerformanceMonitoring {
    private apiClient;
    private workingDir;
    private configPath;
    private metricsPath;
    private reportsPath;
    private alertsPath;
    private monitoringInterval?;
    constructor(apiClient: OqoolAPIClient, workingDir?: string);
    private initializeSystem;
    setupMonitoring(): Promise<void>;
    startMonitoring(): Promise<void>;
    stopMonitoring(): Promise<void>;
    private collectMetrics;
    private gatherSystemMetrics;
    private saveMetrics;
    private checkThresholds;
    showCurrentStatus(): Promise<void>;
    private calculateHealthStatus;
    private getLatestMetrics;
    generateReport(period?: 'day' | 'week' | 'month'): Promise<string>;
    private collectPerformanceData;
    private calculateSummary;
    private calculateUptime;
    private calculateAvailability;
    private analyzeTrends;
    private calculateTrendData;
    private generateRecommendations;
    private displayReportSummary;
    monitorApplication(url: string, duration?: number): Promise<void>;
    analyzePerformance(): Promise<void>;
    private analyzeHourlyPerformance;
    private analyzeDailyPerformance;
    private getMetricDisplayName;
    private saveMonitoringConfig;
    private loadMonitoringConfig;
    private saveAlert;
    private sendAlertNotification;
    private getActiveAlerts;
    private getMetricsInPeriod;
    private getAlertsInPeriod;
    private savePerformanceReport;
    private cleanupOldData;
}
export declare function createPerformanceMonitoring(apiClient: OqoolAPIClient, workingDir?: string): PerformanceMonitoring;
//# sourceMappingURL=performance-monitoring.d.ts.map