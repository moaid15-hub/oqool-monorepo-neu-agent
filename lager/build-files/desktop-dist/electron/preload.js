"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// electron/preload.ts
const electron_1 = require("electron");
// Expose APIs to renderer
electron_1.contextBridge.exposeInMainWorld('electron', {
    // File System API
    fs: {
        openFile: () => electron_1.ipcRenderer.invoke('fs:openFile'),
        openFolder: () => electron_1.ipcRenderer.invoke('fs:openFolder'),
        readDirectory: (path) => electron_1.ipcRenderer.invoke('fs:readDirectory', path),
        saveFile: (path, content) => electron_1.ipcRenderer.invoke('fs:saveFile', path, content),
        saveFileAs: (defaultName, content) => electron_1.ipcRenderer.invoke('fs:saveFileAs', defaultName, content),
        newFile: () => electron_1.ipcRenderer.invoke('fs:newFile'),
        newFolder: (parentPath, folderName) => electron_1.ipcRenderer.invoke('fs:newFolder', parentPath, folderName),
        deleteFile: (path) => electron_1.ipcRenderer.invoke('fs:deleteFile', path),
        renameFile: (oldPath, newName) => electron_1.ipcRenderer.invoke('fs:renameFile', oldPath, newName),
        copyFile: (sourcePath, destPath) => electron_1.ipcRenderer.invoke('fs:copyFile', sourcePath, destPath),
        readFile: (path) => electron_1.ipcRenderer.invoke('fs:readFile', path),
        exists: (path) => electron_1.ipcRenderer.invoke('fs:exists', path),
    },
    // AI API
    ai: {
        sendMessage: (message, personality, model) => electron_1.ipcRenderer.invoke('ai:sendMessage', message, personality, model),
        getPersonalities: () => electron_1.ipcRenderer.invoke('ai:getPersonalities'),
        getModels: () => electron_1.ipcRenderer.invoke('ai:getModels'),
        godMode: (message, model) => electron_1.ipcRenderer.invoke('ai:godMode', message, model),
    },
});
