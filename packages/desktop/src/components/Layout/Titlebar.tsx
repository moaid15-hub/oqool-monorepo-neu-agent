import React from 'react';
import './Titlebar.css';

interface TitlebarProps {
  title?: string;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onClose?: () => void;
}

export const Titlebar: React.FC<TitlebarProps> = ({
  title = 'Oqool Desktop IDE',
  onMinimize,
  onMaximize,
  onClose,
}) => {
  return (
    <div className="titlebar">
      <div className="titlebar-drag-region">
        <div className="titlebar-left">
          <span className="app-icon">🎨</span>
          <span className="app-title">{title}</span>
        </div>

        <div className="titlebar-center">
          <div className="workspace-info">
            <span className="workspace-icon">📁</span>
            <span className="workspace-name">Workspace</span>
          </div>
        </div>

        <div className="titlebar-right">
          <button className="titlebar-control minimize" onClick={onMinimize} title="تصغير">
            −
          </button>
          <button className="titlebar-control maximize" onClick={onMaximize} title="تكبير">
            □
          </button>
          <button className="titlebar-control close" onClick={onClose} title="إغلاق">
            ×
          </button>
        </div>
      </div>
    </div>
  );
};
