import { FileWatcher } from './file-watcher';

// Electron API types - defined in src/types/electron.d.ts

export interface WorkspaceConfig {
  name: string;
  path: string;
  folders: string[];
  settings: Record<string, any>;
  recentFiles: string[];
  openFiles: string[];
}

export class WorkspaceManager {
  private currentWorkspace: WorkspaceConfig | null = null;
  private fileWatcher: FileWatcher;
  private configPath: string | null = null;

  constructor() {
    this.fileWatcher = new FileWatcher();
  }

  async openWorkspace(path: string): Promise<void> {
    try {
      const configPath = `${path}/.oqool/workspace.json`;
      const configExists = await window.electron.ipcRenderer.invoke('fs:exists', configPath);

      if (configExists.success && configExists.exists) {
        await this.loadWorkspaceConfig(configPath);
      } else {
        await this.createNewWorkspace(path);
      }

      await this.fileWatcher.watch(path);

      this.setupWatcherHandlers();

      console.log('Workspace opened:', path);
    } catch (error) {
      console.error('Failed to open workspace:', error);
      throw error;
    }
  }

  async closeWorkspace(): Promise<void> {
    if (!this.currentWorkspace) {return;}

    await this.saveWorkspaceConfig();
    await this.fileWatcher.unwatch();

    this.currentWorkspace = null;
    this.configPath = null;

    console.log('Workspace closed');
  }

  private async loadWorkspaceConfig(configPath: string): Promise<void> {
    try {
      const result = await window.electron.ipcRenderer.invoke('fs:read', configPath);

      if (result.success) {
        this.currentWorkspace = JSON.parse(result.content);
        this.configPath = configPath;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Failed to load workspace config:', error);
      throw error;
    }
  }

  private async createNewWorkspace(path: string): Promise<void> {
    const name = path.split('/').pop() || 'Workspace';

    this.currentWorkspace = {
      name,
      path,
      folders: [],
      settings: {},
      recentFiles: [],
      openFiles: [],
    };

    this.configPath = `${path}/.oqool/workspace.json`;

    await this.saveWorkspaceConfig();
  }

  async saveWorkspaceConfig(): Promise<void> {
    if (!this.currentWorkspace || !this.configPath) {return;}

    try {
      const content = JSON.stringify(this.currentWorkspace, null, 2);
      const result = await window.electron.ipcRenderer.invoke('fs:write', this.configPath, content);

      if (!result.success) {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Failed to save workspace config:', error);
      throw error;
    }
  }

  updateSetting(key: string, value: any): void {
    if (!this.currentWorkspace) {return;}

    this.currentWorkspace.settings[key] = value;
    this.saveWorkspaceConfig();
  }

  getSetting(key: string): any {
    return this.currentWorkspace?.settings[key];
  }

  addRecentFile(filePath: string): void {
    if (!this.currentWorkspace) {return;}

    const recentFiles = this.currentWorkspace.recentFiles.filter((f) => f !== filePath);
    recentFiles.unshift(filePath);

    this.currentWorkspace.recentFiles = recentFiles.slice(0, 20);

    this.saveWorkspaceConfig();
  }

  getRecentFiles(): string[] {
    return this.currentWorkspace?.recentFiles || [];
  }

  setOpenFiles(files: string[]): void {
    if (!this.currentWorkspace) {return;}

    this.currentWorkspace.openFiles = files;
    this.saveWorkspaceConfig();
  }

  getOpenFiles(): string[] {
    return this.currentWorkspace?.openFiles || [];
  }

  private setupWatcherHandlers(): void {
    this.fileWatcher.on('add', (event) => {
      console.log('File added:', event.path);
      window.dispatchEvent(
        new CustomEvent('workspace:file-added', {
          detail: { path: event.path },
        })
      );
    });

    this.fileWatcher.on('change', (event) => {
      console.log('File changed:', event.path);
      window.dispatchEvent(
        new CustomEvent('workspace:file-changed', {
          detail: { path: event.path },
        })
      );
    });

    this.fileWatcher.on('unlink', (event) => {
      console.log('File deleted:', event.path);
      window.dispatchEvent(
        new CustomEvent('workspace:file-deleted', {
          detail: { path: event.path },
        })
      );
    });
  }

  getCurrentWorkspace(): WorkspaceConfig | null {
    return this.currentWorkspace;
  }

  getWorkspacePath(): string | null {
    return this.currentWorkspace?.path || null;
  }

  getWorkspaceName(): string | null {
    return this.currentWorkspace?.name || null;
  }

  isWorkspaceOpen(): boolean {
    return this.currentWorkspace !== null;
  }
}
