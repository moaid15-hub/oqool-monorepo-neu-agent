import React, { useState, useRef, useEffect, useCallback } from 'react';

interface TerminalTab {
  id: string;
  name: string;
  type: 'bash' | 'node' | 'python' | 'powershell';
  output: TerminalLine[];
  input: string;
  workingDirectory: string;
  isActive?: boolean;
}

interface TerminalLine {
  id: string;
  content: string;
  type: 'command' | 'output' | 'error' | 'success' | 'info' | 'warning';
  timestamp: Date;
}

const Terminal: React.FC = () => {
  const [tabs, setTabs] = useState<TerminalTab[]>([
    {
      id: '1',
      name: 'bash',
      type: 'bash',
      workingDirectory: '/workspace/oqoolai-cloud-ide',
      input: '',
      output: [
        {
          id: '1',
          content: '🚀 طرفية OqoolAI Cloud IDE - الإصدار المطور 2.1.0',
          type: 'success',
          timestamp: new Date(),
        },
        {
          id: '2',
          content: '═'.repeat(60),
          type: 'info',
          timestamp: new Date(),
        },
        {
          id: '3',
          content: '🎯 الأوامر المتاحة الجديدة:',
          type: 'info',
          timestamp: new Date(),
        },
        {
          id: '4',
          content: '   help      │ عرض جميع الأوامر مع الأمثلة',
          type: 'info',
          timestamp: new Date(),
        },
        {
          id: '5',
          content: '   clear     │ مسح الشاشة',
          type: 'info',
          timestamp: new Date(),
        },
        {
          id: '6',
          content: '   ls        │ عرض الملفات والمجلدات',
          type: 'info',
          timestamp: new Date(),
        },
        {
          id: '7',
          content: '   tree      │ عرض هيكل المشروع',
          type: 'info',
          timestamp: new Date(),
        },
        {
          id: '8',
          content: '   ai        │ مساعد الذكاء الاصطناعي المحسن',
          type: 'info',
          timestamp: new Date(),
        },
        {
          id: '9',
          content: '   code      │ فتح محرر الكود',
          type: 'info',
          timestamp: new Date(),
        },
        {
          id: '10',
          content: '   npm       │ إدارة الحزم والمكتبات',
          type: 'info',
          timestamp: new Date(),
        },
        {
          id: '11',
          content: '   git       │ عمليات Git المتقدمة',
          type: 'info',
          timestamp: new Date(),
        },
        {
          id: '12',
          content: '',
          type: 'output',
          timestamp: new Date(),
        },
        {
          id: '13',
          content: '💡 اكتب "help" للحصول على تفاصيل أكثر أو "demo" لعرض توضيحي',
          type: 'warning',
          timestamp: new Date(),
        },
        {
          id: '14',
          content: '🔥 جديد: دعم متعدد اللغات، إكمال تلقائي، وتصدير السجلات',
          type: 'success',
          timestamp: new Date(),
        },
      ],
    },
  ]);

  const [activeTabId, setActiveTabId] = useState<string>('1');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const getActiveTab = () => tabs.find((tab) => tab.id === activeTabId);

  const scrollToBottom = useCallback(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [tabs, scrollToBottom]);

  const addLine = (content: string, type: TerminalLine['type'] = 'output') => {
    const newLine: TerminalLine = {
      id: Date.now().toString(),
      content,
      type,
      timestamp: new Date(),
    };

    setTabs((prevTabs) =>
      prevTabs.map((tab) =>
        tab.id === activeTabId ? { ...tab, output: [...tab.output, newLine] } : tab
      )
    );
  };

  const executeCommand = (command: string) => {
    if (!command.trim()) return;

    const activeTab = getActiveTab();
    if (!activeTab) return;

    // إضافة الأمر للتاريخ
    setCommandHistory((prev) => [...prev.slice(-20), command]);
    setHistoryIndex(-1);

    // إضافة الأمر لإخراج الطرفية
    addLine(`${activeTab.workingDirectory}$ ${command}`, 'command');

    // تنفيذ الأمر
    const cmd = command.toLowerCase().trim();
    const args = command.split(' ').slice(1);

    switch (cmd.split(' ')[0]) {
      case 'help':
        executeHelpCommand(args);
        break;
      case 'clear':
        executeClearCommand();
        break;
      case 'ls':
        executeLsCommand(args);
        break;
      case 'tree':
        executeTreeCommand();
        break;
      case 'pwd':
        addLine(activeTab.workingDirectory, 'output');
        break;
      case 'cd':
        executeCdCommand(args);
        break;
      case 'ai':
        executeAiCommand(args);
        break;
      case 'code':
        executeCodeCommand(args);
        break;
      case 'npm':
        executeNpmCommand(args);
        break;
      case 'git':
        executeGitCommand(args);
        break;
      case 'demo':
        executeDemoCommand();
        break;
      case 'export':
        executeExportCommand(args);
        break;
      case 'theme':
        executeThemeCommand(args);
        break;
      case 'version':
        executeVersionCommand();
        break;
      case 'whoami':
        addLine('developer@oqoolai-cloud', 'success');
        break;
      case 'date':
        addLine(new Date().toLocaleString('ar-SA'), 'output');
        break;
      case 'echo':
        addLine(args.join(' '), 'output');
        break;
      default:
        addLine(`الأمر غير موجود: ${cmd}`, 'error');
        addLine('اكتب "help" لرؤية الأوامر المتاحة', 'info');
    }

    // مسح الإدخال
    setTabs((prevTabs) =>
      prevTabs.map((tab) => (tab.id === activeTabId ? { ...tab, input: '' } : tab))
    );
  };

  const executeHelpCommand = (args: string[]) => {
    if (args.length > 0) {
      // مساعدة مفصلة لأمر معين
      const helpFor = args[0];
      switch (helpFor) {
        case 'ai':
          addLine('🤖 أوامر الذكاء الاصطناعي:', 'info');
          addLine('  ai help     - مساعدة الذكاء الاصطناعي', 'output');
          addLine('  ai code     - توليد كود', 'output');
          addLine('  ai explain  - شرح الكود', 'output');
          addLine('  ai fix      - إصلاح الأخطاء', 'output');
          break;
        case 'git':
          addLine('🌿 أوامر Git:', 'info');
          addLine('  git status  - حالة المستودع', 'output');
          addLine('  git add     - إضافة ملفات', 'output');
          addLine('  git commit  - حفظ التغييرات', 'output');
          addLine('  git push    - رفع التغييرات', 'output');
          break;
        default:
          addLine(`لا توجد مساعدة مفصلة للأمر: ${helpFor}`, 'error');
      }
      return;
    }

    // مساعدة عامة
    addLine('🎯 نظام أوامر OqoolAI المتقدم:', 'success');
    addLine('', 'output');
    addLine('📁 إدارة الملفات:', 'info');
    addLine('  ls          - عرض محتويات المجلد', 'output');
    addLine('  tree        - عرض هيكل المشروع', 'output');
    addLine('  pwd         - المجلد الحالي', 'output');
    addLine('  cd <path>   - تغيير المجلد', 'output');
    addLine('', 'output');
    addLine('🤖 الذكاء الاصطناعي:', 'info');
    addLine('  ai          - مساعد الذكاء الاصطناعي', 'output');
    addLine('  ai code     - توليد كود', 'output');
    addLine('  ai explain  - شرح الكود', 'output');
    addLine('', 'output');
    addLine('⚙️ أدوات التطوير:', 'info');
    addLine('  npm         - إدارة حزم Node.js', 'output');
    addLine('  git         - إدارة الإصدارات', 'output');
    addLine('  code        - فتح المحرر', 'output');
    addLine('', 'output');
    addLine('🎨 أخرى:', 'info');
    addLine('  clear       - مسح الشاشة', 'output');
    addLine('  demo        - عرض توضيحي', 'output');
    addLine('  export      - تصدير السجلات', 'output');
    addLine('  theme       - تغيير السمة', 'output');
    addLine('', 'output');
    addLine('💡 استخدم "help <command>" للحصول على تفاصيل أكثر', 'warning');
  };

  const executeClearCommand = () => {
    setTabs((prevTabs) =>
      prevTabs.map((tab) => (tab.id === activeTabId ? { ...tab, output: [] } : tab))
    );
  };

  const executeLsCommand = (args: string[]) => {
    const showDetails = args.includes('-l') || args.includes('--long');
    const showHidden = args.includes('-a') || args.includes('--all');

    addLine('📁 محتويات المجلد:', 'info');

    const files = [
      { name: 'src/', type: 'dir', size: '-', date: '2024-03-16' },
      { name: 'public/', type: 'dir', size: '-', date: '2024-03-15' },
      { name: 'docs/', type: 'dir', size: '-', date: '2024-03-14' },
      { name: 'package.json', type: 'file', size: '2.1K', date: '2024-03-16' },
      { name: 'README.md', type: 'file', size: '4.5K', date: '2024-03-15' },
      { name: 'vite.config.ts', type: 'file', size: '445B', date: '2024-03-14' },
      { name: 'tsconfig.json', type: 'file', size: '678B', date: '2024-03-13' },
    ];

    if (showHidden) {
      files.unshift(
        { name: '.env', type: 'file', size: '123B', date: '2024-03-12' },
        { name: '.gitignore', type: 'file', size: '234B', date: '2024-03-11' }
      );
    }

    files.forEach((file) => {
      const icon = file.type === 'dir' ? '📁' : '📄';
      const color = file.type === 'dir' ? 'info' : 'output';

      if (showDetails) {
        addLine(`${icon} ${file.name.padEnd(20)} ${file.size.padEnd(8)} ${file.date}`, color);
      } else {
        addLine(`${icon} ${file.name}`, color);
      }
    });
  };

  const executeTreeCommand = () => {
    addLine('🌳 هيكل المشروع:', 'info');
    addLine('📁 oqoolai-cloud-ide/', 'info');
    addLine('├── 📁 src/', 'output');
    addLine('│   ├── 📁 components/', 'output');
    addLine('│   │   ├── 📄 Header.tsx', 'output');
    addLine('│   │   ├── 📄 FileTree.tsx', 'output');
    addLine('│   │   ├── 📄 Editor.tsx', 'output');
    addLine('│   │   └── 📄 Terminal.tsx', 'output');
    addLine('│   ├── 📁 hooks/', 'output');
    addLine('│   ├── 📁 styles/', 'output');
    addLine('│   └── 📄 App.tsx', 'output');
    addLine('├── 📁 public/', 'output');
    addLine('├── 📄 package.json', 'output');
    addLine('└── 📄 README.md', 'output');
  };

  const executeCdCommand = (args: string[]) => {
    if (args.length === 0) {
      addLine('الاستخدام: cd <path>', 'error');
      return;
    }

    const path = args[0];
    // محاكاة تغيير المجلد
    if (path === '..') {
      addLine('تم الانتقال للمجلد الأصل', 'success');
    } else if (path.startsWith('/') || path.includes('src') || path.includes('public')) {
      addLine(`تم الانتقال إلى: ${path}`, 'success');
      setTabs((prevTabs) =>
        prevTabs.map((tab) =>
          tab.id === activeTabId
            ? { ...tab, workingDirectory: `/workspace/oqoolai-cloud-ide/${path}` }
            : tab
        )
      );
    } else {
      addLine(`المجلد غير موجود: ${path}`, 'error');
    }
  };

  const executeAiCommand = (args: string[]) => {
    if (args.length === 0) {
      addLine('🤖 مساعد الذكاء الاصطناعي OqoolAI متاح!', 'success');
      addLine('استخدم الأوامر التالية:', 'info');
      addLine('  ai code     - توليد كود', 'output');
      addLine('  ai explain  - شرح الكود', 'output');
      addLine('  ai fix      - إصلاح الأخطاء', 'output');
      addLine('  ai review   - مراجعة الكود', 'output');
      return;
    }

    const subCommand = args[0];
    switch (subCommand) {
      case 'code':
        addLine('🔄 جاري توليد الكود...', 'info');
        setTimeout(() => {
          addLine('✅ تم توليد مثال كود React:', 'success');
          addLine('```typescript', 'output');
          addLine('const MyComponent = () => {', 'output');
          addLine('  return <div>مرحبا من OqoolAI!</div>;', 'output');
          addLine('};```', 'output');
        }, 1500);
        break;
      case 'explain':
        addLine('📖 شرح الكود الحالي...', 'info');
        setTimeout(() => {
          addLine('✅ هذا مكون React يعرض رسالة ترحيب', 'success');
        }, 1000);
        break;
      default:
        addLine(`أمر AI غير معروف: ${subCommand}`, 'error');
    }
  };

  const executeCodeCommand = (args: string[]) => {
    addLine('🚀 فتح محرر الكود...', 'success');
    addLine('استخدم الواجهة الرئيسية للتحرير', 'info');
  };

  const executeNpmCommand = (args: string[]) => {
    if (args.length === 0) {
      addLine('الاستخدام: npm <command>', 'error');
      return;
    }

    const command = args[0];
    switch (command) {
      case 'install':
        addLine('📦 جاري تثبيت الحزم...', 'info');
        setTimeout(() => {
          addLine('✅ تم تثبيت جميع الحزم بنجاح', 'success');
        }, 2000);
        break;
      case 'start':
        addLine('🚀 بدء الخادم التطويري...', 'info');
        setTimeout(() => {
          addLine('✅ الخادم يعمل على http://localhost:3001', 'success');
        }, 1500);
        break;
      case 'build':
        addLine('🔨 بناء المشروع للإنتاج...', 'info');
        setTimeout(() => {
          addLine('✅ تم بناء المشروع في مجلد dist/', 'success');
        }, 3000);
        break;
      default:
        addLine(`أمر npm غير معروف: ${command}`, 'error');
    }
  };

  const executeGitCommand = (args: string[]) => {
    if (args.length === 0) {
      addLine('الاستخدام: git <command>', 'error');
      return;
    }

    const command = args[0];
    switch (command) {
      case 'status':
        addLine('🌿 حالة المستودع:', 'info');
        addLine('On branch main', 'output');
        addLine('Changes not staged for commit:', 'warning');
        addLine('  modified: src/components/Terminal.tsx', 'output');
        addLine('  modified: src/index.css', 'output');
        break;
      case 'add':
        addLine('✅ تم إضافة الملفات للمرحلة', 'success');
        break;
      case 'commit':
        addLine('✅ تم حفظ التغييرات', 'success');
        break;
      default:
        addLine(`أمر git غير معروف: ${command}`, 'error');
    }
  };

  const executeDemoCommand = () => {
    addLine('🎭 عرض توضيحي لـ OqoolAI Cloud IDE:', 'success');
    addLine('', 'output');

    let delay = 0;
    const demoSteps = [
      { text: '1️⃣ تحرير الملفات بذكاء', delay: 500 },
      { text: '2️⃣ مساعد AI متقدم', delay: 1000 },
      { text: '3️⃣ طرفية تفاعلية', delay: 1500 },
      { text: '4️⃣ إدارة المشاريع', delay: 2000 },
      { text: '5️⃣ تعاون فوري', delay: 2500 },
      { text: '✨ مرحباً بكم في المستقبل!', delay: 3000 },
    ];

    demoSteps.forEach((step) => {
      setTimeout(() => {
        addLine(step.text, 'success');
      }, step.delay);
    });
  };

  const executeExportCommand = (args: string[]) => {
    const format = args[0] || 'txt';
    addLine(`📤 تصدير سجلات الطرفية بصيغة ${format.toUpperCase()}...`, 'info');
    setTimeout(() => {
      addLine('✅ تم تصدير السجلات بنجاح', 'success');
      addLine('📁 الملف: terminal-export.txt', 'output');
    }, 1000);
  };

  const executeThemeCommand = (args: string[]) => {
    const theme = args[0] || 'dark';
    addLine(`🎨 تغيير السمة إلى: ${theme}`, 'info');
    addLine('✅ تم تطبيق السمة الجديدة', 'success');
  };

  const executeVersionCommand = () => {
    addLine('🚀 OqoolAI Cloud IDE', 'success');
    addLine('الإصدار: 2.1.0 (مطور)', 'info');
    addLine('التقنيات: React + TypeScript + Vite', 'output');
    addLine('الذكاء الاصطناعي: DeepSeek + GPT', 'output');
    addLine('© 2025 OqoolAI - صنع بحب للمطورين العرب 🇸🇦', 'success');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    const activeTab = getActiveTab();
    if (!activeTab) return;

    if (e.key === 'Enter') {
      executeCommand(activeTab.input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        const command = commandHistory[commandHistory.length - 1 - newIndex];
        setTabs((prevTabs) =>
          prevTabs.map((tab) => (tab.id === activeTabId ? { ...tab, input: command } : tab))
        );
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        const command = commandHistory[commandHistory.length - 1 - newIndex];
        setTabs((prevTabs) =>
          prevTabs.map((tab) => (tab.id === activeTabId ? { ...tab, input: command } : tab))
        );
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setTabs((prevTabs) =>
          prevTabs.map((tab) => (tab.id === activeTabId ? { ...tab, input: '' } : tab))
        );
      }
    }
  };

  const handleInputChange = (value: string) => {
    setTabs((prevTabs) =>
      prevTabs.map((tab) => (tab.id === activeTabId ? { ...tab, input: value } : tab))
    );
  };

  const addNewTerminal = (type: TerminalTab['type'] = 'bash') => {
    const newTab: TerminalTab = {
      id: Date.now().toString(),
      name: `${type}-${tabs.length + 1}`,
      type,
      input: '',
      workingDirectory: '/workspace/oqoolai-cloud-ide',
      output: [
        {
          id: '1',
          content: `🆕 طرفية ${type} جديدة - جاهزة للاستخدام`,
          type: 'success',
          timestamp: new Date(),
        },
      ],
    };

    setTabs([...tabs, newTab]);
    setActiveTabId(newTab.id);
  };

  const closeTab = (tabId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();

    if (tabs.length === 1) return;

    const newTabs = tabs.filter((tab) => tab.id !== tabId);
    setTabs(newTabs);

    if (activeTabId === tabId) {
      setActiveTabId(newTabs[0].id);
    }
  };

  const getTypeIcon = (type: TerminalTab['type']) => {
    switch (type) {
      case 'bash':
        return '🐚';
      case 'node':
        return '🟢';
      case 'python':
        return '🐍';
      case 'powershell':
        return '💙';
      default:
        return '🖥️';
    }
  };

  const getLineColor = (type: TerminalLine['type']) => {
    switch (type) {
      case 'command':
        return 'var(--success-color)';
      case 'error':
        return 'var(--error-color)';
      case 'success':
        return 'var(--success-color)';
      case 'warning':
        return 'var(--warning-color)';
      case 'info':
        return 'var(--info-color)';
      default:
        return 'var(--text-primary)';
    }
  };

  const activeTab = getActiveTab();

  return (
    <div className="modern-terminal">
      {/* شريط التبويبات */}
      <div className="terminal-tabs">
        <div className="terminal-tabs-list">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`terminal-tab ${tab.id === activeTabId ? 'active' : ''}`}
              onClick={() => setActiveTabId(tab.id)}
            >
              <span className="terminal-tab-icon">{getTypeIcon(tab.type)}</span>
              <span className="terminal-tab-name">{tab.name}</span>
              {tabs.length > 1 && (
                <button
                  className="terminal-tab-close"
                  onClick={(e) => closeTab(tab.id, e)}
                  title="إغلاق الطرفية"
                >
                  ✕
                </button>
              )}
            </div>
          ))}

          <div className="terminal-add-dropdown">
            <button className="terminal-add-btn" title="إضافة طرفية جديدة">
              ➕
            </button>
            <div className="terminal-add-menu">
              <button onClick={() => addNewTerminal('bash')}>🐚 Bash</button>
              <button onClick={() => addNewTerminal('node')}>🟢 Node.js</button>
              <button onClick={() => addNewTerminal('python')}>🐍 Python</button>
              <button onClick={() => addNewTerminal('powershell')}>💙 PowerShell</button>
            </div>
          </div>
        </div>

        <div className="terminal-controls">
          <button className="terminal-control-btn" title="تصدير السجل">
            📤
          </button>
          <button className="terminal-control-btn" title="مسح الكل">
            🗑️
          </button>
          <button className="terminal-control-btn" title="الإعدادات">
            ⚙️
          </button>
        </div>
      </div>

      {/* محتوى الطرفية */}
      <div className="terminal-content">
        <div ref={terminalRef} className="terminal-output">
          {activeTab?.output.map((line) => (
            <div
              key={line.id}
              className={`terminal-line ${line.type}`}
              style={{ color: getLineColor(line.type) }}
            >
              <span className="line-timestamp">
                {line.timestamp.toLocaleTimeString('ar-SA', {
                  hour12: false,
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}
              </span>
              <span className="line-content">{line.content}</span>
            </div>
          ))}
        </div>

        {/* سطر الإدخال */}
        <div className="terminal-input-line">
          <span className="terminal-prompt">
            <span className="prompt-user">dev</span>
            <span className="prompt-separator">@</span>
            <span className="prompt-host">oqoolai</span>
            <span className="prompt-separator">:</span>
            <span className="prompt-path">
              ~{activeTab?.workingDirectory.replace('/workspace/oqoolai-cloud-ide', '')}
            </span>
            <span className="prompt-symbol">$</span>
          </span>
          <input
            ref={inputRef}
            type="text"
            value={activeTab?.input || ''}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyPress}
            className="terminal-input"
            placeholder="اكتب أمراً هنا..."
            autoFocus
          />
        </div>
      </div>

      {/* شريط الحالة */}
      <div className="terminal-status">
        <div className="status-left">
          <span className="status-indicator online">●</span>
          <span>متصل</span>
          <span className="status-separator">|</span>
          <span>{activeTab?.type.toUpperCase()}</span>
          <span className="status-separator">|</span>
          <span>{activeTab?.output.length || 0} سطر</span>
        </div>

        <div className="status-center">
          <span>⌨️ استخدم ↑/↓ للتاريخ | Tab للإكمال</span>
        </div>

        <div className="status-right">
          <span>{new Date().toLocaleTimeString('ar-SA')}</span>
        </div>
      </div>
    </div>
  );
};

export default Terminal;
