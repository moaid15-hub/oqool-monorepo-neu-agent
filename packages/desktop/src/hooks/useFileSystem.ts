// src/hooks/useFileSystem.ts
import { useCallback } from 'react';

export interface FileInfo {
  name: string;
  path: string;
  isDirectory: boolean;
  size?: number;
  lastModified?: Date;
}

export const useFileSystem = () => {
  const openFile = useCallback(async () => {
    try {
      return await window.electron.fs.openFile();
    } catch (error) {
      console.error('Error opening file:', error);
      throw error;
    }
  }, []);

  const openFolder = useCallback(async () => {
    try {
      return await window.electron.fs.openFolder();
    } catch (error) {
      console.error('Error opening folder:', error);
      throw error;
    }
  }, []);

  const readDirectory = useCallback(async (path: string): Promise<FileInfo[]> => {
    try {
      return await window.electron.fs.readDirectory(path);
    } catch (error) {
      console.error('Error reading directory:', error);
      throw error;
    }
  }, []);

  const saveFile = useCallback(async (path: string, content: string) => {
    try {
      return await window.electron.fs.saveFile(path, content);
    } catch (error) {
      console.error('Error saving file:', error);
      throw error;
    }
  }, []);

  const saveFileAs = useCallback(async (defaultName: string, content: string) => {
    try {
      return await window.electron.fs.saveFileAs(defaultName, content);
    } catch (error) {
      console.error('Error saving file as:', error);
      throw error;
    }
  }, []);

  const newFile = useCallback(async () => {
    try {
      return await window.electron.fs.newFile();
    } catch (error) {
      console.error('Error creating new file:', error);
      throw error;
    }
  }, []);

  const newFolder = useCallback(async (parentPath: string, folderName: string) => {
    try {
      return await window.electron.fs.newFolder(parentPath, folderName);
    } catch (error) {
      console.error('Error creating new folder:', error);
      throw error;
    }
  }, []);

  const deleteFile = useCallback(async (path: string) => {
    try {
      return await window.electron.fs.deleteFile(path);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }, []);

  const renameFile = useCallback(async (oldPath: string, newName: string) => {
    try {
      return await window.electron.fs.renameFile(oldPath, newName);
    } catch (error) {
      console.error('Error renaming file:', error);
      throw error;
    }
  }, []);

  const copyFile = useCallback(async (sourcePath: string, destPath: string) => {
    try {
      return await window.electron.fs.copyFile(sourcePath, destPath);
    } catch (error) {
      console.error('Error copying file:', error);
      throw error;
    }
  }, []);

  const readFile = useCallback(async (path: string) => {
    try {
      return await window.electron.fs.readFile(path);
    } catch (error) {
      console.error('Error reading file:', error);
      throw error;
    }
  }, []);

  const exists = useCallback(async (path: string): Promise<boolean> => {
    try {
      return await window.electron.fs.exists(path);
    } catch (error) {
      console.error('Error checking file existence:', error);
      return false;
    }
  }, []);

  return {
    openFile,
    openFolder,
    readDirectory,
    saveFile,
    saveFileAs,
    newFile,
    newFolder,
    deleteFile,
    renameFile,
    copyFile,
    readFile,
    exists,
  };
};
