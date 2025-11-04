import { useEffect, useRef, useState } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import 'xterm/css/xterm.css';
import { VscAdd, VscSplitHorizontal, VscTrash, VscClose, VscTerminal } from 'react-icons/vsc';
import './Terminal.css';

interface TerminalTab {
  id: number;
  name: string;
  terminal: Terminal;
  fitAddon: FitAddon;
}

export function XTermTerminal() {
  const [tabs, setTabs] = useState<TerminalTab[]>([]);
  const [activeTabId, setActiveTabId] = useState<number>(1);
  const terminalRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const nextIdRef = useRef(1);

  // Initialize first terminal
  useEffect(() => {
    if (tabs.length === 0) {
      addNewTerminal();
    }
  }, []);

  // Resize terminals when window resizes
  useEffect(() => {
    const handleResize = () => {
      tabs.forEach((tab) => {
        try {
          tab.fitAddon.fit();
        } catch (e) {
          console.error('Error fitting terminal:', e);
        }
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [tabs]);

  const createTerminal = (
    container: HTMLDivElement,
    _id: number
  ): { terminal: Terminal; fitAddon: FitAddon } => {
    const terminal = new Terminal({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: 'JetBrains Mono, Menlo, Monaco, "Courier New", monospace',
      theme: {
        background: '#1e1e1e',
        foreground: '#cccccc',
        cursor: '#ffffff',
        black: '#000000',
        red: '#cd3131',
        green: '#0dbc79',
        yellow: '#e5e510',
        blue: '#2472c8',
        magenta: '#bc3fbc',
        cyan: '#11a8cd',
        white: '#e5e5e5',
        brightBlack: '#666666',
        brightRed: '#f14c4c',
        brightGreen: '#23d18b',
        brightYellow: '#f5f543',
        brightBlue: '#3b8eea',
        brightMagenta: '#d670d6',
        brightCyan: '#29b8db',
        brightWhite: '#ffffff',
      },
      allowTransparency: true,
      scrollback: 1000,
    });

    const fitAddon = new FitAddon();
    const webLinksAddon = new WebLinksAddon();

    terminal.loadAddon(fitAddon);
    terminal.loadAddon(webLinksAddon);
    terminal.open(container);

    // Initial fit
    setTimeout(() => {
      fitAddon.fit();
    }, 0);

    // Welcome message
    terminal.writeln('\x1b[1;32m🚀 Oqool Terminal\x1b[0m');
    terminal.writeln('\x1b[90mType commands below. Note: This is a simulated terminal.\x1b[0m');
    terminal.writeln('');

    // Simple command prompt
    let currentLine = '';
    const prompt = '\x1b[32m$\x1b[0m ';
    terminal.write(prompt);

    // Handle input
    terminal.onData((data) => {
      const code = data.charCodeAt(0);

      if (code === 13) {
        // Enter key
        terminal.writeln('');
        if (currentLine.trim()) {
          // Execute command (simulated)
          handleCommand(terminal, currentLine.trim());
        }
        currentLine = '';
        terminal.write(prompt);
      } else if (code === 127) {
        // Backspace
        if (currentLine.length > 0) {
          currentLine = currentLine.slice(0, -1);
          terminal.write('\b \b');
        }
      } else if (code >= 32 && code <= 126) {
        // Printable characters
        currentLine += data;
        terminal.write(data);
      }
    });

    return { terminal, fitAddon };
  };

  const handleCommand = (terminal: Terminal, command: string) => {
    const cmd = command.toLowerCase();

    if (cmd === 'clear' || cmd === 'cls') {
      terminal.clear();
    } else if (cmd === 'help') {
      terminal.writeln('\x1b[1;36mAvailable commands:\x1b[0m');
      terminal.writeln('  clear, cls  - Clear terminal');
      terminal.writeln('  help        - Show this help');
      terminal.writeln('  echo <text> - Echo text');
      terminal.writeln('  date        - Show current date');
      terminal.writeln('');
      terminal.writeln('\x1b[33mNote: Full terminal integration coming soon!\x1b[0m');
    } else if (cmd.startsWith('echo ')) {
      terminal.writeln(command.slice(5));
    } else if (cmd === 'date') {
      terminal.writeln(new Date().toString());
    } else if (cmd === 'pwd') {
      terminal.writeln('/home/user/oqool-ide');
    } else if (cmd === 'whoami') {
      terminal.writeln('oqool-user');
    } else if (cmd.startsWith('npm ') || cmd.startsWith('node ') || cmd.startsWith('git ')) {
      terminal.writeln(`\x1b[33m⚠ Real command execution coming soon!\x1b[0m`);
      terminal.writeln(`\x1b[90mYou typed: ${command}\x1b[0m`);
    } else if (cmd) {
      terminal.writeln(`\x1b[31mCommand not found: ${command}\x1b[0m`);
      terminal.writeln(`\x1b[90mType 'help' for available commands\x1b[0m`);
    }
  };

  const addNewTerminal = () => {
    const id = nextIdRef.current++;
    const name = id === 1 ? 'bash' : `bash ${id}`;

    // Create placeholder - actual terminal will be created in useEffect
    const newTab: TerminalTab = {
      id,
      name,
      terminal: null as any,
      fitAddon: null as any,
    };

    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(id);
  };

  const closeTab = (id: number) => {
    if (tabs.length === 1) {return;} // Keep at least one tab

    const tab = tabs.find((t) => t.id === id);
    if (tab && tab.terminal) {
      tab.terminal.dispose();
    }

    const newTabs = tabs.filter((t) => t.id !== id);
    setTabs(newTabs);

    if (activeTabId === id && newTabs.length > 0) {
      setActiveTabId(newTabs[0].id);
    }

    terminalRefs.current.delete(id);
  };

  const splitTerminal = () => {
    addNewTerminal();
  };

  const clearTerminal = () => {
    const tab = tabs.find((t) => t.id === activeTabId);
    if (tab && tab.terminal) {
      tab.terminal.clear();
    }
  };

  // Setup terminal when container is ready
  useEffect(() => {
    tabs.forEach((tab) => {
      if (!tab.terminal && terminalRefs.current.has(tab.id)) {
        const container = terminalRefs.current.get(tab.id);
        if (container && container.children.length === 0) {
          const { terminal, fitAddon } = createTerminal(container, tab.id);
          tab.terminal = terminal;
          tab.fitAddon = fitAddon;

          // Fit terminal after creation
          setTimeout(() => {
            fitAddon.fit();
          }, 100);
        }
      }
    });
  }, [tabs]);

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
      <div
        className="terminal-content"
        style={{ padding: 0, position: 'relative', height: 'calc(100% - 35px)' }}
      >
        {tabs.map((tab) => (
          <div
            key={tab.id}
            ref={(el) => {
              if (el) {terminalRefs.current.set(tab.id, el);}
            }}
            style={{
              display: activeTabId === tab.id ? 'block' : 'none',
              height: '100%',
              width: '100%',
            }}
          />
        ))}
      </div>
    </div>
  );
}
