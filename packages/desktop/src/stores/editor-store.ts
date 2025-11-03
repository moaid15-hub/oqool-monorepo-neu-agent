import { create } from 'zustand';

export interface EditorFile {
  path: string;
  content: string;
  language: string;
  isDirty: boolean;
  isActive: boolean;
}

interface EditorState {
  files: Map<string, EditorFile>;
  activeFile: string | null;
  openFile: (path: string, content: string, language: string) => void;
  closeFile: (path: string) => void;
  updateFile: (path: string, content: string) => void;
  setActiveFile: (path: string) => void;
  markDirty: (path: string, dirty: boolean) => void;
  getFile: (path: string) => EditorFile | undefined;
  getDirtyFiles: () => EditorFile[];
}

export const useEditorStore = create<EditorState>((set, get) => ({
  files: new Map(),
  activeFile: null,

  openFile: (path: string, content: string, language: string) => {
    set((state) => {
      const newFiles = new Map(state.files);

      // Mark all files as inactive
      newFiles.forEach((file) => {
        file.isActive = false;
      });

      // Add or update file
      newFiles.set(path, {
        path,
        content,
        language,
        isDirty: false,
        isActive: true,
      });

      return {
        files: newFiles,
        activeFile: path,
      };
    });
  },

  closeFile: (path: string) => {
    set((state) => {
      const newFiles = new Map(state.files);
      newFiles.delete(path);

      // If closing active file, set a new active file
      let newActiveFile = state.activeFile;
      if (state.activeFile === path) {
        const filesArray = Array.from(newFiles.keys());
        newActiveFile = filesArray.length > 0 ? filesArray[0] : null;
      }

      // Update active status
      if (newActiveFile) {
        const file = newFiles.get(newActiveFile);
        if (file) {
          file.isActive = true;
        }
      }

      return {
        files: newFiles,
        activeFile: newActiveFile,
      };
    });
  },

  updateFile: (path: string, content: string) => {
    set((state) => {
      const file = state.files.get(path);
      if (!file) {return state;}

      const newFiles = new Map(state.files);
      newFiles.set(path, {
        ...file,
        content,
        isDirty: true,
      });

      return { files: newFiles };
    });
  },

  setActiveFile: (path: string) => {
    set((state) => {
      const newFiles = new Map(state.files);

      // Mark all files as inactive
      newFiles.forEach((file) => {
        file.isActive = false;
      });

      // Mark target file as active
      const file = newFiles.get(path);
      if (file) {
        file.isActive = true;
      }

      return {
        files: newFiles,
        activeFile: path,
      };
    });
  },

  markDirty: (path: string, dirty: boolean) => {
    set((state) => {
      const file = state.files.get(path);
      if (!file) {return state;}

      const newFiles = new Map(state.files);
      newFiles.set(path, {
        ...file,
        isDirty: dirty,
      });

      return { files: newFiles };
    });
  },

  getFile: (path: string) => {
    return get().files.get(path);
  },

  getDirtyFiles: () => {
    return Array.from(get().files.values()).filter((file) => file.isDirty);
  },
}));
