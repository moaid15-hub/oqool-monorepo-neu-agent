import React, { useState, useEffect, useRef } from 'react';
import MonacoEditor from '@monaco-editor/react';

interface EditorProps {
  code: string;
  onCodeChange: (code: string) => void;
  fileName: string;
  onSave: (fileName: string, content: string) => void;
  onRun: () => void;
  onMount?: (editor: any) => void;
}

const Editor: React.FC<EditorProps> = ({
  code,
  onCodeChange,
  fileName,
  onSave,
  onRun,
  onMount,
}) => {
  const [language, setLanguage] = useState<string>('typescript');
  const [showMinimap, setShowMinimap] = useState<boolean>(true);
  const [fontSize, setFontSize] = useState<number>(14);
  const [wordWrap, setWordWrap] = useState<'on' | 'off'>('on');
  const editorRef = useRef<any>(null);

  // تحديد لغة البرمجة تلقائياً بناءً على امتداد الملف
  useEffect(() => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    const languageMap: { [key: string]: string } = {
      ts: 'typescript',
      tsx: 'typescript',
      js: 'javascript',
      jsx: 'javascript',
      py: 'python',
      html: 'html',
      css: 'css',
      scss: 'scss',
      sass: 'sass',
      json: 'json',
      md: 'markdown',
      xml: 'xml',
      sql: 'sql',
      php: 'php',
      java: 'java',
      cpp: 'cpp',
      c: 'c',
    };
    const detectedLanguage = languageMap[extension || ''] || 'plaintext';
    setLanguage(detectedLanguage);
  }, [fileName]);

  const handleCodeChange = (value: string | undefined) => {
    const newCode = value || '';
    onCodeChange(newCode);
  };

  const handleSave = () => {
    onSave(fileName, code);
  };

  const handleRun = () => {
    onRun();
  };

  // اختصارات لوحة المفاتيح
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 's':
            event.preventDefault();
            handleSave();
            break;
          case 'r':
            event.preventDefault();
            handleRun();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [code, fileName]);

  return (
    <div className="vscode-editor">
      {/* شريط الأدوات البسيط */}
      <div className="editor-toolbar">
        <div className="toolbar-left">
          <button className="toolbar-btn" onClick={handleSave} title="Save (Ctrl+S)">
            <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
              <path d="M13.5 1h-11C2.22 1 2 1.22 2 1.5v13c0 .28.22.5.5.5h11c.28 0 .5-.22.5-.5v-13c0-.28-.22-.5-.5-.5zm-1 13h-9V2h9v12zM4 3h6v4H4V3zm1 1v2h4V4H5z" />
            </svg>
            <span>Save</span>
          </button>

          <button className="toolbar-btn" onClick={handleRun} title="Run (Ctrl+R)">
            <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
              <path d="M3 2v12l10-6z" />
            </svg>
            <span>Run</span>
          </button>
        </div>

        <div className="toolbar-center">
          <span className="file-name">{fileName}</span>
        </div>

        <div className="toolbar-right">
          <div className="settings-group">
            <label style={{ fontSize: '12px', marginRight: '8px' }}>Font Size:</label>
            <input
              type="range"
              min="10"
              max="24"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              style={{ width: '80px', marginRight: '8px' }}
            />
            <span style={{ fontSize: '12px', minWidth: '35px' }}>{fontSize}px</span>
          </div>

          <button
            className="toolbar-btn"
            onClick={() => setShowMinimap(!showMinimap)}
            title={showMinimap ? 'Hide Minimap' : 'Show Minimap'}
          >
            <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
              <path d="M2 2h5v12H2V2zm6 0h6v3H8V2zm0 4h6v3H8V6zm0 4h6v4H8v-4z" />
            </svg>
          </button>

          <button
            className="toolbar-btn"
            onClick={() => setWordWrap(wordWrap === 'on' ? 'off' : 'on')}
            title={wordWrap === 'on' ? 'Disable Word Wrap' : 'Enable Word Wrap'}
          >
            <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
              <path d="M2 3h12v2H2V3zm0 4h12v2H2V7zm0 4h8v2H2v-2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="monaco-editor-wrapper">
        <MonacoEditor
          height="100%"
          language={language}
          theme="vs-dark"
          value={code}
          onChange={handleCodeChange}
          onMount={(editor) => {
            editorRef.current = editor;
            onMount?.(editor);
          }}
          options={{
            fontSize: fontSize,
            minimap: { enabled: showMinimap },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: wordWrap,
            lineNumbers: 'on',
            suggestOnTriggerCharacters: true,
            quickSuggestions: true,
            contextmenu: true,
            mouseWheelZoom: true,
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            renderWhitespace: 'selection',
            bracketPairColorization: { enabled: true },
            guides: {
              bracketPairs: true,
              indentation: true,
            },
            padding: { top: 10, bottom: 10 },
          }}
        />
      </div>

      <style>{`
        .vscode-editor {
          display: flex;
          flex-direction: column;
          height: 100%;
          background: #1e1e1e;
        }

        .editor-toolbar {
          background: #2d2d2d;
          border-bottom: 1px solid #2d2d30;
          padding: 8px 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          min-height: 40px;
        }

        .toolbar-left,
        .toolbar-center,
        .toolbar-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .toolbar-center {
          flex: 1;
          justify-content: center;
        }

        .toolbar-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: transparent;
          border: 1px solid transparent;
          color: #cccccc;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 13px;
          transition: all 0.2s ease;
        }

        .toolbar-btn:hover {
          background: #3e3e42;
          border-color: #555;
        }

        .toolbar-btn:active {
          background: #094771;
        }

        .toolbar-btn svg {
          flex-shrink: 0;
        }

        .file-name {
          font-size: 13px;
          color: #cccccc;
          font-weight: 500;
        }

        .settings-group {
          display: flex;
          align-items: center;
          gap: 5px;
          color: #cccccc;
          padding: 0 10px;
          border-left: 1px solid #555;
        }

        .settings-group input[type="range"] {
          cursor: pointer;
        }

        .monaco-editor-wrapper {
          flex: 1;
          overflow: hidden;
        }

        @media (max-width: 768px) {
          .toolbar-btn span {
            display: none;
          }

          .settings-group label {
            display: none;
          }

          .settings-group {
            padding: 0 5px;
          }
        }
      `}</style>
    </div>
  );
};

export default Editor;
