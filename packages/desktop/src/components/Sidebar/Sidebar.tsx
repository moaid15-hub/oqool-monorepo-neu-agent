import { useState } from 'react';
import { useEditorStore } from '../../stores/editorStore';
import { FileTree } from '../FileTree/FileTree';
import {
  VscNewFile,
  VscNewFolder,
  VscChevronRight,
  VscChevronDown,
  VscFolder,
  VscFolderOpened,
} from 'react-icons/vsc';
import { SiTypescript, SiJavascript, SiCss3, SiJson, SiMarkdown, SiHtml5 } from 'react-icons/si';
import { VscFile } from 'react-icons/vsc';
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

interface SidebarProps {
  openedFolderPath?: string;
  onFileSelect?: (filePath: string) => void;
}

export function Sidebar({ openedFolderPath, onFileSelect }: SidebarProps) {
  const [expandedFolders, setExpandedFolders] = useState<string[]>(['src']);
  const openFile = useEditorStore((state) => state.openFile);
  const files = useEditorStore((state) => state.files);
  const activeFile = useEditorStore((state) => state.activeFile);

  const getFileIcon = (filename: string) => {
    if (filename.endsWith('.tsx') || filename.endsWith('.ts')) {
      return <SiTypescript color="#3178c6" size={16} />;
    }
    if (filename.endsWith('.jsx') || filename.endsWith('.js')) {
      return <SiJavascript color="#f7df1e" size={16} />;
    }
    if (filename.endsWith('.css')) {
      return <SiCss3 color="#1572b6" size={16} />;
    }
    if (filename.endsWith('.json')) {
      return <SiJson color="#5a5a5a" size={16} />;
    }
    if (filename.endsWith('.md')) {
      return <SiMarkdown color="#ffffff" size={16} />;
    }
    if (filename.endsWith('.html')) {
      return <SiHtml5 color="#e34c26" size={16} />;
    }
    return <VscFile color="#cccccc" size={16} />;
  };

  const toggleFolder = (folderName: string) => {
    setExpandedFolders((prev) =>
      prev.includes(folderName) ? prev.filter((name) => name !== folderName) : [...prev, folderName]
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

  const handleNewFile = () => {
    const fileName = prompt('Enter new file name:');
    if (fileName) {
      alert(`Creating new file: ${fileName}\nThis feature will be fully implemented soon!`);
    }
  };

  const handleNewFolder = () => {
    const folderName = prompt('Enter new folder name:');
    if (folderName) {
      alert(`Creating new folder: ${folderName}\nThis feature will be fully implemented soon!`);
    }
  };

  // If a folder is opened, show the FileTree instead of default structure
  if (openedFolderPath && onFileSelect) {
    return <FileTree rootPath={openedFolderPath} onFileSelect={onFileSelect} />;
  }

  // Default sidebar with hardcoded structure
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <span>EXPLORER</span>
        <div className="sidebar-header-actions">
          <button className="sidebar-action-btn" onClick={handleNewFile} title="New File">
            <VscNewFile size={16} />
          </button>
          <button className="sidebar-action-btn" onClick={handleNewFolder} title="New Folder">
            <VscNewFolder size={16} />
          </button>
        </div>
      </div>
      <div className="file-tree">
        <div className="project-name">OQOOL-IDE-FINAL</div>
        {fileStructure.map((item) => {
          if (isFolderItem(item)) {
            const isExpanded = expandedFolders.includes(item.name);
            return (
              <div key={item.name}>
                <div className="folder-item" onClick={() => toggleFolder(item.name)}>
                  <span className="folder-icon">
                    {isExpanded ? <VscChevronDown size={14} /> : <VscChevronRight size={14} />}
                  </span>
                  <span className="folder-emoji">
                    {isExpanded ? (
                      <VscFolderOpened color="#dcb67a" size={16} />
                    ) : (
                      <VscFolder color="#dcb67a" size={16} />
                    )}
                  </span>
                  <span className="folder-name">{item.name}</span>
                </div>
                {isExpanded &&
                  item.children.map((child) => (
                    <div
                      key={child.path}
                      className={`file-item ${activeFile?.path === child.path ? 'active' : ''}`}
                      onClick={() => handleFileClick(child)}
                    >
                      <span className="file-icon">{getFileIcon(child.name)}</span>
                      <span className="file-name">{child.name}</span>
                    </div>
                  ))}
              </div>
            );
          } else {
            return (
              <div
                key={item.path}
                className={`file-item root-file ${activeFile?.path === item.path ? 'active' : ''}`}
                onClick={() => handleFileClick(item)}
              >
                <span className="file-icon">{getFileIcon(item.name)}</span>
                <span className="file-name">{item.name}</span>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}
