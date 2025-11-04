import React, { useState } from 'react';
import { Terminal } from './Terminal';
import './TerminalPanel.css';

interface TerminalTab {
  id: string;
  name: string;
  cwd?: string;
}

export const TerminalPanel: React.FC = () => {
  const [terminals, setTerminals] = useState<TerminalTab[]>([{ id: '1', name: 'Terminal 1' }]);
  const [activeTerminal, setActiveTerminal] = useState('1');

  const addTerminal = () => {
    const newId = String(terminals.length + 1);
    setTerminals([...terminals, { id: newId, name: `Terminal ${newId}` }]);
    setActiveTerminal(newId);
  };

  const closeTerminal = (id: string) => {
    const filtered = terminals.filter((t) => t.id !== id);
    setTerminals(filtered);
    if (activeTerminal === id && filtered.length > 0) {
      setActiveTerminal(filtered[0].id);
    }
  };

  return (
    <div className="terminal-panel">
      <div className="terminal-tabs">
        {terminals.map((term) => (
          <div
            key={term.id}
            className={`terminal-tab ${activeTerminal === term.id ? 'active' : ''}`}
            onClick={() => setActiveTerminal(term.id)}
          >
            <span className="terminal-icon">❯_</span>
            <span className="terminal-name">{term.name}</span>
            {terminals.length > 1 && (
              <button
                className="terminal-close"
                onClick={(e) => {
                  e.stopPropagation();
                  closeTerminal(term.id);
                }}
              >
                ×
              </button>
            )}
          </div>
        ))}
        <button className="terminal-new" onClick={addTerminal} title="Terminal جديد">
          +
        </button>
      </div>
      <div className="terminal-content">
        {terminals.map((term) => (
          <div
            key={term.id}
            className="terminal-wrapper"
            style={{ display: activeTerminal === term.id ? 'block' : 'none' }}
          >
            <Terminal />
          </div>
        ))}
      </div>
    </div>
  );
};
