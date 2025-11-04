import React, { useState } from 'react';
import { FileNode } from '../../../types';
import { getFileIcon } from '../../../utils';
import { FileTree } from './FileTree';
import './FileItem.css';

interface FileItemProps {
  node: FileNode;
  level: number;
  onClick: (node: FileNode) => void;
  onContextMenu?: (node: FileNode, e: React.MouseEvent) => void;
}

export const FileItem: React.FC<FileItemProps> = ({ node, level, onClick, onContextMenu }) => {
  const [expanded, setExpanded] = useState(node.expanded || false);

  const handleClick = () => {
    if (node.type === 'directory') {
      setExpanded(!expanded);
    }
    onClick(node);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onContextMenu) {
      onContextMenu(node, e);
    }
  };

  return (
    <div className="file-item">
      <div
        className={`file-item-label ${node.type}`}
        style={{ paddingLeft: `${level * 1.5 + 0.5}rem` }}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
      >
        {node.type === 'directory' && <span className="folder-arrow">{expanded ? '▼' : '▶'}</span>}
        <span className="file-icon">
          {node.type === 'directory' ? (expanded ? '📂' : '📁') : getFileIcon(node.name)}
        </span>
        <span className="file-name">{node.name}</span>
      </div>
      {node.type === 'directory' && expanded && node.children && (
        <FileTree
          nodes={node.children}
          onFileClick={onClick}
          onContextMenu={onContextMenu}
          level={level + 1}
        />
      )}
    </div>
  );
};
