import { useRef } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { useEditorStore } from '../../stores/editorStore';
import './Editor.css';

export function Editor() {
  const editorRef = useRef<any>(null);
  const activeFile = useEditorStore((state) => state.activeFile);
  const files = useEditorStore((state) => state.files);
  const openFile = useEditorStore((state) => state.openFile);
  const closeFile = useEditorStore((state) => state.closeFile);
  const updateContent = useEditorStore((state) => state.updateContent);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const handleEditorChange = (value: string | undefined) => {
    if (activeFile && value !== undefined) {
      updateContent(activeFile.path, value);
    }
  };

  const handleTabClick = (file: typeof files[0]) => {
    openFile(file);
  };

  const handleCloseTab = (e: React.MouseEvent, path: string) => {
    e.stopPropagation();
    closeFile(path);
  };

  const getFileIcon = (filename: string) => {
    if (filename.endsWith('.tsx') || filename.endsWith('.ts')) return '📘';
    if (filename.endsWith('.css')) return '🎨';
    if (filename.endsWith('.json')) return '📦';
    if (filename.endsWith('.md')) return '📄';
    return '📄';
  };

  if (!activeFile) {
    return (
      <div className="editor-empty">
        <div className="empty-state">
          <h2>🚀 Oqool IDE</h2>
          <p>Open a file from the sidebar to start coding</p>
          <div className="empty-features">
            <div>✨ Professional Monaco Editor</div>
            <div>⚡ Lightning Fast Performance</div>
            <div>🤖 AI-Powered Assistance</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="editor-container">
      <div className="editor-tabs">
        {files.map((file) => (
          <div
            key={file.path}
            className={`tab ${activeFile.path === file.path ? 'active' : ''}`}
            onClick={() => handleTabClick(file)}
          >
            <span className="tab-icon">{getFileIcon(file.name)}</span>
            <span className="tab-name">{file.name}</span>
            <button
              className="tab-close"
              onClick={(e) => handleCloseTab(e, file.path)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <div className="editor-wrapper">
        <MonacoEditor
          height="100%"
          language={activeFile.language}
          value={activeFile.content}
          theme="vs-dark"
          onMount={handleEditorDidMount}
          onChange={handleEditorChange}
          options={{
            fontSize: 14,
            fontFamily: 'Consolas, Monaco, "Courier New", monospace',
            minimap: { enabled: true },
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
            bracketPairColorization: { enabled: true },
            formatOnPaste: true,
            formatOnType: true,
            renderWhitespace: 'selection',
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            smoothScrolling: true,
            folding: true,
            guides: {
              bracketPairs: true,
              indentation: true,
            },
          }}
        />
      </div>
    </div>
  );
}
