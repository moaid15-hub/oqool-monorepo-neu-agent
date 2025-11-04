import { useState } from 'react';
import { useEditorStore } from '../../stores/editorStore';
import './Sidebar.css';

interface FileItem {
  name: string;
  path: string;
  language: string;
  icon: string;
}

interface FolderItem {
  name: string;
  icon: string;
  children: FileItem[];
}

const fileStructure: (FolderItem | FileItem)[] = [
  {
    name: 'src',
    icon: '📁',
    children: [
      { name: 'welcome.tsx', path: '/src/welcome.tsx', language: 'typescript', icon: '📘' },
      { name: 'app.tsx', path: '/src/app.tsx', language: 'typescript', icon: '📘' },
      { name: 'App.css', path: '/src/App.css', language: 'css', icon: '🎨' },
    ],
  },
  { name: 'package.json', path: '/package.json', language: 'json', icon: '📦' },
  { name: 'tsconfig.json', path: '/tsconfig.json', language: 'json', icon: '⚙️' },
  { name: 'README.md', path: '/README.md', language: 'markdown', icon: '📄' },
];

export function Sidebar() {
  const [expandedFolders, setExpandedFolders] = useState<string[]>(['src']);
  const openFile = useEditorStore((state) => state.openFile);
  const files = useEditorStore((state) => state.files);
  const activeFile = useEditorStore((state) => state.activeFile);

  const toggleFolder = (folderName: string) => {
    setExpandedFolders((prev) =>
      prev.includes(folderName)
        ? prev.filter((name) => name !== folderName)
        : [...prev, folderName]
    );
  };

  const handleFileClick = (file: FileItem) => {
    const existingFile = files.find((f) => f.path === file.path);
    if (existingFile) {
      openFile(existingFile);
    } else {
      openFile({
        name: file.name,
        path: file.path,
        language: file.language,
        content: `// ${file.name}\n\n// Start coding here...`,
      });
    }
  };

  const isFolderItem = (item: FolderItem | FileItem): item is FolderItem => {
    return 'children' in item;
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">EXPLORER</div>
      <div className="file-tree">
        <div className="project-name">OQOOL-IDE-FINAL</div>
        {fileStructure.map((item) => {
          if (isFolderItem(item)) {
            const isExpanded = expandedFolders.includes(item.name);
            return (
              <div key={item.name}>
                <div
                  className="folder-item"
                  onClick={() => toggleFolder(item.name)}
                >
                  <span className="folder-icon">{isExpanded ? '▼' : '▶'}</span>
                  <span className="folder-emoji">{item.icon}</span>
                  <span className="folder-name">{item.name}</span>
                </div>
                {isExpanded &&
                  item.children.map((child) => (
                    <div
                      key={child.path}
                      className={`file-item ${
                        activeFile?.path === child.path ? 'active' : ''
                      }`}
                      onClick={() => handleFileClick(child)}
                    >
                      <span className="file-icon">{child.icon}</span>
                      <span className="file-name">{child.name}</span>
                    </div>
                  ))}
              </div>
            );
          } else {
            return (
              <div
                key={item.path}
                className={`file-item root-file ${
                  activeFile?.path === item.path ? 'active' : ''
                }`}
                onClick={() => handleFileClick(item)}
              >
                <span className="file-icon">{item.icon}</span>
                <span className="file-name">{item.name}</span>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}
