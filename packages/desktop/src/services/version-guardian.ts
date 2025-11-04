// Electron API types - defined in src/types/electron.d.ts

export interface Snapshot {
  id: string;
  timestamp: Date;
  description: string;
  files: Map<string, string>;
  metadata: {
    author?: string;
    reason?: string;
    tags?: string[];
  };
}

export class VersionGuardian {
  private snapshots: Map<string, Snapshot> = new Map();
  private autoSnapshotInterval: NodeJS.Timeout | null = null;
  private workspacePath: string;

  constructor(workspacePath: string) {
    this.workspacePath = workspacePath;
  }

  async createSnapshot(description: string, metadata?: Snapshot['metadata']): Promise<string> {
    const snapshotId = `snapshot-${Date.now()}`;
    const files = await this.captureWorkspaceState();

    const snapshot: Snapshot = {
      id: snapshotId,
      timestamp: new Date(),
      description,
      files,
      metadata: metadata || {},
    };

    this.snapshots.set(snapshotId, snapshot);

    console.log(`Snapshot created: ${snapshotId}`);

    return snapshotId;
  }

  async restoreSnapshot(snapshotId: string): Promise<void> {
    const snapshot = this.snapshots.get(snapshotId);

    if (!snapshot) {
      throw new Error(`Snapshot ${snapshotId} not found`);
    }

    const filesArray = Array.from(snapshot.files.entries());
    for (const [filePath, content] of filesArray) {
      try {
        const result = await window.electron.ipcRenderer.invoke('fs:write', filePath, content);

        if (!result.success) {
          console.error(`Failed to restore ${filePath}:`, result.error);
        }
      } catch (error) {
        console.error(`Error restoring ${filePath}:`, error);
      }
    }

    console.log(`Snapshot ${snapshotId} restored`);
  }

  async compareSnapshots(
    snapshotId1: string,
    snapshotId2: string
  ): Promise<Map<string, { before: string; after: string }>> {
    const snapshot1 = this.snapshots.get(snapshotId1);
    const snapshot2 = this.snapshots.get(snapshotId2);

    if (!snapshot1 || !snapshot2) {
      throw new Error('One or both snapshots not found');
    }

    const differences = new Map<string, { before: string; after: string }>();

    const keys1 = Array.from(snapshot1.files.keys());
    const keys2 = Array.from(snapshot2.files.keys());
    const allPaths = new Set([...keys1, ...keys2]);
    const allPathsArray = Array.from(allPaths);

    for (const filePath of allPathsArray) {
      const content1 = snapshot1.files.get(filePath) || '';
      const content2 = snapshot2.files.get(filePath) || '';

      if (content1 !== content2) {
        differences.set(filePath, {
          before: content1,
          after: content2,
        });
      }
    }

    return differences;
  }

  async getFileHistory(
    filePath: string
  ): Promise<Array<{ snapshotId: string; timestamp: Date; content: string }>> {
    const history: Array<{ snapshotId: string; timestamp: Date; content: string }> = [];

    const snapshotsArray = Array.from(this.snapshots.values());
    for (const snapshot of snapshotsArray) {
      const content = snapshot.files.get(filePath);

      if (content !== undefined) {
        history.push({
          snapshotId: snapshot.id,
          timestamp: snapshot.timestamp,
          content,
        });
      }
    }

    history.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    return history;
  }

  enableAutoSnapshot(intervalMinutes: number = 5): void {
    if (this.autoSnapshotInterval) {
      clearInterval(this.autoSnapshotInterval);
    }

    this.autoSnapshotInterval = setInterval(
      async () => {
        await this.createSnapshot('Auto-snapshot', {
          reason: 'automatic',
          tags: ['auto'],
        });
      },
      intervalMinutes * 60 * 1000
    );

    console.log(`Auto-snapshot enabled: every ${intervalMinutes} minutes`);
  }

  disableAutoSnapshot(): void {
    if (this.autoSnapshotInterval) {
      clearInterval(this.autoSnapshotInterval);
      this.autoSnapshotInterval = null;
      console.log('Auto-snapshot disabled');
    }
  }

  private async captureWorkspaceState(): Promise<Map<string, string>> {
    const files = new Map<string, string>();

    try {
      const result = await window.electron.ipcRenderer.invoke('fs:readdir', this.workspacePath);

      if (result.success) {
        await this.traverseDirectory(this.workspacePath, files);
      }
    } catch (error) {
      console.error('Failed to capture workspace state:', error);
    }

    return files;
  }

  private async traverseDirectory(dirPath: string, files: Map<string, string>): Promise<void> {
    const result = await window.electron.ipcRenderer.invoke('fs:readdir', dirPath);

    if (!result.success) {return;}

    for (const item of result.items) {
      if (item.name.startsWith('.')) {continue;}

      if (item.isDirectory) {
        await this.traverseDirectory(item.path, files);
      } else {
        try {
          const readResult = await window.electron.ipcRenderer.invoke('fs:read', item.path);

          if (readResult.success) {
            files.set(item.path, readResult.content);
          }
        } catch (error) {
          console.error(`Failed to read ${item.path}:`, error);
        }
      }
    }
  }

  getSnapshot(snapshotId: string): Snapshot | undefined {
    return this.snapshots.get(snapshotId);
  }

  getAllSnapshots(): Snapshot[] {
    return Array.from(this.snapshots.values()).sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
    );
  }

  deleteSnapshot(snapshotId: string): void {
    this.snapshots.delete(snapshotId);
  }

  exportSnapshot(snapshotId: string): string {
    const snapshot = this.snapshots.get(snapshotId);

    if (!snapshot) {
      throw new Error(`Snapshot ${snapshotId} not found`);
    }

    return JSON.stringify(
      {
        ...snapshot,
        files: Array.from(snapshot.files.entries()),
      },
      null,
      2
    );
  }

  importSnapshot(data: string): string {
    const parsed = JSON.parse(data);
    const snapshot: Snapshot = {
      ...parsed,
      files: new Map(parsed.files),
      timestamp: new Date(parsed.timestamp),
    };

    this.snapshots.set(snapshot.id, snapshot);

    return snapshot.id;
  }
}
