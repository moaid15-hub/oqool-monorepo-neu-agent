import { useRef } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { useEditorStore } from '../../stores/editorStore';
import { VscClose } from 'react-icons/vsc';
import { SiTypescript, SiJavascript, SiCss3, SiJson, SiMarkdown, SiHtml5 } from 'react-icons/si';
import { VscFile } from 'react-icons/vsc';
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

  const handleTabClick = (file: (typeof files)[0]) => {
    openFile(file);
  };

  const handleCloseTab = (e: React.MouseEvent, path: string) => {
    e.stopPropagation();
    closeFile(path);
  };

  const getFileIcon = (filename: string) => {
    if (filename.endsWith('.tsx') || filename.endsWith('.ts')) {
      return <SiTypescript color="#3178c6" size={14} />;
    }
    if (filename.endsWith('.jsx') || filename.endsWith('.js')) {
      return <SiJavascript color="#f7df1e" size={14} />;
    }
    if (filename.endsWith('.css')) {
      return <SiCss3 color="#1572b6" size={14} />;
    }
    if (filename.endsWith('.json')) {
      return <SiJson color="#5a5a5a" size={14} />;
    }
    if (filename.endsWith('.md')) {
      return <SiMarkdown color="#ffffff" size={14} />;
    }
    if (filename.endsWith('.html')) {
      return <SiHtml5 color="#e34c26" size={14} />;
    }
    return <VscFile color="#cccccc" size={14} />;
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

  const getBreadcrumbs = () => {
    if (!activeFile) {return [];}
    const parts = activeFile.path.split('/').filter(Boolean);
    return parts;
  };

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
              title="Close"
            >
              <VscClose size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className="editor-breadcrumb">
        {getBreadcrumbs().map((part, index) => (
          <span key={index} className="breadcrumb-item">
            {index > 0 && <span className="breadcrumb-separator">›</span>}
            {part}
          </span>
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
