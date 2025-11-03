export interface Snapshot {
    id: string;
    name: string;
    description?: string;
    timestamp: number;
    files: SnapshotFile[];
    metadata: SnapshotMetadata;
    gitCommit?: string;
    tags: string[];
}
export interface SnapshotFile {
    path: string;
    content: string;
    hash: string;
    size: number;
}
export interface SnapshotMetadata {
    projectPath: string;
    totalFiles: number;
    totalSize: number;
    createdBy: string;
    version: string;
}
export interface Version {
    id: string;
    name: string;
    timestamp: number;
    changes: Change[];
    snapshot: string;
}
export interface Change {
    type: 'added' | 'modified' | 'deleted';
    path: string;
    oldContent?: string;
    newContent?: string;
    timestamp: number;
}
export interface DiffResult {
    file: string;
    changes: DiffChange[];
    additions: number;
    deletions: number;
    summary: string;
}
export interface DiffChange {
    type: 'add' | 'remove' | 'modify';
    lineNumber: number;
    oldLine?: string;
    newLine?: string;
}
export interface Backup {
    id: string;
    name: string;
    timestamp: number;
    path: string;
    size: number;
    compressed: boolean;
    cloud?: boolean;
    cloudUrl?: string;
}
export interface ConflictResolution {
    file: string;
    conflicts: Conflict[];
    suggestedResolution: string;
    confidence: number;
}
export interface Conflict {
    startLine: number;
    endLine: number;
    currentVersion: string;
    incomingVersion: string;
    type: 'content' | 'structure' | 'both';
}
export interface VersionAnalytics {
    totalVersions: number;
    totalSnapshots: number;
    totalBackups: number;
    averageChangesPerVersion: number;
    mostChangedFiles: FileStats[];
    timeline: TimelineEntry[];
    sizeGrowth: SizeGrowthData[];
}
export interface FileStats {
    path: string;
    changeCount: number;
    lastModified: number;
}
export interface TimelineEntry {
    timestamp: number;
    event: string;
    type: 'snapshot' | 'version' | 'backup' | 'rollback';
    description: string;
}
export interface SizeGrowthData {
    timestamp: number;
    size: number;
    fileCount: number;
}
export interface GuardianConfig {
    apiKey: string;
    projectPath: string;
    guardianPath?: string;
    autoBackup?: boolean;
    backupInterval?: number;
    maxSnapshots?: number;
    enableGit?: boolean;
    cloudBackup?: boolean;
}
export interface SmartSuggestion {
    type: 'optimization' | 'cleanup' | 'merge' | 'backup' | 'security';
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    action?: () => Promise<void>;
}
export declare class VersionGuardian {
    private anthropic;
    private config;
    private guardianPath;
    private snapshotsPath;
    private backupsPath;
    private historyPath;
    private autoBackupInterval?;
    constructor(config: GuardianConfig);
    init(): Promise<void>;
    createSnapshot(name: string, description?: string): Promise<Snapshot>;
    listSnapshots(): Promise<Snapshot[]>;
    deleteSnapshot(snapshotId: string): Promise<void>;
    rollback(snapshotId: string, options?: {
        backup?: boolean;
        gitTag?: string;
    }): Promise<void>;
    diff(snapshot1Id: string, snapshot2Id: string): Promise<DiffResult[]>;
    showDiff(snapshot1Id: string, snapshot2Id: string): Promise<void>;
    private computeDiff;
    createBackup(name: string, options?: {
        compress?: boolean;
        cloud?: boolean;
    }): Promise<Backup>;
    startAutoBackup(): void;
    stopAutoBackup(): void;
    restoreBackup(backupName: string): Promise<void>;
    private initGit;
    private createGitCommit;
    private createGitTag;
    getGitHistory(): Promise<any[]>;
    getChangeHistory(): Promise<TimelineEntry[]>;
    showHistory(limit?: number): Promise<void>;
    getFileHistory(filePath: string): Promise<Change[]>;
    showFileArchaeology(filePath: string): Promise<void>;
    private addToHistory;
    getAnalytics(): Promise<VersionAnalytics>;
    showAnalytics(): Promise<void>;
    resolveConflicts(file: string, conflicts: Conflict[]): Promise<ConflictResolution>;
    getSmartSuggestions(): Promise<SmartSuggestion[]>;
    showSuggestions(): Promise<void>;
    showTimeline(days?: number): Promise<void>;
    exportSnapshot(snapshotId: string, outputPath: string): Promise<void>;
    importSnapshot(importPath: string): Promise<Snapshot>;
    private scanProjectFiles;
    private loadSnapshot;
    private formatSize;
    private getEventIcon;
}
export declare function createVersionGuardian(config: GuardianConfig): VersionGuardian;
//# sourceMappingURL=version-guardian.d.ts.map