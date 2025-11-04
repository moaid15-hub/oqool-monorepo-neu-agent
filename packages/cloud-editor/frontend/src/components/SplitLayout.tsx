import React, { useEffect, useRef, useState } from 'react';
import FileTree from './FileTree';
import Editor from './Editor';
import Notification from './Notification';
import { useNotifications } from '../hooks/useNotifications';
import Terminal from './Terminal';
import StatusBar from './StatusBar';
import './SplitLayout.css';

interface FileItem {
  name: string;
  type: 'file' | 'folder';
  children?: FileItem[];
  content?: string;
  path?: string;
}

const SplitLayout: React.FC = () => {
  const [code, setCode] = useState<string>('console.log("Hello VS Code!");');
  const [currentFile, setCurrentFile] = useState<FileItem | null>(null);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const { notifications, removeNotification, showSuccess, showInfo } = useNotifications();
  const cursorListenerRef = useRef<any>(null);

  useEffect(
    () => () => {
      cursorListenerRef.current?.dispose?.();
      cursorListenerRef.current = null;
    },
    []
  );

  const handleFileSelect = (file: FileItem) => {
    setCurrentFile(file);
    setCode(file.content || '// Empty file');
    setCursorPosition({ line: 1, column: 1 });
    showInfo(`File opened: ${file.name}`);
  };

  const handleSave = (fileName: string, content: string) => {
    showSuccess(`File saved: ${fileName}`);
    console.log(`Saving ${fileName}:`, content);
  };

  const handleRun = () => {
    showInfo('Running code...');
    setTimeout(() => showSuccess('Code executed successfully'), 1000);
  };

  const toggleMenu = (menuId: string) => {
    setOpenMenuId(openMenuId === menuId ? null : menuId);
  };

  const closeMenus = () => {
    setOpenMenuId(null);
  };

  const handleEditorMount = (editor: any) => {
    if (!editor) return;

    if (cursorListenerRef.current) {
      cursorListenerRef.current.dispose?.();
    }

    const position = editor.getPosition?.();
    if (position) {
      setCursorPosition({ line: position.lineNumber, column: position.column });
    }

    cursorListenerRef.current = editor.onDidChangeCursorPosition?.((event: any) => {
      setCursorPosition({
        line: event.position.lineNumber,
        column: event.position.column,
      });
    });

    editor.onDidDispose?.(() => {
      cursorListenerRef.current?.dispose?.();
      cursorListenerRef.current = null;
    });
  };

  const currentLanguage = getLanguageFromFile(currentFile?.name);
  const lineCount = currentFile ? code.split('\n').length : 0;
  const currentFilePath = currentFile?.path || currentFile?.name;

  return (
    <div className="vscode-layout" onClick={closeMenus}>
      <div className="top-bar">
        <div className="menu-bar">
          <div
            className={`menu-item ${openMenuId === 'file' ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              toggleMenu('file');
            }}
          >
            <span>File</span>
            <div className={`dropdown ${openMenuId === 'file' ? 'show' : ''}`}>
              <div className="dropdown-item">
                <span>New File</span>
                <span className="shortcut">Ctrl+N</span>
              </div>
              <div className="dropdown-item">
                <span>Open File...</span>
                <span className="shortcut">Ctrl+O</span>
              </div>
              <div className="dropdown-item">
                <span>Open Folder...</span>
                <span className="shortcut">Ctrl+K Ctrl+O</span>
              </div>
              <div className="dropdown-separator"></div>
              <div className="dropdown-item">
                <span>Save</span>
                <span className="shortcut">Ctrl+S</span>
              </div>
              <div className="dropdown-item">
                <span>Save As...</span>
                <span className="shortcut">Ctrl+Shift+S</span>
              </div>
              <div className="dropdown-separator"></div>
              <div className="dropdown-item">
                <span>Close Editor</span>
                <span className="shortcut">Ctrl+W</span>
              </div>
              <div className="dropdown-item">
                <span>Exit</span>
                <span className="shortcut">Ctrl+Q</span>
              </div>
            </div>
          </div>

          <div
            className={`menu-item ${openMenuId === 'edit' ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              toggleMenu('edit');
            }}
          >
            <span>Edit</span>
            <div className={`dropdown ${openMenuId === 'edit' ? 'show' : ''}`}>
              <div className="dropdown-item">
                <span>Undo</span>
                <span className="shortcut">Ctrl+Z</span>
              </div>
              <div className="dropdown-item">
                <span>Redo</span>
                <span className="shortcut">Ctrl+Y</span>
              </div>
              <div className="dropdown-separator"></div>
              <div className="dropdown-item">
                <span>Cut</span>
                <span className="shortcut">Ctrl+X</span>
              </div>
              <div className="dropdown-item">
                <span>Copy</span>
                <span className="shortcut">Ctrl+C</span>
              </div>
              <div className="dropdown-item">
                <span>Paste</span>
                <span className="shortcut">Ctrl+V</span>
              </div>
              <div className="dropdown-separator"></div>
              <div className="dropdown-item">
                <span>Find</span>
                <span className="shortcut">Ctrl+F</span>
              </div>
              <div className="dropdown-item">
                <span>Replace</span>
                <span className="shortcut">Ctrl+H</span>
              </div>
            </div>
          </div>

          <div
            className={`menu-item ${openMenuId === 'view' ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              toggleMenu('view');
            }}
          >
            <span>View</span>
            <div className={`dropdown ${openMenuId === 'view' ? 'show' : ''}`}>
              <div className="dropdown-item">
                <span>Command Palette</span>
                <span className="shortcut">Ctrl+Shift+P</span>
              </div>
              <div className="dropdown-separator"></div>
              <div className="dropdown-item">
                <span>Explorer</span>
                <span className="shortcut">Ctrl+Shift+E</span>
              </div>
              <div className="dropdown-item">
                <span>Search</span>
                <span className="shortcut">Ctrl+Shift+F</span>
              </div>
              <div className="dropdown-item">
                <span>Extensions</span>
                <span className="shortcut">Ctrl+Shift+X</span>
              </div>
              <div className="dropdown-separator"></div>
              <div className="dropdown-item">
                <span>Terminal</span>
                <span className="shortcut">Ctrl+`</span>
              </div>
            </div>
          </div>

          <div
            className={`menu-item ${openMenuId === 'go' ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              toggleMenu('go');
            }}
          >
            <span>Go</span>
            <div className={`dropdown ${openMenuId === 'go' ? 'show' : ''}`}>
              <div className="dropdown-item">
                <span>Back</span>
                <span className="shortcut">Ctrl+Alt+←</span>
              </div>
              <div className="dropdown-item">
                <span>Forward</span>
                <span className="shortcut">Ctrl+Alt+→</span>
              </div>
              <div className="dropdown-separator"></div>
              <div className="dropdown-item">
                <span>Go to File</span>
                <span className="shortcut">Ctrl+P</span>
              </div>
              <div className="dropdown-item">
                <span>Go to Line</span>
                <span className="shortcut">Ctrl+G</span>
              </div>
            </div>
          </div>
        </div>

        <div className="search-bar">
          <input type="text" placeholder="Search" />
        </div>

        <div className="language-selector">
          <select>
            <option value="en">English</option>
            <option value="ar">العربية</option>
            <option value="de">Deutsch</option>
          </select>
        </div>
      </div>

      <div className="notifications-container">
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            id={notification.id}
            message={notification.message}
            type={notification.type}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </div>

      <div className="main-container">
        <div className="sidebar">
          <div className="sidebar-icon active">📁</div>
          <div className="sidebar-icon">🔍</div>
          <div className="sidebar-icon">⚙️</div>
        </div>

        <div className="explorer">
          <div className="explorer-header">EXPLORER</div>
          <div className="explorer-content">
            <FileTree onFileSelect={handleFileSelect} />
          </div>
        </div>

        <div className="editor-area">
          <div className="tabs-bar">
            {currentFile && (
              <div className="tab active">
                <span>📄 {currentFile.name}</span>
                <button className="tab-close">×</button>
              </div>
            )}
          </div>
          <div className={`editor-content ${currentFile ? 'has-file' : ''}`}>
            {currentFile ? (
              <Editor
                code={code}
                onCodeChange={setCode}
                fileName={currentFile.name}
                onSave={handleSave}
                onRun={handleRun}
                onMount={handleEditorMount}
              />
            ) : (
              <div className="empty-editor">
                <div className="empty-icon">📝</div>
                <div className="empty-text">Open a file to start editing</div>
                <div className="empty-hint">Select a file from the Explorer</div>
              </div>
            )}
          </div>
        </div>

        <div className="chat-panel">
          <div className="chat-header">CHAT</div>
          <div className="chat-content">
            <div className="chat-title">Build with agent mode</div>
            <div className="chat-subtitle">AI responses may be inaccurate.</div>
          </div>
          <div className="chat-input-area">
            <textarea
              className="chat-input"
              placeholder="Add context (#), attachments (@), commands"
              rows={3}
            ></textarea>
            <div className="chat-buttons">
              <div className="agent-selector">
                <span>Agent</span>
                <select>
                  <option>Claude Sonnet 4.5</option>
                  <option>Claude Opus 4</option>
                  <option>ChatGPT-4</option>
                  <option>GPT-3.5 Turbo</option>
                  <option>DeepSeek V3</option>
                  <option>Gemini Pro</option>
                  <option>Llama 3</option>
                </select>
              </div>
              <button className="send-button">▶</button>
            </div>
          </div>
        </div>
      </div>

      <div className="terminal-panel">
        <Terminal />
      </div>

      <StatusBar
        currentFile={currentFilePath}
        language={currentLanguage}
        lineCount={lineCount}
        cursorPosition={cursorPosition}
        gitBranch="main"
        errors={0}
        warnings={0}
      />
    </div>
  );
};

export default SplitLayout;

const getLanguageFromFile = (fileName?: string): string => {
  if (!fileName) return 'Plain Text';

  const extension = fileName.split('.').pop()?.toLowerCase();
  const languageMap: { [key: string]: string } = {
    ts: 'TypeScript',
    tsx: 'TypeScript React',
    js: 'JavaScript',
    jsx: 'JavaScript React',
    py: 'Python',
    html: 'HTML',
    css: 'CSS',
    json: 'JSON',
    md: 'Markdown',
  };

  return languageMap[extension || ''] || 'Plain Text';
};
