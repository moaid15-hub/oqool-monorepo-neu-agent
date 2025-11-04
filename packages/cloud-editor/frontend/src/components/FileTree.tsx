import React, { useState, useMemo } from 'react';

interface FileItem {
  name: string;
  type: 'file' | 'folder';
  children?: FileItem[];
  content?: string;
  size?: number;
  modified?: Date;
  path?: string;
}

interface FileTreeProps {
  onFileSelect: (file: FileItem) => void;
}

// وظيفة للحصول على أيقونة الملف حسب النوع
const getFileIcon = (fileName: string, isFolder: boolean, isOpen?: boolean): string => {
  if (isFolder) {
    return isOpen ? '📂' : '📁';
  }

  const extension = fileName.split('.').pop()?.toLowerCase();

  switch (extension) {
    case 'tsx':
    case 'jsx':
      return '⚛️';
    case 'ts':
    case 'js':
      return '📜';
    case 'css':
    case 'scss':
    case 'sass':
      return '🎨';
    case 'html':
      return '🌐';
    case 'json':
      return '📋';
    case 'md':
    case 'markdown':
      return '📝';
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'svg':
      return '🖼️';
    case 'pdf':
      return '📕';
    case 'zip':
    case 'rar':
      return '📦';
    case 'mp4':
    case 'avi':
    case 'mov':
      return '🎬';
    case 'mp3':
    case 'wav':
    case 'flac':
      return '🎵';
    case 'py':
      return '🐍';
    case 'java':
      return '☕';
    case 'php':
      return '🐘';
    case 'cpp':
    case 'c':
      return '⚙️';
    case 'dockerfile':
      return '🐳';
    case 'yml':
    case 'yaml':
      return '📄';
    case 'xml':
      return '📋';
    case 'sql':
      return '🗃️';
    default:
      return '📄';
  }
};

// وظيفة لتنسيق حجم الملف
const formatFileSize = (bytes?: number): string => {
  if (!bytes) return '';
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
};

// وظيفة لتنسيق تاريخ التعديل
const formatDate = (date?: Date): string => {
  if (!date) return '';
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return 'اليوم';
  if (days === 1) return 'أمس';
  if (days < 7) return `${days} أيام`;
  return date.toLocaleDateString('ar-SA');
};

const FileTree: React.FC<FileTreeProps> = ({ onFileSelect }) => {
  // بيانات الملفات المحسنة مع معلومات إضافية
  const [files, setFiles] = useState<FileItem[]>([
    {
      name: 'src',
      type: 'folder',
      path: 'src',
      children: [
        {
          name: 'components',
          type: 'folder',
          path: 'src/components',
          children: [
            {
              name: 'Editor.tsx',
              type: 'file',
              path: 'src/components/Editor.tsx',
              size: 8542,
              modified: new Date('2024-03-15'),
            },
            {
              name: 'FileTree.tsx',
              type: 'file',
              path: 'src/components/FileTree.tsx',
              size: 6234,
              modified: new Date('2024-03-14'),
            },
            {
              name: 'Terminal.tsx',
              type: 'file',
              path: 'src/components/Terminal.tsx',
              size: 4123,
              modified: new Date('2024-03-13'),
            },
            {
              name: 'Header.tsx',
              type: 'file',
              path: 'src/components/Header.tsx',
              size: 7890,
              modified: new Date('2024-03-16'),
            },
            {
              name: 'Sidebar.tsx',
              type: 'file',
              path: 'src/components/Sidebar.tsx',
              size: 3456,
              modified: new Date('2024-03-12'),
            },
          ],
        },
        {
          name: 'hooks',
          type: 'folder',
          path: 'src/hooks',
          children: [
            {
              name: 'useNotifications.ts',
              type: 'file',
              path: 'src/hooks/useNotifications.ts',
              size: 2341,
              modified: new Date('2024-03-11'),
            },
            {
              name: 'useTheme.ts',
              type: 'file',
              path: 'src/hooks/useTheme.ts',
              size: 1876,
              modified: new Date('2024-03-10'),
            },
          ],
        },
        {
          name: 'styles',
          type: 'folder',
          path: 'src/styles',
          children: [
            {
              name: 'index.css',
              type: 'file',
              path: 'src/styles/index.css',
              size: 15234,
              modified: new Date('2024-03-16'),
            },
            {
              name: 'components.css',
              type: 'file',
              path: 'src/styles/components.css',
              size: 8901,
              modified: new Date('2024-03-15'),
            },
            {
              name: 'variables.css',
              type: 'file',
              path: 'src/styles/variables.css',
              size: 3421,
              modified: new Date('2024-03-14'),
            },
          ],
        },
        {
          name: 'App.tsx',
          type: 'file',
          path: 'src/App.tsx',
          size: 1234,
          modified: new Date('2024-03-16'),
        },
        {
          name: 'main.tsx',
          type: 'file',
          path: 'src/main.tsx',
          size: 567,
          modified: new Date('2024-03-15'),
        },
        {
          name: 'utils.ts',
          type: 'file',
          path: 'src/utils.ts',
          size: 2890,
          modified: new Date('2024-03-13'),
        },
        {
          name: 'types.ts',
          type: 'file',
          path: 'src/types.ts',
          size: 1567,
          modified: new Date('2024-03-12'),
        },
      ],
    },
    {
      name: 'public',
      type: 'folder',
      path: 'public',
      children: [
        {
          name: 'index.html',
          type: 'file',
          path: 'public/index.html',
          size: 891,
          modified: new Date('2024-03-10'),
        },
        {
          name: 'favicon.ico',
          type: 'file',
          path: 'public/favicon.ico',
          size: 15086,
          modified: new Date('2024-03-09'),
        },
        {
          name: 'logo192.png',
          type: 'file',
          path: 'public/logo192.png',
          size: 5347,
          modified: new Date('2024-03-09'),
        },
      ],
    },
    {
      name: 'docs',
      type: 'folder',
      path: 'docs',
      children: [
        {
          name: 'README.md',
          type: 'file',
          path: 'docs/README.md',
          size: 4567,
          modified: new Date('2024-03-11'),
        },
        {
          name: 'CHANGELOG.md',
          type: 'file',
          path: 'docs/CHANGELOG.md',
          size: 2345,
          modified: new Date('2024-03-10'),
        },
      ],
    },
    {
      name: 'package.json',
      type: 'file',
      path: 'package.json',
      size: 2134,
      modified: new Date('2024-03-16'),
    },
    {
      name: 'tsconfig.json',
      type: 'file',
      path: 'tsconfig.json',
      size: 678,
      modified: new Date('2024-03-15'),
    },
    {
      name: 'vite.config.ts',
      type: 'file',
      path: 'vite.config.ts',
      size: 445,
      modified: new Date('2024-03-14'),
    },
    { name: '.env', type: 'file', path: '.env', size: 123, modified: new Date('2024-03-13') },
  ]);

  const [openFolders, setOpenFolders] = useState<Set<string>>(new Set(['src']));
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'list' | 'tree'>('tree');
  const [showHidden, setShowHidden] = useState<boolean>(false);

  // تصفية الملفات حسب البحث
  const filteredFiles = useMemo(() => {
    if (!searchQuery.trim()) return files;

    const filterItems = (items: FileItem[]): FileItem[] => {
      return items.reduce((acc: FileItem[], item) => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());

        if (item.type === 'folder' && item.children) {
          const filteredChildren = filterItems(item.children);
          if (filteredChildren.length > 0 || matchesSearch) {
            acc.push({
              ...item,
              children: filteredChildren,
            });
          }
        } else if (matchesSearch) {
          acc.push(item);
        }

        return acc;
      }, []);
    };

    return filterItems(files);
  }, [files, searchQuery]);

  const toggleFolder = (folderPath: string) => {
    const newOpenFolders = new Set(openFolders);
    if (newOpenFolders.has(folderPath)) {
      newOpenFolders.delete(folderPath);
    } else {
      newOpenFolders.add(folderPath);
    }
    setOpenFolders(newOpenFolders);
  };

  const handleFileSelect = (file: FileItem) => {
    if (file.type === 'file') {
      setSelectedFile(file.path || file.name);
      onFileSelect(file);
    }
  };

  const handleContextMenu = (e: React.MouseEvent, item: FileItem) => {
    e.preventDefault();
    // يمكن إضافة قائمة سياق هنا لاحقاً
    console.log('Context menu for:', item.name);
  };

  const renderFileTree = (items: FileItem[], level = 0, parentPath = '') => {
    return items
      .filter((item) => showHidden || !item.name.startsWith('.'))
      .map((item) => {
        const itemPath = item.path || `${parentPath}/${item.name}`;
        const isSelected = selectedFile === itemPath;
        const isOpen = openFolders.has(itemPath);
        const hasChildren = item.type === 'folder' && item.children && item.children.length > 0;

        return (
          <div key={itemPath} className="file-tree-node">
            <div
              className={`file-item modern-file-item ${isSelected ? 'selected' : ''} ${item.type === 'folder' ? 'folder' : 'file'}`}
              style={{ paddingRight: `${level * 20 + 12}px` }}
              onClick={() => {
                if (item.type === 'folder') {
                  toggleFolder(itemPath);
                } else {
                  handleFileSelect(item);
                }
              }}
              onContextMenu={(e) => handleContextMenu(e, item)}
            >
              <div className="file-item-content">
                <div className="file-item-left">
                  {hasChildren && (
                    <span className={`folder-toggle ${isOpen ? 'open' : ''}`}>▶️</span>
                  )}
                  <span className="file-icon">
                    {getFileIcon(item.name, item.type === 'folder', isOpen)}
                  </span>
                  <span className="file-name">{item.name}</span>
                </div>

                <div className="file-item-right">
                  {item.type === 'file' && item.size && (
                    <span className="file-size">{formatFileSize(item.size)}</span>
                  )}
                  {item.modified && (
                    <span className="file-modified" title={item.modified.toLocaleString('ar-SA')}>
                      {formatDate(item.modified)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {item.type === 'folder' && isOpen && item.children && (
              <div className="folder-children">
                {renderFileTree(item.children, level + 1, itemPath)}
              </div>
            )}
          </div>
        );
      });
  };

  return (
    <div className="modern-file-tree">
      {/* رأس شجرة الملفات */}
      <div className="file-tree-header">
        <div className="header-top">
          <h3 className="tree-title">
            <span className="title-icon">📁</span>
            المستكشف
          </h3>
          <div className="header-actions">
            <button
              className="header-btn"
              onClick={() => setViewMode(viewMode === 'tree' ? 'list' : 'tree')}
              title={viewMode === 'tree' ? 'عرض قائمة' : 'عرض شجري'}
            >
              {viewMode === 'tree' ? '📋' : '🌳'}
            </button>
            <button
              className="header-btn"
              onClick={() => setShowHidden(!showHidden)}
              title={showHidden ? 'إخفاء الملفات المخفية' : 'إظهار الملفات المخفية'}
            >
              {showHidden ? '�️' : '�'}
            </button>
            <button className="header-btn" title="ملف جديد">
              📄
            </button>
            <button className="header-btn" title="مجلد جديد">
              📁
            </button>
          </div>
        </div>

        {/* شريط البحث */}
        <div className="search-container">
          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="بحث في الملفات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button className="clear-search" onClick={() => setSearchQuery('')} title="مسح البحث">
                ✕
              </button>
            )}
          </div>
        </div>

        {/* إحصائيات */}
        <div className="tree-stats">
          <span className="stat-item">
            📁 {files.filter((f) => f.type === 'folder').length} مجلد
          </span>
          <span className="stat-item">📄 {files.filter((f) => f.type === 'file').length} ملف</span>
        </div>
      </div>

      {/* محتوى شجرة الملفات */}
      <div className="file-tree-content">
        {filteredFiles.length > 0 ? (
          <div className="files-container">{renderFileTree(filteredFiles)}</div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <div className="empty-message">
              {searchQuery ? 'لا توجد ملفات تطابق البحث' : 'لا توجد ملفات'}
            </div>
            {searchQuery && (
              <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
                مسح البحث
              </button>
            )}
          </div>
        )}
      </div>

      {/* حالة التحديد */}
      {selectedFile && (
        <div className="selection-status">
          <span className="selected-file">📄 {selectedFile.split('/').pop()}</span>
        </div>
      )}
    </div>
  );
};

export default FileTree;
