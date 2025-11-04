import { useState, useEffect, useRef } from 'react';
import { VscSearch, VscSymbolKeyword } from 'react-icons/vsc';
import './CommandPalette.css';

interface Command {
  id: string;
  label: string;
  description: string;
  category: string;
  shortcut?: string;
  action: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: Command[] = [
    {
      id: 'file.new',
      label: 'New File',
      description: 'Create a new file',
      category: 'File',
      shortcut: 'Ctrl+N',
      action: () => console.log('New File'),
    },
    {
      id: 'file.open',
      label: 'Open File',
      description: 'Open an existing file',
      category: 'File',
      shortcut: 'Ctrl+O',
      action: () => console.log('Open File'),
    },
    {
      id: 'file.save',
      label: 'Save',
      description: 'Save the current file',
      category: 'File',
      shortcut: 'Ctrl+S',
      action: () => console.log('Save'),
    },
    {
      id: 'view.explorer',
      label: 'Toggle Explorer',
      description: 'Show/Hide file explorer',
      category: 'View',
      shortcut: 'Ctrl+Shift+E',
      action: () => console.log('Toggle Explorer'),
    },
    {
      id: 'view.terminal',
      label: 'Toggle Terminal',
      description: 'Show/Hide terminal',
      category: 'View',
      shortcut: 'Ctrl+`',
      action: () => console.log('Toggle Terminal'),
    },
    {
      id: 'editor.format',
      label: 'Format Document',
      description: 'Format the entire document',
      category: 'Editor',
      shortcut: 'Shift+Alt+F',
      action: () => console.log('Format Document'),
    },
    {
      id: 'git.commit',
      label: 'Git: Commit',
      description: 'Commit staged changes',
      category: 'Git',
      action: () => console.log('Git Commit'),
    },
    {
      id: 'ai.chat',
      label: 'AI: Open Chat',
      description: 'Open AI assistant chat',
      category: 'AI',
      action: () => console.log('AI Chat'),
    },
  ];

  const filteredCommands = commands.filter(
    (cmd) =>
      cmd.label.toLowerCase().includes(search.toLowerCase()) ||
      cmd.description.toLowerCase().includes(search.toLowerCase()) ||
      cmd.category.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) {return null;}

  return (
    <div className="command-palette-overlay" onClick={onClose}>
      <div className="command-palette" onClick={(e) => e.stopPropagation()}>
        <div className="command-palette-search">
          <div className="search-icon">
            <VscSearch size={20} />
          </div>
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            className="command-palette-input"
          />
        </div>
        <div className="command-palette-results">
          {filteredCommands.length === 0 ? (
            <div className="no-results">
              <p>No commands found</p>
            </div>
          ) : (
            filteredCommands.map((cmd, index) => (
              <div
                key={cmd.id}
                className={`command-item ${index === selectedIndex ? 'selected' : ''}`}
                onClick={() => {
                  cmd.action();
                  onClose();
                }}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className="command-icon">
                  <VscSymbolKeyword size={16} />
                </div>
                <div className="command-info">
                  <div className="command-label">{cmd.label}</div>
                  <div className="command-description">{cmd.description}</div>
                </div>
                <div className="command-meta">
                  <span className="command-category">{cmd.category}</span>
                  {cmd.shortcut && <span className="command-shortcut">{cmd.shortcut}</span>}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
