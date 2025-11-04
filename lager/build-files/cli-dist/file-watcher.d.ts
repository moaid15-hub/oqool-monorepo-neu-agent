export interface FileChange {
    type: 'created' | 'modified' | 'deleted';
    path: string;
    timestamp: number;
}
export type FileChangeCallback = (change: FileChange) => void;
export declare class FileWatcher {
    private workingDirectory;
    private watchers;
    private callbacks;
    private fileStates;
    private ignorePatterns;
    constructor(workingDirectory: string);
    start(): Promise<void>;
    private watchDirectory;
    private shouldIgnore;
    private notifyChange;
    onChange(callback: FileChangeCallback): void;
    stop(): void;
    getStats(): {
        watchedDirectories: number;
        trackedFiles: number;
        callbacks: number;
    };
    addIgnorePattern(pattern: string): void;
    getTrackedFiles(): string[];
}
//# sourceMappingURL=file-watcher.d.ts.map