import { ipcMain, dialog, BrowserWindow } from 'electron';
import * as fs from 'fs/promises';
import * as path from 'path';

interface FileInfo {
  name: string;
  path: string;
  isDirectory: boolean;
  size?: number;
  modified?: Date;
}

export function setupFileSystemHandlers() {
  // ============================================
  // 1. فتح ملف واحد
  // ============================================
  ipcMain.handle('fs:openFile', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [
        { name: 'All Files', extensions: ['*'] },
        { name: 'Text Files', extensions: ['txt', 'md'] },
        { name: 'Code Files', extensions: ['js', 'ts', 'jsx', 'tsx', 'py', 'java', 'cpp', 'c'] },
        { name: 'Web Files', extensions: ['html', 'css', 'scss', 'json'] },
      ],
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
  ipcMain.handle('fs:openFolder', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory'],
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
  ipcMain.handle('fs:readDirectory', async (_, dirPath: string) => {
    return await readDirectory(dirPath);
  });

  // ============================================
  // 4. حفظ ملف
  // ============================================
  ipcMain.handle('fs:saveFile', async (_, filePath: string, content: string) => {
    try {
      await fs.writeFile(filePath, content, 'utf-8');
      return { success: true, path: filePath };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  // ============================================
  // 5. حفظ باسم
  // ============================================
  ipcMain.handle('fs:saveFileAs', async (_, defaultName: string, content: string) => {
    const result = await dialog.showSaveDialog({
      defaultPath: defaultName,
      filters: [
        { name: 'All Files', extensions: ['*'] },
        { name: 'Text Files', extensions: ['txt', 'md'] },
        { name: 'JavaScript', extensions: ['js', 'jsx'] },
        { name: 'TypeScript', extensions: ['ts', 'tsx'] },
        { name: 'Python', extensions: ['py'] },
      ],
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
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  // ============================================
  // 6. ملف جديد
  // ============================================
  ipcMain.handle('fs:newFile', async () => {
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
  ipcMain.handle('fs:newFolder', async (_, parentPath: string, folderName: string) => {
    const newFolderPath = path.join(parentPath, folderName);

    try {
      await fs.mkdir(newFolderPath, { recursive: true });
      return { success: true, path: newFolderPath };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  // ============================================
  // 8. حذف ملف
  // ============================================
  ipcMain.handle('fs:deleteFile', async (_, filePath: string) => {
    try {
      const stats = await fs.stat(filePath);

      if (stats.isDirectory()) {
        await fs.rm(filePath, { recursive: true, force: true });
      } else {
        await fs.unlink(filePath);
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  // ============================================
  // 9. إعادة تسمية
  // ============================================
  ipcMain.handle('fs:renameFile', async (_, oldPath: string, newName: string) => {
    try {
      const dir = path.dirname(oldPath);
      const newPath = path.join(dir, newName);

      await fs.rename(oldPath, newPath);
      return { success: true, newPath: newPath };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  // ============================================
  // 10. نسخ ملف
  // ============================================
  ipcMain.handle('fs:copyFile', async (_, sourcePath: string, destPath: string) => {
    try {
      await fs.copyFile(sourcePath, destPath);
      return { success: true, path: destPath };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  // ============================================
  // 11. قراءة ملف
  // ============================================
  ipcMain.handle('fs:readFile', async (_, filePath: string) => {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const stats = await fs.stat(filePath);

      return {
        success: true,
        content: content,
        size: stats.size,
        modified: stats.mtime,
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  // ============================================
  // 12. التحقق من وجود ملف
  // ============================================
  ipcMain.handle('fs:exists', async (_, filePath: string) => {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  });
}

// ============================================
// Helper Functions
// ============================================

async function readDirectory(dirPath: string): Promise<FileInfo[]> {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    const files: FileInfo[] = [];

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
      if (a.isDirectory && !b.isDirectory) {return -1;}
      if (!a.isDirectory && b.isDirectory) {return 1;}
      return a.name.localeCompare(b.name);
    });

    return files;
  } catch (error) {
    console.error('Error reading directory:', error);
    return [];
  }
}
