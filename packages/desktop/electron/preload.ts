// electron/preload.ts
import { contextBridge, ipcRenderer } from 'electron';

// تعريف الأنواع
interface FileSystemAPI {
  openFile: () => Promise<any>;
  openFolder: () => Promise<any>;
  readDirectory: (path: string) => Promise<any>;
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

interface AIAPI {
  sendMessage: (message: string, personality: string, model: string) => Promise<any>;
  getPersonalities: () => Promise<any>;
  getModels: () => Promise<any>;
  godMode: (message: string, model: string) => Promise<any>;
}

interface IpcRendererAPI {
  on: (channel: string, callback: (...args: any[]) => void) => void;
  once: (channel: string, callback: (...args: any[]) => void) => void;
  send: (channel: string, ...args: any[]) => void;
  invoke: (channel: string, ...args: any[]) => Promise<any>;
  removeListener: (channel: string, callback: (...args: any[]) => void) => void;
  removeAllListeners: (channel: string) => void;
}

// Expose APIs to renderer
contextBridge.exposeInMainWorld('electron', {
  // File System API
  fs: {
    openFile: () => ipcRenderer.invoke('fs:openFile'),
    openFolder: () => ipcRenderer.invoke('fs:openFolder'),
    readDirectory: (path: string) => ipcRenderer.invoke('fs:readDirectory', path),
    saveFile: (path: string, content: string) => ipcRenderer.invoke('fs:saveFile', path, content),
    saveFileAs: (defaultName: string, content: string) =>
      ipcRenderer.invoke('fs:saveFileAs', defaultName, content),
    newFile: () => ipcRenderer.invoke('fs:newFile'),
    newFolder: (parentPath: string, folderName: string) =>
      ipcRenderer.invoke('fs:newFolder', parentPath, folderName),
    deleteFile: (path: string) => ipcRenderer.invoke('fs:deleteFile', path),
    renameFile: (oldPath: string, newName: string) =>
      ipcRenderer.invoke('fs:renameFile', oldPath, newName),
    copyFile: (sourcePath: string, destPath: string) =>
      ipcRenderer.invoke('fs:copyFile', sourcePath, destPath),
    readFile: (path: string) => ipcRenderer.invoke('fs:readFile', path),
    exists: (path: string) => ipcRenderer.invoke('fs:exists', path),
  } as FileSystemAPI,

  // AI API
  ai: {
    sendMessage: (message: string, personality: string, model: string) =>
      ipcRenderer.invoke('ai:sendMessage', message, personality, model),
    getPersonalities: () => ipcRenderer.invoke('ai:getPersonalities'),
    getModels: () => ipcRenderer.invoke('ai:getModels'),
    godMode: (message: string, model: string) => ipcRenderer.invoke('ai:godMode', message, model),
  } as AIAPI,

  // IPC Renderer API
  ipcRenderer: {
    on: (channel: string, callback: (...args: any[]) => void) => {
      ipcRenderer.on(channel, (_event, ...args) => callback(...args));
    },
    once: (channel: string, callback: (...args: any[]) => void) => {
      ipcRenderer.once(channel, (_event, ...args) => callback(...args));
    },
    send: (channel: string, ...args: any[]) => {
      ipcRenderer.send(channel, ...args);
    },
    invoke: (channel: string, ...args: any[]) => {
      return ipcRenderer.invoke(channel, ...args);
    },
    removeListener: (channel: string, callback: (...args: any[]) => void) => {
      ipcRenderer.removeListener(channel, callback);
    },
    removeAllListeners: (channel: string) => {
      ipcRenderer.removeAllListeners(channel);
    },
  } as IpcRendererAPI,
});

// Type definitions for window.electron
declare global {
  interface Window {
    electron: {
      fs: FileSystemAPI;
      ai: AIAPI;
      ipcRenderer: IpcRendererAPI;
    };
  }
}
