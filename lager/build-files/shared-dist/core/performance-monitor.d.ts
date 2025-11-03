import { EventEmitter } from 'events';
export interface Metric {
    name: string;
    value: number;
    timestamp: number;
    tags?: Record<string, string>;
}
export interface PerformanceStats {
    cpu: number;
    memory: {
        used: number;
        total: number;
        percentage: number;
    };
    cache: {
        hitRate: number;
        size: number;
    };
    api: {
        avgResponseTime: number;
        errorRate: number;
    };
    hotspots: Array<{
        name: string;
        avgDuration: number;
        calls: number;
    }>;
}
export declare class PerformanceMonitor extends EventEmitter {
    private metrics;
    private timers;
    private workingDirectory;
    private saveInterval?;
    constructor(workingDirectory: string);
    record(name: string, value: number, tags?: Record<string, string>): void;
    startTimer(name: string): void;
    endTimer(name: string): number | null;
    track<T>(name: string, fn: () => Promise<T>): Promise<T>;
    getStats(): PerformanceStats;
    private save;
    start(): void;
    stop(): void;
    displayDashboard(): void;
}
export declare function getMonitor(workingDirectory?: string): PerformanceMonitor;
//# sourceMappingURL=performance-monitor.d.ts.map