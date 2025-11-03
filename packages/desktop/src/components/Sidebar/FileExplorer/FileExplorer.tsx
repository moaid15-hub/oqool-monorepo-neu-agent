import React from 'react';
import { useFileStore } from '../../../stores/file-store';
import { useEditorStore } from '../../../stores/editor-store';
import { fileService } from '../../../services/file-service';
import { FileNode as FileNodeType } from '../../../types';
import { getFileIcon } from '../../../utils';
import './FileExplorer.css';

export const FileExplorer: React.FC = () => {
  const { fileTree, toggleDirectory, isExpanded } = useFileStore();
  const { openFile } = useEditorStore();

  const handleFileClick = async (node: FileNodeType) => {
    if (node.type === 'directory') {
      toggleDirectory(node.path);
    } else {
      // Open file in editor
      try {
        const content = await fileService.readFile(node.path);
        const language = fileService.detectLanguage(node.name);
        openFile(node.path, content, language);
      } catch (error) {
        console.error('Error opening file:', error);
      }
    }
  };

  const renderNode = (node: FileNodeType, level: number = 0) => {
    const expanded = isExpanded(node.path);

    return (
      <div key={node.path} className="file-node">
        <div
          className={`file-node-label ${node.type}`}
          style={{ paddingLeft: `${level * 1.5}rem` }}
          onClick={() => handleFileClick(node)}
        >
          {node.type === 'directory' && (
            <span className="folder-icon">{expanded ? '📂' : '📁'}</span>
          )}
          {node.type === 'file' && <span className="file-icon">{getFileIcon(node.name)}</span>}
          <span className="file-name">{node.name}</span>
        </div>
        {node.type === 'directory' && expanded && node.children && (
          <div className="file-node-children">
            {node.children.map((child) => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="file-explorer">
      <div className="file-explorer-header">
        <h3>📁 المستكشف</h3>
      </div>
      <div className="file-explorer-content">
        {fileTree.length > 0 ? (
          fileTree.map((node) => renderNode(node))
        ) : (
          <div className="empty-explorer">
            <p>لا توجد ملفات</p>
            <button>فتح مجلد</button>
          </div>
        )}
      </div>
    </div>
  );
};
