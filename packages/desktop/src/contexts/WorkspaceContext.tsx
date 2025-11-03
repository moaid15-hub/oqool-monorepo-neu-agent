import React, { createContext, useContext, useState, ReactNode } from 'react';

interface WorkspaceContextType {
  workspacePath: string | null;
  setWorkspacePath: (path: string | null) => void;
  openFiles: string[];
  addOpenFile: (file: string) => void;
  removeOpenFile: (file: string) => void;
  activeFile: string | null;
  setActiveFile: (file: string | null) => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const WorkspaceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [workspacePath, setWorkspacePath] = useState<string | null>(null);
  const [openFiles, setOpenFiles] = useState<string[]>([]);
  const [activeFile, setActiveFile] = useState<string | null>(null);

  const addOpenFile = (file: string) => {
    if (!openFiles.includes(file)) {
      setOpenFiles([...openFiles, file]);
    }
    setActiveFile(file);
  };

  const removeOpenFile = (file: string) => {
    const newOpenFiles = openFiles.filter((f) => f !== file);
    setOpenFiles(newOpenFiles);

    if (activeFile === file) {
      setActiveFile(newOpenFiles.length > 0 ? newOpenFiles[0] : null);
    }
  };

  return (
    <WorkspaceContext.Provider
      value={{
        workspacePath,
        setWorkspacePath,
        openFiles,
        addOpenFile,
        removeOpenFile,
        activeFile,
        setActiveFile,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within WorkspaceProvider');
  }
  return context;
};
