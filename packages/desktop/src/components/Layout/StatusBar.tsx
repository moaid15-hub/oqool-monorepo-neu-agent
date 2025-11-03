import React from 'react';
import './StatusBar.css';

interface StatusBarProps {
  branch?: string;
  errors?: number;
  warnings?: number;
  language?: string;
  line?: number;
  column?: number;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  branch = 'main',
  errors = 0,
  warnings = 0,
  language = 'TypeScript',
  line = 1,
  column = 1,
}) => {
  return (
    <div className="status-bar">
      <div className="status-left">
        <div className="status-item git-branch">
          <span className="icon">🔀</span>
          <span>{branch}</span>
        </div>

        <div className="status-item">
          <span className="icon error">❌</span>
          <span>{errors}</span>
        </div>

        <div className="status-item">
          <span className="icon warning">⚠️</span>
          <span>{warnings}</span>
        </div>
      </div>

      <div className="status-right">
        <div className="status-item">
          <span>
            السطر {line}, العمود {column}
          </span>
        </div>

        <div className="status-item language">
          <span>{language}</span>
        </div>

        <div className="status-item encoding">
          <span>UTF-8</span>
        </div>

        <div className="status-item">
          <span className="icon">🔔</span>
        </div>
      </div>
    </div>
  );
};
