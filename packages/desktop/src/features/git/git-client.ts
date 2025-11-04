const { ipcRenderer } = window.electron;

export interface GitStatus {
  branch: string;
  ahead: number;
  behind: number;
  staged: string[];
  modified: string[];
  untracked: string[];
  conflicted: string[];
}

export interface GitBranch {
  name: string;
  current: boolean;
}

export interface GitCommit {
  hash: string;
  author: string;
  email: string;
  date: Date;
  message: string;
  refs: string;
}

export const gitClient = {
  async status(workspacePath: string): Promise<GitStatus> {
    const result = await ipcRenderer.invoke('git:status', workspacePath);
    if (!result.success) {
      throw new Error(result.error);
    }
    return result.status;
  },

  async commit(workspacePath: string, message: string, files?: string[]): Promise<void> {
    const result = await ipcRenderer.invoke('git:commit', workspacePath, message, files);
    if (!result.success) {
      throw new Error(result.error);
    }
  },

  async push(workspacePath: string, remote?: string, branch?: string): Promise<void> {
    const result = await ipcRenderer.invoke('git:push', workspacePath, remote, branch);
    if (!result.success) {
      throw new Error(result.error);
    }
  },

  async pull(workspacePath: string, remote?: string, branch?: string): Promise<void> {
    const result = await ipcRenderer.invoke('git:pull', workspacePath, remote, branch);
    if (!result.success) {
      throw new Error(result.error);
    }
  },

  async diff(workspacePath: string, filePath?: string, staged?: boolean): Promise<string> {
    const result = await ipcRenderer.invoke('git:diff', workspacePath, filePath, staged);
    if (!result.success) {
      throw new Error(result.error);
    }
    return result.diff;
  },

  async branches(workspacePath: string): Promise<GitBranch[]> {
    const result = await ipcRenderer.invoke('git:branches', workspacePath);
    if (!result.success) {
      throw new Error(result.error);
    }
    return result.branches;
  },

  async createBranch(workspacePath: string, branchName: string, checkout?: boolean): Promise<void> {
    const result = await ipcRenderer.invoke(
      'git:create-branch',
      workspacePath,
      branchName,
      checkout
    );
    if (!result.success) {
      throw new Error(result.error);
    }
  },

  async checkout(workspacePath: string, branchName: string): Promise<void> {
    const result = await ipcRenderer.invoke('git:checkout', workspacePath, branchName);
    if (!result.success) {
      throw new Error(result.error);
    }
  },

  async deleteBranch(workspacePath: string, branchName: string, force?: boolean): Promise<void> {
    const result = await ipcRenderer.invoke('git:delete-branch', workspacePath, branchName, force);
    if (!result.success) {
      throw new Error(result.error);
    }
  },

  async log(workspacePath: string, limit?: number): Promise<GitCommit[]> {
    const result = await ipcRenderer.invoke('git:log', workspacePath, limit);
    if (!result.success) {
      throw new Error(result.error);
    }
    return result.commits;
  },

  async stage(workspacePath: string, files: string[]): Promise<void> {
    const result = await ipcRenderer.invoke('git:stage', workspacePath, files);
    if (!result.success) {
      throw new Error(result.error);
    }
  },

  async unstage(workspacePath: string, files: string[]): Promise<void> {
    const result = await ipcRenderer.invoke('git:unstage', workspacePath, files);
    if (!result.success) {
      throw new Error(result.error);
    }
  },

  async discard(workspacePath: string, files: string[]): Promise<void> {
    const result = await ipcRenderer.invoke('git:discard', workspacePath, files);
    if (!result.success) {
      throw new Error(result.error);
    }
  },
};
