import React from 'react';
import { useEditorStore } from '../../stores/editor-store';
import { getFileName, getFileIcon } from '../../utils';
import './EditorTabs.css';

export const EditorTabs: React.FC = () => {
  const { files, setActiveFile, closeFile } = useEditorStore();
  const openFiles = Array.from(files.values());

  const handleClose = (e: React.MouseEvent, path: string) => {
    e.stopPropagation();
    closeFile(path);
  };

  return (
    <div className="editor-tabs">
      {openFiles.map((file) => (
        <div
          key={file.path}
          className={`tab ${file.isActive ? 'active' : ''} ${file.isDirty ? 'dirty' : ''}`}
          onClick={() => setActiveFile(file.path)}
        >
          <span className="tab-icon">{getFileIcon(file.path)}</span>
          <span className="tab-name">{getFileName(file.path)}</span>
          {file.isDirty && <span className="tab-dirty-indicator">●</span>}
          <button className="tab-close" onClick={(e) => handleClose(e, file.path)} title="إغلاق">
            ×
          </button>
        </div>
      ))}
    </div>
  );
};
