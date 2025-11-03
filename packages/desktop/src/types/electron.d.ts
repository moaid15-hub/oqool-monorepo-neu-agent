// Electron Types
/// <reference lib="dom" />

export interface FileInfo {
  name: string;
  path: string;
  isDirectory: boolean;
  size?: number;
  lastModified?: Date;
}

export interface FileSystemAPI {
  openFile: () => Promise<any>;
  openFolder: () => Promise<any>;
  readDirectory: (path: string) => Promise<FileInfo[]>;
  saveFile: (path: string, content: string) => Promise<any>;
  saveFileAs: (defaultName: string, content: string) => Promise<any>;
  newFile: () => Promise<any>;
  newFolder: (parentPath: string, folderName: string) => Promise<any>;
  deleteFile: (path: string) => Promise<any>;
  renameFile: (oldPath: string, newName: string) => Promise<any>;
  copyFile: (sourcePath: string, destPath: string) => Promise<any>;
  readFile: (path: string) => Promise<any>;
  exists: (path: string) => Promise<boolean>;
}

export interface AIPersonality {
  id: string;
  name: string;
  emoji: string;
  description: string;
}

export interface AIAPI {
  sendMessage: (message: string, personality: string, model: string) => Promise<any>;
  getPersonalities: () => Promise<AIPersonality[]>;
  getModels: () => Promise<string[]>;
  godMode: (message: string, model: string) => Promise<any>;
}

export interface IpcRendererAPI {
  on: (channel: string, callback: (...args: any[]) => void) => void;
  once: (channel: string, callback: (...args: any[]) => void) => void;
  send: (channel: string, ...args: any[]) => void;
  invoke: (channel: string, ...args: any[]) => Promise<any>;
  removeListener: (channel: string, callback: (...args: any[]) => void) => void;
  removeAllListeners: (channel: string) => void;
}

declare global {
  interface Window {
    electron: {
      fs: FileSystemAPI;
      ai: AIAPI;
      ipcRenderer: IpcRendererAPI;
    };
  }
}

export {};
