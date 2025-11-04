import { useState, useEffect, useRef } from 'react';
import { Titlebar } from './components/Titlebar/Titlebar';
import { Sidebar } from './components/Sidebar/Sidebar';
import { Editor } from './components/Editor/Editor';
import { Terminal } from './components/Terminal/Terminal';
import { getTranslation, Language } from './translations';
import './App.css';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

function App() {
  const [aiPersonality, setAiPersonality] = useState('claude-sonnet');
  const [aiMode, setAiMode] = useState('coder');
  const [aiInput, setAiInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'assistant',
      content: 'مرحباً! أنا مساعدك الذكي. كيف يمكنني مساعدتك اليوم؟',
      timestamp: new Date(),
    },
  ]);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>('en');
  const [isTyping, setIsTyping] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const t = (key: string) => getTranslation(language, key);

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+N - New File
      if (e.ctrlKey && e.key === 'n' && !e.shiftKey) {
        e.preventDefault();
        handleNewFile();
      }
      // Ctrl+O - Open File
      else if (e.ctrlKey && e.key === 'o' && !e.shiftKey) {
        e.preventDefault();
        handleOpenFile();
      }
      // Ctrl+S - Save
      else if (e.ctrlKey && e.key === 's' && !e.shiftKey) {
        e.preventDefault();
        handleSave();
      }
      // Ctrl+Shift+S - Save As
      else if (e.ctrlKey && e.shiftKey && e.key === 'S') {
        e.preventDefault();
        handleSaveAs();
      }
      // Ctrl+W - Close
      else if (e.ctrlKey && e.key === 'w') {
        e.preventDefault();
        handleCloseEditor();
      }
      // Ctrl+P - Go to File
      else if (e.ctrlKey && e.key === 'p' && !e.shiftKey) {
        e.preventDefault();
        handleGoToFile();
      }
      // Ctrl+G - Go to Line
      else if (e.ctrlKey && e.key === 'g') {
        e.preventDefault();
        handleGoToLine();
      }
      // Ctrl+Shift+P - Command Palette
      else if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        handleCommandPalette();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleMenu = (menuName: string) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as Language);
    localStorage.setItem('language', e.target.value);
  };

  // Menu Actions
  const handleNewFile = () => {
    const fileName = prompt('Enter file name:');
    if (fileName) {
      const newFile = {
        name: fileName,
        path: `/${fileName}`,
        language: fileName.endsWith('.tsx') || fileName.endsWith('.ts') ? 'typescript' :
                 fileName.endsWith('.jsx') || fileName.endsWith('.js') ? 'javascript' :
                 fileName.endsWith('.css') ? 'css' :
                 fileName.endsWith('.json') ? 'json' : 'plaintext',
        content: `// ${fileName}\n\n`,
      };
      // This would need integration with editorStore
      console.log('Creating new file:', newFile);
      alert('New file functionality - coming soon!');
    }
    setOpenMenu(null);
  };

  const handleOpenFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          console.log('File content:', content);
          alert(`Opening file: ${file.name}`);
        };
        reader.readAsText(file);
      }
    };
    input.click();
    setOpenMenu(null);
  };

  const handleSave = () => {
    console.log('Saving file...');
    alert('Save functionality - Ctrl+S');
    setOpenMenu(null);
  };

  const handleSaveAs = () => {
    const fileName = prompt('Save as:');
    if (fileName) {
      console.log('Saving as:', fileName);
      alert(`Saved as: ${fileName}`);
    }
    setOpenMenu(null);
  };

  const handleCloseEditor = () => {
    if (confirm('Close current editor?')) {
      console.log('Closing editor');
    }
    setOpenMenu(null);
  };

  const handleUndo = () => {
    console.log('Undo action');
    document.execCommand('undo');
    setOpenMenu(null);
  };

  const handleRedo = () => {
    console.log('Redo action');
    document.execCommand('redo');
    setOpenMenu(null);
  };

  const handleCut = () => {
    document.execCommand('cut');
    setOpenMenu(null);
  };

  const handleCopy = () => {
    document.execCommand('copy');
    setOpenMenu(null);
  };

  const handlePaste = () => {
    document.execCommand('paste');
    setOpenMenu(null);
  };

  const handleFind = () => {
    alert('Find: Ctrl+F\n\nUse browser find or Monaco Editor find feature.');
    setOpenMenu(null);
  };

  const handleReplace = () => {
    alert('Replace: Ctrl+H\n\nUse Monaco Editor replace feature.');
    setOpenMenu(null);
  };

  const handleCommandPalette = () => {
    alert('Command Palette: Ctrl+Shift+P\n\nQuick access to all commands.');
    setOpenMenu(null);
  };

  const handleGoToFile = () => {
    const fileName = prompt('Go to file:');
    if (fileName) {
      alert(`Navigating to: ${fileName}`);
    }
    setOpenMenu(null);
  };

  const handleGoToLine = () => {
    const lineNumber = prompt('Go to line number:');
    if (lineNumber) {
      alert(`Jumping to line: ${lineNumber}`);
    }
    setOpenMenu(null);
  };

  // AI Chat Functions
  const sendMessage = async () => {
    if (!aiInput.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      role: 'user',
      content: aiInput,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setAiInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        role: 'assistant',
        content: generateAIResponse(aiInput, aiPersonality, aiMode),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (question: string, model: string, mode: string): string => {
    const modelName = model === 'claude-sonnet' ? 'Claude Sonnet 4.5' :
                      model === 'gpt4' ? 'ChatGPT-4' :
                      model === 'deepseek' ? 'DeepSeek V3' : model;

    const responses: { [key: string]: string[] } = {
      coder: [
        `كمساعد برمجة، إليك الحل:\n\n\`\`\`javascript\n// Code example\nfunction solution() {\n  return "Implementation here";\n}\n\`\`\``,
        'دعني أساعدك في كتابة هذا الكود. ما هي اللغة البرمجية التي تفضلها؟',
        'أستطيع مساعدتك في تطوير هذه الميزة. هل تريد شرح خطوة بخطوة؟'
      ],
      debugger: [
        'دعني أفحص الخطأ... وجدت المشكلة في السطر X. يبدو أن هناك مشكلة في...',
        'هذا الخطأ عادة يحدث بسبب... إليك الحل المقترح:',
        'بعد تحليل الكود، المشكلة تكمن في...'
      ],
      architect: [
        'من منظور معماري، أقترح استخدام هيكلية...',
        'التصميم المثالي لهذه المشكلة هو...',
        'يمكننا تقسيم النظام إلى المكونات التالية:'
      ],
    };

    const modeResponses = responses[mode as keyof typeof responses] || responses.coder;
    const randomResponse = modeResponses[Math.floor(Math.random() * modeResponses.length)];

    return `[${modelName} - ${mode}]\n\n${randomResponse}\n\nهل تريد المزيد من التفاصيل؟`;
  };

  const clearChat = () => {
    if (confirm('هل تريد مسح جميع الرسائل؟')) {
      setMessages([
        {
          id: 1,
          role: 'assistant',
          content: 'تم مسح المحادثة. كيف يمكنني مساعدتك؟',
          timestamp: new Date(),
        },
      ]);
    }
  };

  return (
    <div className="app">
      <Titlebar />

      {/* Menu Bar */}
      <div className="menu-bar" ref={menuRef}>
        <div className="menu-items">
          <div className="menu-item" onClick={() => toggleMenu('file')}>
            {t('menu.file')}
            <div className={`dropdown-menu ${openMenu === 'file' ? 'show' : ''}`}>
              <div className="dropdown-item" onClick={handleNewFile}>
                <span>{t('menu.file.new')}</span>
                <span className="shortcut-hint">Ctrl+N</span>
              </div>
              <div className="dropdown-item" onClick={handleOpenFile}>
                <span>{t('menu.file.open')}</span>
                <span className="shortcut-hint">Ctrl+O</span>
              </div>
              <div className="dropdown-item" onClick={handleOpenFile}>
                <span>{t('menu.file.openFolder')}</span>
                <span className="shortcut-hint">Ctrl+K Ctrl+O</span>
              </div>
              <div className="dropdown-separator"></div>
              <div className="dropdown-item" onClick={handleSave}>
                <span>{t('menu.file.save')}</span>
                <span className="shortcut-hint">Ctrl+S</span>
              </div>
              <div className="dropdown-item" onClick={handleSaveAs}>
                <span>{t('menu.file.saveAs')}</span>
                <span className="shortcut-hint">Ctrl+Shift+S</span>
              </div>
              <div className="dropdown-separator"></div>
              <div className="dropdown-item" onClick={handleCloseEditor}>
                <span>{t('menu.file.close')}</span>
                <span className="shortcut-hint">Ctrl+W</span>
              </div>
            </div>
          </div>

          <div className="menu-item" onClick={() => toggleMenu('edit')}>
            {t('menu.edit')}
            <div className={`dropdown-menu ${openMenu === 'edit' ? 'show' : ''}`}>
              <div className="dropdown-item" onClick={handleUndo}>
                <span>{t('menu.edit.undo')}</span>
                <span className="shortcut-hint">Ctrl+Z</span>
              </div>
              <div className="dropdown-item" onClick={handleRedo}>
                <span>{t('menu.edit.redo')}</span>
                <span className="shortcut-hint">Ctrl+Y</span>
              </div>
              <div className="dropdown-separator"></div>
              <div className="dropdown-item" onClick={handleCut}>
                <span>{t('menu.edit.cut')}</span>
                <span className="shortcut-hint">Ctrl+X</span>
              </div>
              <div className="dropdown-item" onClick={handleCopy}>
                <span>{t('menu.edit.copy')}</span>
                <span className="shortcut-hint">Ctrl+C</span>
              </div>
              <div className="dropdown-item" onClick={handlePaste}>
                <span>{t('menu.edit.paste')}</span>
                <span className="shortcut-hint">Ctrl+V</span>
              </div>
              <div className="dropdown-separator"></div>
              <div className="dropdown-item" onClick={handleFind}>
                <span>{t('menu.edit.find')}</span>
                <span className="shortcut-hint">Ctrl+F</span>
              </div>
              <div className="dropdown-item" onClick={handleReplace}>
                <span>{t('menu.edit.replace')}</span>
                <span className="shortcut-hint">Ctrl+H</span>
              </div>
            </div>
          </div>

          <div className="menu-item" onClick={() => toggleMenu('view')}>
            {t('menu.view')}
            <div className={`dropdown-menu ${openMenu === 'view' ? 'show' : ''}`}>
              <div className="dropdown-item" onClick={handleCommandPalette}>
                <span>{t('menu.view.commandPalette')}</span>
                <span className="shortcut-hint">Ctrl+Shift+P</span>
              </div>
              <div className="dropdown-separator"></div>
              <div className="dropdown-item" onClick={() => { alert('Explorer panel'); setOpenMenu(null); }}>
                <span>{t('menu.view.explorer')}</span>
                <span className="shortcut-hint">Ctrl+Shift+E</span>
              </div>
              <div className="dropdown-item" onClick={() => { alert('Search panel'); setOpenMenu(null); }}>
                <span>{t('menu.view.search')}</span>
                <span className="shortcut-hint">Ctrl+Shift+F</span>
              </div>
              <div className="dropdown-item" onClick={() => { alert('Extensions panel'); setOpenMenu(null); }}>
                <span>{t('menu.view.extensions')}</span>
                <span className="shortcut-hint">Ctrl+Shift+X</span>
              </div>
              <div className="dropdown-separator"></div>
              <div className="dropdown-item" onClick={() => { alert('Terminal panel'); setOpenMenu(null); }}>
                <span>{t('menu.view.terminal')}</span>
                <span className="shortcut-hint">Ctrl+`</span>
              </div>
            </div>
          </div>

          <div className="menu-item" onClick={() => toggleMenu('go')}>
            {t('menu.go')}
            <div className={`dropdown-menu ${openMenu === 'go' ? 'show' : ''}`}>
              <div className="dropdown-item" onClick={() => { alert('Go back'); setOpenMenu(null); }}>
                <span>{t('menu.go.back')}</span>
                <span className="shortcut-hint">Ctrl+Alt+←</span>
              </div>
              <div className="dropdown-item" onClick={() => { alert('Go forward'); setOpenMenu(null); }}>
                <span>{t('menu.go.forward')}</span>
                <span className="shortcut-hint">Ctrl+Alt+→</span>
              </div>
              <div className="dropdown-separator"></div>
              <div className="dropdown-item" onClick={handleGoToFile}>
                <span>{t('menu.go.goToFile')}</span>
                <span className="shortcut-hint">Ctrl+P</span>
              </div>
              <div className="dropdown-item" onClick={handleGoToLine}>
                <span>{t('menu.go.goToLine')}</span>
                <span className="shortcut-hint">Ctrl+G</span>
              </div>
            </div>
          </div>
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder={t('search.placeholder')}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const value = (e.target as HTMLInputElement).value;
                if (value) {
                  alert(`Searching for: ${value}\n\nSearch functionality coming soon!`);
                }
              }
            }}
          />
        </div>

        <div className="language-selector">
          <select value={language} onChange={handleLanguageChange}>
            <option value="en">English</option>
            <option value="ar">العربية</option>
            <option value="de">Deutsch</option>
          </select>
        </div>
      </div>

      <div className="app-body">
        {/* Activity Bar */}
        <div className="activity-bar">
          <div className="activity-icon active">📁</div>
          <div className="activity-icon">🔍</div>
          <div className="activity-icon">🌿</div>
          <div className="activity-icon">🐛</div>
          <div className="activity-icon">🤖</div>
        </div>

        <Sidebar />

        <div className="app-main">
          <Editor />
          <Terminal />
        </div>

        {/* AI Chat Panel */}
        <div className="ai-panel">
          <div className="ai-header">
            <span>{t('ai.header')}</span>
            <div className="ai-header-actions">
              <button className="ai-header-btn" onClick={clearChat} title="Clear Chat">×</button>
              <button className="ai-header-btn" title="Settings">⚙</button>
            </div>
          </div>

          <div className="ai-settings">
            <div className="ai-setting-group">
              <select
                className="ai-setting-select"
                value={aiPersonality}
                onChange={(e) => setAiPersonality(e.target.value)}
              >
                <option value="claude-sonnet">Claude Sonnet 4.5</option>
                <option value="claude-opus">Claude Opus 4</option>
                <option value="gpt4">ChatGPT-4</option>
                <option value="gpt4-turbo">GPT-4 Turbo</option>
                <option value="gpt35">GPT-3.5 Turbo</option>
                <option value="deepseek">DeepSeek V3</option>
                <option value="gemini-pro">Gemini Pro</option>
                <option value="llama3">Llama 3</option>
              </select>
              <select
                className="ai-setting-select"
                value={aiMode}
                onChange={(e) => setAiMode(e.target.value)}
              >
                <option value="architect">Architect</option>
                <option value="coder">Coder</option>
                <option value="reviewer">Reviewer</option>
                <option value="tester">Tester</option>
                <option value="debugger">Debugger</option>
                <option value="optimizer">Optimizer</option>
              </select>
            </div>
          </div>

          <div className="ai-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`ai-message ${message.role === 'user' ? 'ai-message-user' : 'ai-message-assistant'}`}
              >
                <div className="ai-message-avatar">
                  {message.role === 'user' ? 'U' : 'AI'}
                </div>
                <div className="ai-message-content">
                  <div className="ai-message-text">{message.content}</div>
                  <div className="ai-message-time">
                    {message.timestamp.toLocaleTimeString('ar-SA', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="ai-message ai-message-assistant">
                <div className="ai-message-avatar">AI</div>
                <div className="ai-message-content">
                  <div className="ai-typing">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef}></div>
          </div>

          <div className="ai-input-area">
            <textarea
              className="ai-textarea"
              placeholder={t('ai.placeholder')}
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              rows={3}
            />
            <button
              className="ai-send-button"
              onClick={sendMessage}
              disabled={!aiInput.trim()}
            >
              ↗
            </button>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="status-bar">
        <span>⚡</span>
        <span>main</span>
        <span>TypeScript</span>
        <span>UTF-8</span>
        <span>LF</span>
        <span className="status-position">Ln 1, Col 1</span>
      </div>
    </div>
  );
}

export default App;
