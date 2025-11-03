import React from 'react';

interface StatusBarProps {
  currentFile?: string;
  language?: string;
  lineCount?: number;
  cursorPosition?: { line: number; column: number };
  gitBranch?: string;
  errors?: number;
  warnings?: number;
}

const StatusBar: React.FC<StatusBarProps> = ({
  currentFile = 'No file selected',
  language = 'Plain Text',
  lineCount = 0,
  cursorPosition = { line: 1, column: 1 },
  gitBranch = 'main',
  errors = 0,
  warnings = 0,
}) => {
  return (
    <div className="status-bar app-status-bar">
      <div className="status-left">
        <div className="status-item git-branch">
          <span className="icon">🌿</span>
          {gitBranch}
        </div>

        {errors > 0 && (
          <div className="status-item">
            <span className="icon error">❌</span>
            {errors}
          </div>
        )}

        {warnings > 0 && (
          <div className="status-item">
            <span className="icon warning">⚠️</span>
            {warnings}
          </div>
        )}

        <div className="status-item">
          <span className="icon">📄</span>
          {currentFile.split('/').pop()}
        </div>
      </div>

      <div className="status-right">
        <div className="status-item language">{language.toUpperCase()}</div>

        <div className="status-item">
          LN {cursorPosition.line}, COL {cursorPosition.column}
        </div>

        <div className="status-item">{lineCount} Lines</div>

        <div className="status-item encoding">UTF-8</div>

        <div className="status-item">LF</div>
      </div>
    </div>
  );
};

export default StatusBar;
