import { useState } from 'react';
import { VscAdd, VscSplitHorizontal, VscTrash, VscClose, VscTerminal } from 'react-icons/vsc';
import './Terminal.css';

interface TerminalTab {
  id: number;
  name: string;
  type: string;
}

export function Terminal() {
  const [tabs, setTabs] = useState<TerminalTab[]>([{ id: 1, name: 'bash', type: 'bash' }]);
  const [activeTabId, setActiveTabId] = useState(1);

  const addNewTerminal = () => {
    const newTab = {
      id: tabs.length + 1,
      name: `bash ${tabs.length + 1}`,
      type: 'bash',
    };
    setTabs([...tabs, newTab]);
    setActiveTabId(newTab.id);
  };

  const closeTab = (id: number) => {
    if (tabs.length === 1) {return;} // Keep at least one tab
    const newTabs = tabs.filter((tab) => tab.id !== id);
    setTabs(newTabs);
    if (activeTabId === id) {
      setActiveTabId(newTabs[0].id);
    }
  };

  const splitTerminal = () => {
    alert('Split terminal feature - Coming soon!');
  };

  const clearTerminal = () => {
    alert('Clear terminal feature - Coming soon!');
  };

  return (
    <div className="terminal">
      <div className="terminal-header">
        <div className="terminal-tabs">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`terminal-tab ${activeTabId === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTabId(tab.id)}
            >
              <span className="terminal-tab-icon">
                <VscTerminal size={14} />
              </span>
              <span className="terminal-tab-name">{tab.name}</span>
              {tabs.length > 1 && (
                <button
                  className="terminal-tab-close"
                  onClick={(e) => {
                    e.stopPropagation();
                    closeTab(tab.id);
                  }}
                >
                  <VscClose size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
        <div className="terminal-actions">
          <button className="terminal-btn" onClick={addNewTerminal} title="New Terminal">
            <VscAdd size={16} />
          </button>
          <button className="terminal-btn" onClick={splitTerminal} title="Split Terminal">
            <VscSplitHorizontal size={16} />
          </button>
          <button className="terminal-btn" onClick={clearTerminal} title="Clear">
            <VscTrash size={16} />
          </button>
          <button
            className="terminal-btn"
            onClick={() => closeTab(activeTabId)}
            title="Kill Terminal"
          >
            <VscClose size={16} />
          </button>
        </div>
      </div>
      <div className="terminal-content">
        <div className="terminal-line">
          <span className="prompt-user">amir@oqool</span>
          <span className="prompt-separator">:</span>
          <span className="prompt-path">~/oqool-ide-final</span>
          <span className="prompt-dollar">$ </span>
          <span className="command-text">npm run dev</span>
        </div>
        <div className="terminal-line">
          <span className="success-icon">✓</span>
          <span className="command-text"> Vite dev server running at http://localhost:5174</span>
        </div>
        <div className="terminal-line">
          <span className="info-text">🚀 Oqool IDE v1.0.0</span>
        </div>
        <div className="terminal-line terminal-mt">
          <span className="command-text">Features loaded:</span>
        </div>
        <div className="terminal-line">
          <span className="success-text"> ✓ Monaco Editor</span>
        </div>
        <div className="terminal-line">
          <span className="success-text"> ✓ IntelliSense</span>
        </div>
        <div className="terminal-line">
          <span className="success-text"> ✓ Syntax Highlighting</span>
        </div>
        <div className="terminal-line">
          <span className="success-text"> ✓ AI Assistant</span>
        </div>
        <div className="terminal-line terminal-mt">
          <span className="prompt-user">amir@oqool</span>
          <span className="prompt-separator">:</span>
          <span className="prompt-path">~/oqool-ide-final</span>
          <span className="prompt-dollar">$ </span>
          <span className="cursor-blink">█</span>
        </div>
      </div>
    </div>
  );
}
