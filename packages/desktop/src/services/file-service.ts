const { ipcRenderer } = window.electron;

export interface FileInfo {
  name: string;
  path: string;
  type: 'file' | 'directory';
  size?: number;
  modified?: Date;
}

export const fileService = {
  async readFile(path: string): Promise<string> {
    const result = await ipcRenderer.invoke('fs:readFile', path);
    if (!result.success) {
      throw new Error(result.error);
    }
    return result.content;
  },

  async writeFile(path: string, content: string): Promise<void> {
    const result = await ipcRenderer.invoke('fs:writeFile', path, content);
    if (!result.success) {
      throw new Error(result.error);
    }
  },

  async readdir(path: string): Promise<FileInfo[]> {
    const result = await ipcRenderer.invoke('fs:readdir', path);
    if (!result.success) {
      throw new Error(result.error);
    }
    return result.files;
  },

  async mkdir(path: string): Promise<void> {
    const result = await ipcRenderer.invoke('fs:mkdir', path);
    if (!result.success) {
      throw new Error(result.error);
    }
  },

  async delete(path: string): Promise<void> {
    const result = await ipcRenderer.invoke('fs:delete', path);
    if (!result.success) {
      throw new Error(result.error);
    }
  },

  async rename(oldPath: string, newPath: string): Promise<void> {
    const result = await ipcRenderer.invoke('fs:rename', oldPath, newPath);
    if (!result.success) {
      throw new Error(result.error);
    }
  },

  async exists(path: string): Promise<boolean> {
    const result = await ipcRenderer.invoke('fs:exists', path);
    return result.exists;
  },

  async watchDirectory(
    path: string,
    callback: (event: string, path: string) => void
  ): Promise<void> {
    await ipcRenderer.invoke('fs:watch', path);

    // Listen for file change events
    ipcRenderer.on('fs:change', (_event, changeEvent, changePath) => {
      callback(changeEvent, changePath);
    });
  },

  detectLanguage(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase();
    const languageMap: Record<string, string> = {
      js: 'javascript',
      jsx: 'javascript',
      ts: 'typescript',
      tsx: 'typescript',
      py: 'python',
      java: 'java',
      cpp: 'cpp',
      c: 'c',
      cs: 'csharp',
      go: 'go',
      rs: 'rust',
      php: 'php',
      rb: 'ruby',
      swift: 'swift',
      kt: 'kotlin',
      html: 'html',
      css: 'css',
      scss: 'scss',
      sass: 'sass',
      less: 'less',
      json: 'json',
      xml: 'xml',
      yaml: 'yaml',
      yml: 'yaml',
      md: 'markdown',
      sql: 'sql',
      sh: 'shell',
      bash: 'shell',
      ps1: 'powershell',
      r: 'r',
      lua: 'lua',
      pl: 'perl',
    };

    return languageMap[ext || ''] || 'plaintext';
  },
};
