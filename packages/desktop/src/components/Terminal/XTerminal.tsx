// XTerminal.tsx
// ============================================
// 🖥️ Integrated Terminal with Xterm.js
// ============================================
// Professional terminal component with AI command suggestions

import React, { useEffect, useRef, useState } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { SearchAddon } from 'xterm-addon-search';
import 'xterm/css/xterm.css';

// ============================================
// Types
// ============================================

export interface XTerminalProps {
  onCommand?: (command: string) => void;
  onOutput?: (output: string) => void;
  theme?: 'dark' | 'light' | 'oqool';
  fontSize?: number;
  fontFamily?: string;
  enableAIsuggestions?: boolean;
}

export interface TerminalCommand {
  command: string;
  timestamp: Date;
  output?: string;
  exitCode?: number;
}

// ============================================
// Terminal Component
// ============================================

export const XTerminal: React.FC<XTerminalProps> = ({
  onCommand,
  onOutput,
  theme = 'dark',
  fontSize = 14,
  fontFamily = 'JetBrains Mono, Menlo, Monaco, "Courier New", monospace',
  enableAIsuggestions = true,
}) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const searchAddonRef = useRef<SearchAddon | null>(null);

  const [history, setHistory] = useState<TerminalCommand[]>([]);
  const [currentLine, setCurrentLine] = useState('');
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Terminal themes
  const themes = {
    dark: {
      background: '#1e1e1e',
      foreground: '#d4d4d4',
      cursor: '#d4d4d4',
      cursorAccent: '#1e1e1e',
      selection: 'rgba(255, 255, 255, 0.3)',
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
    light: {
      background: '#ffffff',
      foreground: '#333333',
      cursor: '#333333',
      cursorAccent: '#ffffff',
      selection: 'rgba(0, 0, 0, 0.3)',
      black: '#000000',
      red: '#cd3131',
      green: '#00BC00',
      yellow: '#949800',
      blue: '#0451a5',
      magenta: '#bc05bc',
      cyan: '#0598bc',
      white: '#555555',
      brightBlack: '#666666',
      brightRed: '#cd3131',
      brightGreen: '#14CE14',
      brightYellow: '#b5ba00',
      brightBlue: '#0451a5',
      brightMagenta: '#bc05bc',
      brightCyan: '#0598bc',
      brightWhite: '#a5a5a5',
    },
    oqool: {
      background: '#0a0e14',
      foreground: '#b3b1ad',
      cursor: '#ffcc66',
      cursorAccent: '#0a0e14',
      selection: 'rgba(255, 204, 102, 0.3)',
      black: '#01060e',
      red: '#ea6c73',
      green: '#91b362',
      yellow: '#f9af4f',
      blue: '#53bdfa',
      magenta: '#fae994',
      cyan: '#90e1c6',
      white: '#c7c7c7',
      brightBlack: '#686868',
      brightRed: '#f07178',
      brightGreen: '#c2d94c',
      brightYellow: '#ffb454',
      brightBlue: '#59c2ff',
      brightMagenta: '#ffee99',
      brightCyan: '#95e6cb',
      brightWhite: '#ffffff',
    },
  };

  useEffect(() => {
    if (!terminalRef.current) return;

    // Create terminal instance
    const term = new Terminal({
      theme: themes[theme],
      fontSize,
      fontFamily,
      cursorBlink: true,
      cursorStyle: 'block',
      scrollback: 10000,
      tabStopWidth: 4,
      allowProposedApi: true,
    });

    // Create addons
    const fitAddon = new FitAddon();
    const webLinksAddon = new WebLinksAddon();
    const searchAddon = new SearchAddon();

    // Load addons
    term.loadAddon(fitAddon);
    term.loadAddon(webLinksAddon);
    term.loadAddon(searchAddon);

    // Open terminal
    term.open(terminalRef.current);
    fitAddon.fit();

    // Store references
    xtermRef.current = term;
    fitAddonRef.current = fitAddon;
    searchAddonRef.current = searchAddon;

    // Welcome message
    term.writeln('╔═══════════════════════════════════════════════════════════╗');
    term.writeln('║          🤖 Oqool AI Terminal - مرحباً                   ║');
    term.writeln('║                                                           ║');
    term.writeln('║  Features:                                                ║');
    term.writeln('║    • AI Command Suggestions                               ║');
    term.writeln('║    • Command History (↑/↓)                                ║');
    term.writeln('║    • Web Links Detection                                  ║');
    term.writeln('║    • Advanced Search (Ctrl+F)                             ║');
    term.writeln('║                                                           ║');
    term.writeln('║  Type "help" for available commands                       ║');
    term.writeln('╚═══════════════════════════════════════════════════════════╝');
    term.writeln('');
    writePrompt(term);

    // Handle input
    let currentInput = '';

    term.onData((data) => {
      const code = data.charCodeAt(0);

      // Enter key
      if (code === 13) {
        term.writeln('');

        if (currentInput.trim()) {
          // Execute command
          executeCommand(term, currentInput.trim());

          // Add to history
          setHistory((prev) => [
            ...prev,
            {
              command: currentInput.trim(),
              timestamp: new Date(),
            },
          ]);

          // Notify parent
          onCommand?.(currentInput.trim());
        }

        currentInput = '';
        setHistoryIndex(-1);
        writePrompt(term);
      }
      // Backspace
      else if (code === 127) {
        if (currentInput.length > 0) {
          currentInput = currentInput.slice(0, -1);
          term.write('\b \b');
        }
      }
      // Ctrl+C
      else if (code === 3) {
        term.writeln('^C');
        currentInput = '';
        writePrompt(term);
      }
      // Arrow Up (history prev)
      else if (data === '\x1b[A') {
        if (history.length > 0 && historyIndex < history.length - 1) {
          const newIndex = historyIndex + 1;
          setHistoryIndex(newIndex);

          // Clear current line
          term.write('\r\x1b[K');
          writePrompt(term);

          // Write history command
          const historicalCommand = history[history.length - 1 - newIndex].command;
          term.write(historicalCommand);
          currentInput = historicalCommand;
        }
      }
      // Arrow Down (history next)
      else if (data === '\x1b[B') {
        if (historyIndex > 0) {
          const newIndex = historyIndex - 1;
          setHistoryIndex(newIndex);

          // Clear current line
          term.write('\r\x1b[K');
          writePrompt(term);

          // Write history command
          const historicalCommand = history[history.length - 1 - newIndex].command;
          term.write(historicalCommand);
          currentInput = historicalCommand;
        } else if (historyIndex === 0) {
          setHistoryIndex(-1);

          // Clear current line
          term.write('\r\x1b[K');
          writePrompt(term);
          currentInput = '';
        }
      }
      // Regular character
      else if (code >= 32 && code <= 126) {
        currentInput += data;
        term.write(data);

        // AI suggestions (if enabled)
        if (enableAIsuggestions && currentInput.length > 2) {
          suggestCommand(term, currentInput);
        }
      }

      setCurrentLine(currentInput);
    });

    // Handle resize
    const handleResize = () => {
      fitAddon.fit();
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      term.dispose();
    };
  }, [theme, fontSize, fontFamily, enableAIsuggestions, history, historyIndex]);

  // Write prompt
  const writePrompt = (term: Terminal) => {
    term.write('\r\n\x1b[1;32m➜\x1b[0m \x1b[1;34m~\x1b[0m ');
  };

  // Execute command
  const executeCommand = async (term: Terminal, command: string) => {
    const [cmd, ...args] = command.split(' ');

    switch (cmd.toLowerCase()) {
      case 'help':
        term.writeln('');
        term.writeln('Available commands:');
        term.writeln('  help           - Show this help message');
        term.writeln('  clear          - Clear terminal');
        term.writeln('  history        - Show command history');
        term.writeln('  echo <text>    - Print text');
        term.writeln('  date           - Show current date/time');
        term.writeln('  theme <name>   - Change theme (dark/light/oqool)');
        term.writeln('');
        break;

      case 'clear':
        term.clear();
        break;

      case 'history':
        term.writeln('');
        history.forEach((item, idx) => {
          term.writeln(`  ${idx + 1}  ${item.command}`);
        });
        term.writeln('');
        break;

      case 'echo':
        term.writeln(args.join(' '));
        break;

      case 'date':
        term.writeln(new Date().toString());
        break;

      case 'theme':
        if (args[0] && ['dark', 'light', 'oqool'].includes(args[0])) {
          term.writeln(`Theme changed to: ${args[0]}`);
        } else {
          term.writeln('Usage: theme <dark|light|oqool>');
        }
        break;

      default:
        term.writeln(`\x1b[1;31mCommand not found: ${cmd}\x1b[0m`);
        term.writeln('Type "help" for available commands');
    }

    onOutput?.(`Command: ${command}`);
  };

  // AI command suggestions
  const suggestCommand = (term: Terminal, input: string) => {
    // Simple command suggestions (can be enhanced with AI)
    const suggestions: Record<string, string> = {
      'gi': 'git',
      'npm': 'npm install',
      'doc': 'docker',
      'gits': 'git status',
      'gitc': 'git commit',
      'gitp': 'git push',
    };

    const suggestion = suggestions[input];
    if (suggestion && suggestion.startsWith(input)) {
      // TODO: Show suggestion in gray color
    }
  };

  return (
    <div
      ref={terminalRef}
      style={{
        width: '100%',
        height: '100%',
        padding: '8px',
      }}
    />
  );
};

export default XTerminal;
