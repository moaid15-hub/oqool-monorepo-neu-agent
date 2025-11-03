"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupFileSystemHandlers = setupFileSystemHandlers;
const electron_1 = require("electron");
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
function setupFileSystemHandlers() {
    // ============================================
    // 1. فتح ملف واحد
    // ============================================
    electron_1.ipcMain.handle('fs:openFile', async () => {
        const result = await electron_1.dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [
                { name: 'All Files', extensions: ['*'] },
                { name: 'Text Files', extensions: ['txt', 'md'] },
                { name: 'Code Files', extensions: ['js', 'ts', 'jsx', 'tsx', 'py', 'java', 'cpp', 'c'] },
                { name: 'Web Files', extensions: ['html', 'css', 'scss', 'json'] },
            ]
        });
        if (result.canceled || result.filePaths.length === 0) {
            return null;
        }
        const filePath = result.filePaths[0];
        const content = await fs.readFile(filePath, 'utf-8');
        return {
            path: filePath,
            name: path.basename(filePath),
            content: content,
            size: (await fs.stat(filePath)).size,
        };
    });
    // ============================================
    // 2. فتح مجلد
    // ============================================
    electron_1.ipcMain.handle('fs:openFolder', async () => {
        const result = await electron_1.dialog.showOpenDialog({
            properties: ['openDirectory']
        });
        if (result.canceled || result.filePaths.length === 0) {
            return null;
        }
        const folderPath = result.filePaths[0];
        const files = await readDirectory(folderPath);
        return {
            path: folderPath,
            name: path.basename(folderPath),
            files: files,
        };
    });
    // ============================================
    // 3. قراءة محتويات مجلد
    // ============================================
    electron_1.ipcMain.handle('fs:readDirectory', async (_, dirPath) => {
        return await readDirectory(dirPath);
    });
    // ============================================
    // 4. حفظ ملف
    // ============================================
    electron_1.ipcMain.handle('fs:saveFile', async (_, filePath, content) => {
        try {
            await fs.writeFile(filePath, content, 'utf-8');
            return { success: true, path: filePath };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    });
    // ============================================
    // 5. حفظ باسم
    // ============================================
    electron_1.ipcMain.handle('fs:saveFileAs', async (_, defaultName, content) => {
        const result = await electron_1.dialog.showSaveDialog({
            defaultPath: defaultName,
            filters: [
                { name: 'All Files', extensions: ['*'] },
                { name: 'Text Files', extensions: ['txt', 'md'] },
                { name: 'JavaScript', extensions: ['js', 'jsx'] },
                { name: 'TypeScript', extensions: ['ts', 'tsx'] },
                { name: 'Python', extensions: ['py'] },
            ]
        });
        if (result.canceled || !result.filePath) {
            return null;
        }
        try {
            await fs.writeFile(result.filePath, content, 'utf-8');
            return {
                success: true,
                path: result.filePath,
                name: path.basename(result.filePath),
            };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    });
    // ============================================
    // 6. ملف جديد
    // ============================================
    electron_1.ipcMain.handle('fs:newFile', async () => {
        return {
            name: 'untitled.txt',
            content: '',
            isNew: true,
            path: null,
        };
    });
    // ============================================
    // 7. مجلد جديد
    // ============================================
    electron_1.ipcMain.handle('fs:newFolder', async (_, parentPath, folderName) => {
        const newFolderPath = path.join(parentPath, folderName);
        try {
            await fs.mkdir(newFolderPath, { recursive: true });
            return { success: true, path: newFolderPath };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    });
    // ============================================
    // 8. حذف ملف
    // ============================================
    electron_1.ipcMain.handle('fs:deleteFile', async (_, filePath) => {
        try {
            const stats = await fs.stat(filePath);
            if (stats.isDirectory()) {
                await fs.rm(filePath, { recursive: true, force: true });
            }
            else {
                await fs.unlink(filePath);
            }
            return { success: true };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    });
    // ============================================
    // 9. إعادة تسمية
    // ============================================
    electron_1.ipcMain.handle('fs:renameFile', async (_, oldPath, newName) => {
        try {
            const dir = path.dirname(oldPath);
            const newPath = path.join(dir, newName);
            await fs.rename(oldPath, newPath);
            return { success: true, newPath: newPath };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    });
    // ============================================
    // 10. نسخ ملف
    // ============================================
    electron_1.ipcMain.handle('fs:copyFile', async (_, sourcePath, destPath) => {
        try {
            await fs.copyFile(sourcePath, destPath);
            return { success: true, path: destPath };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    });
    // ============================================
    // 11. قراءة ملف
    // ============================================
    electron_1.ipcMain.handle('fs:readFile', async (_, filePath) => {
        try {
            const content = await fs.readFile(filePath, 'utf-8');
            const stats = await fs.stat(filePath);
            return {
                success: true,
                content: content,
                size: stats.size,
                modified: stats.mtime,
            };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    });
    // ============================================
    // 12. التحقق من وجود ملف
    // ============================================
    electron_1.ipcMain.handle('fs:exists', async (_, filePath) => {
        try {
            await fs.access(filePath);
            return true;
        }
        catch {
            return false;
        }
    });
}
// ============================================
// Helper Functions
// ============================================
async function readDirectory(dirPath) {
    try {
        const entries = await fs.readdir(dirPath, { withFileTypes: true });
        const files = [];
        for (const entry of entries) {
            // تجاهل الملفات المخفية و node_modules
            if (entry.name.startsWith('.') || entry.name === 'node_modules') {
                continue;
            }
            const fullPath = path.join(dirPath, entry.name);
            const stats = await fs.stat(fullPath);
            files.push({
                name: entry.name,
                path: fullPath,
                isDirectory: entry.isDirectory(),
                size: stats.size,
                modified: stats.mtime,
            });
        }
        // ترتيب: المجلدات أولاً ثم الملفات
        files.sort((a, b) => {
            if (a.isDirectory && !b.isDirectory)
                return -1;
            if (!a.isDirectory && b.isDirectory)
                return 1;
            return a.name.localeCompare(b.name);
        });
        return files;
    }
    catch (error) {
        console.error('Error reading directory:', error);
        return [];
    }
}
