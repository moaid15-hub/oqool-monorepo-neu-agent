import React, { useState } from 'react';
import './FileTree.css';

interface FileNode {
  name: string;
  path: string;
  isDirectory: boolean;
  children?: FileNode[];
  isExpanded?: boolean;
}

interface FileTreeProps {
  rootPath: string;
  onFileSelect: (filePath: string) => void;
}

export const FileTree: React.FC<FileTreeProps> = ({ rootPath, onFileSelect }) => {
  const [tree, setTree] = useState<FileNode[]>([]);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (rootPath) {
      loadFolder(rootPath);
    }
  }, [rootPath]);

  const loadFolder = async (folderPath: string) => {
    setLoading(true);
    try {
      const result = await window.electron?.fs?.readDirectory(folderPath);
      if (result && Array.isArray(result)) {
        const nodes: FileNode[] = result
          .map((file: any) => ({
            name: file.name,
            path: file.path,
            isDirectory: file.isDirectory,
            children: file.isDirectory ? [] : undefined,
            isExpanded: false,
          }))
          .sort((a: FileNode, b: FileNode) => {
            // Directories first, then alphabetically
            if (a.isDirectory && !b.isDirectory) {return -1;}
            if (!a.isDirectory && b.isDirectory) {return 1;}
            return a.name.localeCompare(b.name);
          });
        setTree(nodes);
      }
    } catch (error) {
      console.error('Error loading folder:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFolder = async (node: FileNode, path: number[]) => {
    if (!node.isDirectory) {
      // It's a file, open it
      onFileSelect(node.path);
      return;
    }

    const newTree = [...tree];
    let current: any = newTree;

    // Navigate to the node
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]].children;
    }
    const targetNode = current[path[path.length - 1]];

    if (!targetNode.isExpanded) {
      // Expand: load children
      try {
        const result = await window.electron?.fs?.readDirectory(targetNode.path);
        if (result && Array.isArray(result)) {
          targetNode.children = result
            .map((file: any) => ({
              name: file.name,
              path: file.path,
              isDirectory: file.isDirectory,
              children: file.isDirectory ? [] : undefined,
              isExpanded: false,
            }))
            .sort((a: FileNode, b: FileNode) => {
              if (a.isDirectory && !b.isDirectory) {return -1;}
              if (!a.isDirectory && b.isDirectory) {return 1;}
              return a.name.localeCompare(b.name);
            });
        }
      } catch (error) {
        console.error('Error loading folder:', error);
      }
    }

    targetNode.isExpanded = !targetNode.isExpanded;
    setTree(newTree);
  };

  const renderNode = (node: FileNode, depth: number = 0, path: number[] = []) => {
    const icon = node.isDirectory ? (node.isExpanded ? '📂' : '📁') : getFileIcon(node.name);

    return (
      <div key={node.path}>
        <div
          className="file-tree-node"
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          onClick={() => toggleFolder(node, path)}
        >
          <span className="file-tree-icon">{icon}</span>
          <span className="file-tree-name">{node.name}</span>
        </div>
        {node.isExpanded && node.children && (
          <div className="file-tree-children">
            {node.children.map((child, index) => renderNode(child, depth + 1, [...path, index]))}
          </div>
        )}
      </div>
    );
  };

  const getFileIcon = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase();
    const iconMap: Record<string, string> = {
      js: '🟨',
      jsx: '⚛️',
      ts: '🔷',
      tsx: '⚛️',
      json: '📋',
      html: '🌐',
      css: '🎨',
      scss: '🎨',
      md: '📝',
      txt: '📄',
      py: '🐍',
      java: '☕',
      cpp: '⚙️',
      c: '⚙️',
      go: '🔵',
      rs: '🦀',
      php: '🐘',
      rb: '💎',
      sh: '🖥️',
      yaml: '📋',
      yml: '📋',
      xml: '📋',
      svg: '🖼️',
      png: '🖼️',
      jpg: '🖼️',
      jpeg: '🖼️',
      gif: '🖼️',
      pdf: '📕',
      zip: '🗜️',
      tar: '🗜️',
      gz: '🗜️',
    };
    return iconMap[ext || ''] || '📄';
  };

  if (!rootPath) {
    return (
      <div className="file-tree-empty">
        <p>لا يوجد مجلد مفتوح</p>
        <p style={{ fontSize: '11px', color: '#888' }}>ملف → فتح مجلد</p>
      </div>
    );
  }

  if (loading) {
    return <div className="file-tree-loading">جاري التحميل...</div>;
  }

  return (
    <div className="file-tree">
      <div className="file-tree-header">
        <span className="file-tree-title">المستكشف</span>
        <span className="file-tree-path" title={rootPath}>
          {rootPath.split('/').pop() || rootPath}
        </span>
      </div>
      <div className="file-tree-content">
        {tree.map((node, index) => renderNode(node, 0, [index]))}
      </div>
    </div>
  );
};
