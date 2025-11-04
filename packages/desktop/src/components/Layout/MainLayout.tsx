import React, { useState } from 'react';
import { FileExplorer } from '../Sidebar/FileExplorer';
import { Editor, EditorTabs } from '../Editor';
import { TerminalPanel } from '../Terminal';
import { AIPanel } from '../AI';
import TopBar from './TopBar';
import './MainLayout.css';

export const MainLayout: React.FC = () => {
  const [leftSidebarWidth] = useState(250);
  const [rightSidebarWidth] = useState(300);
  const [terminalHeight] = useState(200);
  const [showRightSidebar, setShowRightSidebar] = useState(true);

  return (
    <div className="main-layout">
      {/* TopBar - Menu Bar with Search */}
      <TopBar />

      {/* Titlebar */}
      <div className="titlebar">
        <div className="titlebar-left">
          <span className="app-icon">🎨</span>
          <span className="app-name">Oqool Desktop IDE</span>
        </div>
        <div className="titlebar-center">
          <span className="workspace-name">Workspace</span>
        </div>
        <div className="titlebar-right">
          <button className="titlebar-button" title="الإعدادات">
            ⚙️
          </button>
          <button
            className="titlebar-button"
            title="AI Panel"
            onClick={() => setShowRightSidebar(!showRightSidebar)}
          >
            🤖
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="layout-content">
        {/* Left Sidebar - File Explorer */}
        <div className="left-sidebar" style={{ width: `${leftSidebarWidth}px` }}>
          <FileExplorer />
        </div>

        {/* Center - Editor & Terminal */}
        <div className="center-area">
          <div className="editor-area" style={{ height: `calc(100% - ${terminalHeight}px)` }}>
            <EditorTabs />
            <Editor />
          </div>

          <div className="terminal-area" style={{ height: `${terminalHeight}px` }}>
            <TerminalPanel />
          </div>
        </div>

        {/* Right Sidebar - AI Panel */}
        {showRightSidebar && (
          <div className="right-sidebar" style={{ width: `${rightSidebarWidth}px` }}>
            <AIPanel />
          </div>
        )}
      </div>
    </div>
  );
};
