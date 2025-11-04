import { useState, useEffect, useRef } from 'react';
import { Titlebar } from './components/Titlebar/Titlebar';
import { Sidebar } from './components/Sidebar/Sidebar';
import { Editor } from './components/Editor/Editor';
import { XTermTerminal } from './components/Terminal/XTermTerminal';
import { CommandPalette } from './components/CommandPalette/CommandPalette';
import { APIProviderModal } from './components/Settings/APIProviderModal';
import { getTranslation, Language } from './translations';
import {
  VscFiles,
  VscSearch,
  VscSourceControl,
  VscDebugAlt,
  VscRobot,
  VscClose,
  VscSettings,
  VscGitCommit,
  VscError,
  VscWarning,
  VscFeedback,
  VscBell,
} from 'react-icons/vsc';
import './App.css';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface APIProvider {
  id: string;
  name: string;
  apiKey: string;
  models: string[];
  baseURL?: string;
  isActive: boolean;
}

// Available AI Models for Code Generation (متخصصة في البرمجة)
const AI_MODELS = [
  // Claude Models (Priority 1) - أقوى في كتابة الأكواد
  {
    group: '🧠 Anthropic Claude (Code)',
    value: 'claude-sonnet-4-20250514',
    label: 'Claude Sonnet 4.5 - Best for Code',
  },
  {
    group: '🧠 Anthropic Claude (Code)',
    value: 'claude-opus-4-20250514',
    label: 'Claude Opus 4 - Most Powerful',
  },
  {
    group: '🧠 Anthropic Claude (Code)',
    value: 'claude-3-5-sonnet-20241022',
    label: 'Claude 3.5 Sonnet - Code Expert',
  },

  // DeepSeek Models (Priority 2) - متخصص 100% في البرمجة
  {
    group: '🔮 DeepSeek (Code Specialist)',
    value: 'deepseek-coder',
    label: 'DeepSeek Coder - Pure Code Model',
  },
  {
    group: '🔮 DeepSeek (Code Specialist)',
    value: 'deepseek-coder-33b-instruct',
    label: 'DeepSeek Coder 33B',
  },

  // Google Models (Priority 3) - نماذج الكود من جوجل
  {
    group: '✨ Google CodeGemini',
    value: 'codechat-bison-32k',
    label: 'CodeChat Bison - Code Expert',
  },
  {
    group: '✨ Google CodeGemini',
    value: 'gemini-1.5-pro',
    label: 'Gemini 1.5 Pro - Advanced Coding',
  },
  { group: '✨ Google CodeGemini', value: 'code-gecko', label: 'Code Gecko - Fast & Efficient' },

  // OpenAI Models (Priority 4) - الأفضل في البرمجة من OpenAI
  { group: '⚡ OpenAI (Code Focused)', value: 'gpt-4o', label: 'GPT-4o - Latest Code Model' },
  {
    group: '⚡ OpenAI (Code Focused)',
    value: 'gpt-4-turbo',
    label: 'GPT-4 Turbo - Advanced Coding',
  },
  { group: '⚡ OpenAI (Code Focused)', value: 'gpt-4', label: 'GPT-4 - Reliable for Code' },
];

interface OpenFile {
  path: string;
  name: string;
  content: string;
  language: string;
}

function App() {
  // const [aiPersonality, setAiPersonality] = useState('claude-sonnet'); // Unused - removed
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
  const [cursorPosition] = useState({ line: 1, column: 1 });
  const [gitBranch] = useState('main');
  const [errors] = useState(0);
  const [warnings] = useState(0);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [isAPIModalOpen, setIsAPIModalOpen] = useState(false);
  const [apiProviders, setApiProviders] = useState<APIProvider[]>([]);
  // const [selectedProvider, setSelectedProvider] = useState<string>(''); // Unused - removed
  const [selectedModel, setSelectedModel] = useState<string>('claude-sonnet-4-20250514');
  const [currentFile, setCurrentFile] = useState<OpenFile | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [openedFolderPath, setOpenedFolderPath] = useState<string>('');
  const menuRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const t = (key: string) => getTranslation(language, key);

  // Load API Providers
  useEffect(() => {
    loadAPIProviders();
  }, []);

  const loadAPIProviders = async () => {
    try {
      // @ts-ignore
      const result = await window.electron?.settings?.get('api.providers');
      if (result?.success && result.value) {
        setApiProviders(result.value);
      }
    } catch (error) {
      console.error('Failed to load API providers:', error);
    }
  };

  const handleSaveProvider = async (provider: APIProvider) => {
    const newProviders = [...apiProviders, provider];
    try {
      // @ts-ignore
      await window.electron?.settings?.set('api.providers', newProviders);
      setApiProviders(newProviders);
    } catch (error) {
      console.error('Failed to save provider:', error);
    }
  };

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
        setShowCommandPalette(true);
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

  // Helper function to get language from file extension
  const getLanguageFromFile = (fileName: string): string => {
    if (fileName.endsWith('.tsx') || fileName.endsWith('.ts')) {return 'typescript';}
    if (fileName.endsWith('.jsx') || fileName.endsWith('.js')) {return 'javascript';}
    if (fileName.endsWith('.css')) {return 'css';}
    if (fileName.endsWith('.json')) {return 'json';}
    if (fileName.endsWith('.html')) {return 'html';}
    if (fileName.endsWith('.py')) {return 'python';}
    if (fileName.endsWith('.java')) {return 'java';}
    if (fileName.endsWith('.cpp') || fileName.endsWith('.c')) {return 'cpp';}
    if (fileName.endsWith('.go')) {return 'go';}
    if (fileName.endsWith('.rs')) {return 'rust';}
    return 'plaintext';
  };

  // Menu Actions
  const handleNewFile = async () => {
    const fileName = prompt(
      'اسم الملف الجديد (مع الامتداد):\nEnter new file name (with extension):'
    );
    if (fileName) {
      const newFile: OpenFile = {
        name: fileName,
        path: '', // Will be set when saved
        language: getLanguageFromFile(fileName),
        content: '',
      };
      setCurrentFile(newFile);
      setFileContent('');
      console.log('✅ New file created:', fileName);
    }
    setOpenMenu(null);
  };

  const handleOpenFile = async () => {
    try {
      // @ts-ignore
      const result = await window.electron?.dialog?.showOpenDialog({
        properties: ['openFile'],
        filters: [
          { name: 'All Files', extensions: ['*'] },
          { name: 'JavaScript', extensions: ['js', 'jsx'] },
          { name: 'TypeScript', extensions: ['ts', 'tsx'] },
          { name: 'CSS', extensions: ['css', 'scss'] },
          { name: 'HTML', extensions: ['html'] },
          { name: 'Python', extensions: ['py'] },
          { name: 'JSON', extensions: ['json'] },
        ],
      });

      if (result?.success && !result.canceled && result.filePaths?.length > 0) {
        const filePath = result.filePaths[0];
        // @ts-ignore
        const fileResult = await window.electron?.fs?.read(filePath);

        if (fileResult?.success) {
          const fileName = filePath.split('/').pop() || filePath.split('\\').pop() || 'untitled';
          const openedFile: OpenFile = {
            name: fileName,
            path: filePath,
            language: getLanguageFromFile(fileName),
            content: fileResult.content || '',
          };
          setCurrentFile(openedFile);
          setFileContent(fileResult.content || '');
          console.log('✅ File opened:', fileName);
        } else {
          alert(`❌ خطأ في قراءة الملف:\n${fileResult?.error || 'Unknown error'}`);
        }
      }
    } catch (error: any) {
      console.error('Error opening file:', error);
      alert(`❌ خطأ: ${error.message}`);
    }
    setOpenMenu(null);
  };

  const handleOpenFolder = async () => {
    try {
      // @ts-ignore
      const result = await window.electron?.dialog?.showOpenDialog({
        properties: ['openDirectory'],
        title: 'اختر مجلد المشروع / Select Project Folder',
      });

      if (result?.success && !result.canceled && result.filePaths?.length > 0) {
        const folderPath = result.filePaths[0];
        console.log('✅ Folder opened:', folderPath);

        // Set the opened folder path to display in FileTree
        setOpenedFolderPath(folderPath);
      }
    } catch (error: any) {
      console.error('Error opening folder:', error);
      alert(`❌ خطأ: ${error.message}`);
    }
    setOpenMenu(null);
  };

  const handleFileSelectFromTree = async (filePath: string) => {
    try {
      console.log('📄 Opening file from tree:', filePath);
      // @ts-ignore
      const fileResult = await window.electron?.fs?.read(filePath);

      if (fileResult?.success) {
        const fileName = filePath.split('/').pop() || filePath.split('\\').pop() || 'untitled';
        const openedFile: OpenFile = {
          name: fileName,
          path: filePath,
          language: getLanguageFromFile(fileName),
          content: fileResult.content || '',
        };
        setCurrentFile(openedFile);
        setFileContent(fileResult.content || '');
        console.log('✅ File opened from tree:', fileName);
      } else {
        alert(`❌ خطأ في قراءة الملف:\n${fileResult?.error || 'Unknown error'}`);
      }
    } catch (error: any) {
      console.error('Error opening file from tree:', error);
      alert(`❌ خطأ: ${error.message}`);
    }
  };

  const handleSave = async () => {
    if (!currentFile) {
      alert('⚠️ لا يوجد ملف مفتوح للحفظ!\nNo file open to save!');
      setOpenMenu(null);
      return;
    }

    try {
      if (!currentFile.path) {
        // No path yet, need to show save dialog
        handleSaveAs();
        return;
      }

      // @ts-ignore
      const result = await window.electron?.fs?.write(currentFile.path, fileContent);

      if (result?.success) {
        console.log('✅ File saved:', currentFile.name);
        alert(`✅ تم حفظ الملف بنجاح!\nFile saved: ${currentFile.name}`);
      } else {
        alert(`❌ خطأ في حفظ الملف:\n${result?.error || 'Unknown error'}`);
      }
    } catch (error: any) {
      console.error('Error saving file:', error);
      alert(`❌ خطأ: ${error.message}`);
    }
    setOpenMenu(null);
  };

  const handleSaveAs = async () => {
    if (!currentFile) {
      alert('⚠️ لا يوجد ملف للحفظ!\nNo file to save!');
      setOpenMenu(null);
      return;
    }

    try {
      // @ts-ignore
      const result = await window.electron?.dialog?.showSaveDialog({
        defaultPath: currentFile.name,
        filters: [
          { name: 'All Files', extensions: ['*'] },
          { name: 'JavaScript', extensions: ['js', 'jsx'] },
          { name: 'TypeScript', extensions: ['ts', 'tsx'] },
          { name: 'CSS', extensions: ['css'] },
          { name: 'HTML', extensions: ['html'] },
          { name: 'Python', extensions: ['py'] },
        ],
      });

      if (result?.success && !result.canceled && result.filePath) {
        // @ts-ignore
        const writeResult = await window.electron?.fs?.write(result.filePath, fileContent);

        if (writeResult?.success) {
          const fileName =
            result.filePath.split('/').pop() || result.filePath.split('\\').pop() || 'untitled';
          setCurrentFile({
            ...currentFile,
            name: fileName,
            path: result.filePath,
          });
          console.log('✅ File saved as:', fileName);
          alert(`✅ تم حفظ الملف بنجاح!\nFile saved: ${fileName}`);
        } else {
          alert(`❌ خطأ في حفظ الملف:\n${writeResult?.error || 'Unknown error'}`);
        }
      }
    } catch (error: any) {
      console.error('Error saving file as:', error);
      alert(`❌ خطأ: ${error.message}`);
    }
    setOpenMenu(null);
  };

  const handleCloseEditor = () => {
    if (currentFile && fileContent) {
      if (
        confirm(
          'هل تريد إغلاق الملف؟ قد تفقد التغييرات غير المحفوظة.\nClose file? Unsaved changes will be lost.'
        )
      ) {
        setCurrentFile(null);
        setFileContent('');
        console.log('✅ File closed');
      }
    } else {
      setCurrentFile(null);
      setFileContent('');
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
    if (!aiInput.trim()) {return;}

    // Check if API provider is configured
    if (apiProviders.length === 0) {
      alert(
        '⚠️ يجب إضافة API Key أولاً!\nاضغط على زر "إضافة API" في الأعلى لإضافة مفتاح API الخاص بك.\n\nPlease add an API Key first!\nClick "Add API" button at the top to add your API key.'
      );
      return;
    }

    const userMessage: Message = {
      id: messages.length + 1,
      role: 'user',
      content: aiInput,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    const currentInput = aiInput;
    setAiInput('');
    setIsTyping(true);

    try {
      // Call actual Electron AI API
      // @ts-ignore
      const result = await window.electron?.ai?.call(currentInput, aiMode, selectedModel);

      if (result?.success) {
        const aiResponse: Message = {
          id: messages.length + 2,
          role: 'assistant',
          content: result.response,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiResponse]);
      } else {
        // Show error message
        const errorMessage: Message = {
          id: messages.length + 2,
          role: 'assistant',
          content: `❌ خطأ في الاتصال بـ AI:\n${result?.error || 'Unknown error'}\n\nيرجى التحقق من:\n1. صحة API Key للموديل المحدد (${selectedModel})\n2. الاتصال بالإنترنت\n3. رصيد API الخاص بك\n\nيمكنك إضافة API Key جديد من زر "إضافة API" في الأعلى.`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error: any) {
      console.error('Error calling AI:', error);
      const errorMessage: Message = {
        id: messages.length + 2,
        role: 'assistant',
        content: `❌ خطأ: ${error.message || 'Failed to connect to AI service'}\n\nتأكد من إضافة API Key الصحيح من زر "إضافة API"`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // Reserved for future use - Demo response generator
  // Commented out to avoid TypeScript unused variable error
  /*
  const generateAIResponse = (question: string, model: string, mode: string): string => {
    const modelName = model === 'claude-sonnet' ? '🧠 Claude Sonnet 4.5' :
                      model === 'claude-opus' ? '💎 Claude Opus 4' :
                      model === 'gpt4' ? '⚡ ChatGPT-4' :
                      model === 'gpt4-turbo' ? '🚀 GPT-4 Turbo' :
                      model === 'deepseek' ? '🔮 DeepSeek V3' :
                      model === 'gemini-pro' ? '✨ Gemini Pro' : model;

    const responses: { [key: string]: string[] } = {
      architect: [
        '🏗️ من منظور معماري، أقترح استخدام هيكلية Microservices مع Event-Driven Architecture...',
        '🏗️ التصميم المثالي لهذه المشكلة هو استخدام Clean Architecture مع DDD...',
        '🏗️ يمكننا تقسيم النظام إلى: Presentation Layer, Business Logic, Data Access...'
      ],
      coder: [
        `💻 كمساعد برمجة، إليك الحل:\n\n\`\`\`javascript\nfunction solution() {\n  // Implementation\n  return result;\n}\n\`\`\``,
        '💻 دعني أساعدك في كتابة هذا الكود. ما هي اللغة البرمجية المطلوبة؟',
        '💻 أستطيع مساعدتك في تطوير هذه الميزة. هل تريد شرح خطوة بخطوة؟'
      ],
      reviewer: [
        '👁️ بعد مراجعة الكود، لاحظت النقاط التالية:\n1. Code Quality ✅\n2. Best Practices ⚠️\n3. Performance 🚀',
        '👁️ الكود جيد بشكل عام، لكن يمكن تحسين:\n- Error handling\n- Type safety\n- Documentation',
        '👁️ مراجعة الكود: الكود نظيف ومنظم، أقترح إضافة Unit Tests'
      ],
      tester: [
        '🧪 خطة الاختبار:\n✓ Unit Tests\n✓ Integration Tests\n✓ E2E Tests\n✓ Performance Tests',
        '🧪 وجدت 3 test cases محتملة. دعني أكتب الاختبارات...',
        '🧪 يجب اختبار: Happy path, Edge cases, Error scenarios'
      ],
      debugger: [
        '🐛 دعني أفحص الخطأ... وجدت المشكلة في السطر X. يبدو أن هناك Null Reference',
        '🐛 هذا الخطأ عادة يحدث بسبب Race Condition. إليك الحل المقترح...',
        '🐛 بعد تحليل الكود، المشكلة في Memory Leak. يمكن إصلاحه بـ...'
      ],
      optimizer: [
        '⚡ تحليل الأداء:\n- Time Complexity: O(n)\n- Space Complexity: O(1)\n- يمكن التحسين بـ Caching',
        '⚡ لتحسين الأداء، أقترح:\n1. Use Memoization\n2. Lazy Loading\n3. Code Splitting',
        '⚡ Performance bottleneck detected! دعني أحسن الكود...'
      ],
      security: [
        '🔐 تحليل الأمان:\n⚠️ SQL Injection vulnerability\n⚠️ XSS risk\n✅ Authentication OK',
        '🔐 مشكلة أمنية محتملة: يجب إضافة Input Validation و Sanitization',
        '🔐 Security Best Practices:\n- Use HTTPS\n- Hash passwords\n- Implement CSRF protection'
      ],
      devops: [
        '🔧 من منظور DevOps:\n- CI/CD Pipeline ✅\n- Docker containerization 🐳\n- Kubernetes deployment ☸️',
        '🔧 أقترح إعداد:\n1. Automated testing\n2. Blue-green deployment\n3. Monitoring & Logging',
        '🔧 Infrastructure as Code: دعني أكتب Terraform/Ansible configuration...'
      ],
    };

    const modeResponses = responses[mode as keyof typeof responses] || responses.coder;
    const randomResponse = modeResponses[Math.floor(Math.random() * modeResponses.length)];

    return `${modelName}\n\n${randomResponse}\n\n💡 هل تريد المزيد من التفاصيل؟`;
  };
  */

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

      <CommandPalette isOpen={showCommandPalette} onClose={() => setShowCommandPalette(false)} />

      {/* Menu Bar */}
      <div className="menu-bar" ref={menuRef}>
        <div className="menu-items">
          <div className="menu-item" onClick={() => toggleMenu('file')}>
            {t('menu.file')}
            <div className={`dropdown-menu ${openMenu === 'file' ? 'show' : ''}`}>
              {/* New Section */}
              <div className="dropdown-item" onClick={handleNewFile}>
                <span>New Text File</span>
                <span className="shortcut-hint">Ctrl+N</span>
              </div>
              <div className="dropdown-item" onClick={handleNewFile}>
                <span>New File...</span>
                <span className="shortcut-hint">Ctrl+Alt+Super+N</span>
              </div>
              <div
                className="dropdown-item"
                onClick={() => {
                  alert('New Window');
                  setOpenMenu(null);
                }}
              >
                <span>New Window</span>
                <span className="shortcut-hint">Ctrl+Shift+N</span>
              </div>
              <div
                className="dropdown-item"
                onClick={() => {
                  alert('New Window with Profile');
                  setOpenMenu(null);
                }}
              >
                <span>New Window with Profile</span>
                <span className="shortcut-hint">▸</span>
              </div>

              <div className="dropdown-separator"></div>

              {/* Open Section */}
              <div className="dropdown-item" onClick={handleOpenFile}>
                <span>Open File...</span>
                <span className="shortcut-hint">Ctrl+O</span>
              </div>
              <div className="dropdown-item" onClick={handleOpenFolder}>
                <span>Open Folder...</span>
                <span className="shortcut-hint">Ctrl+K Ctrl+O</span>
              </div>
              <div
                className="dropdown-item"
                onClick={() => {
                  alert('Open Workspace from File');
                  setOpenMenu(null);
                }}
              >
                <span>Open Workspace from File...</span>
              </div>
              <div
                className="dropdown-item"
                onClick={() => {
                  alert('Open Recent');
                  setOpenMenu(null);
                }}
              >
                <span>Open Recent</span>
                <span className="shortcut-hint">▸</span>
              </div>

              <div className="dropdown-separator"></div>

              {/* Workspace Section */}
              <div
                className="dropdown-item"
                onClick={() => {
                  alert('Add Folder to Workspace');
                  setOpenMenu(null);
                }}
              >
                <span>Add Folder to Workspace...</span>
              </div>
              <div
                className="dropdown-item"
                onClick={() => {
                  alert('Save Workspace As');
                  setOpenMenu(null);
                }}
              >
                <span>Save Workspace As...</span>
              </div>
              <div
                className="dropdown-item"
                onClick={() => {
                  alert('Duplicate Workspace');
                  setOpenMenu(null);
                }}
              >
                <span>Duplicate Workspace</span>
              </div>

              <div className="dropdown-separator"></div>

              {/* Save Section */}
              <div className="dropdown-item" onClick={handleSave}>
                <span>Save</span>
                <span className="shortcut-hint">Ctrl+S</span>
              </div>
              <div className="dropdown-item" onClick={handleSaveAs}>
                <span>Save As...</span>
                <span className="shortcut-hint">Ctrl+Shift+S</span>
              </div>
              <div
                className="dropdown-item"
                onClick={() => {
                  alert('Save All');
                  setOpenMenu(null);
                }}
              >
                <span>Save All</span>
              </div>

              <div className="dropdown-separator"></div>

              {/* Share Section */}
              <div
                className="dropdown-item"
                onClick={() => {
                  alert('Share');
                  setOpenMenu(null);
                }}
              >
                <span>Share</span>
                <span className="shortcut-hint">▸</span>
              </div>

              <div className="dropdown-separator"></div>

              {/* Settings Section */}
              <div
                className="dropdown-item"
                onClick={() => {
                  alert('Auto Save: Enabled');
                  setOpenMenu(null);
                }}
              >
                <span>✓ Auto Save</span>
              </div>
              <div
                className="dropdown-item"
                onClick={() => {
                  alert('Preferences');
                  setOpenMenu(null);
                }}
              >
                <span>Preferences</span>
                <span className="shortcut-hint">▸</span>
              </div>

              <div className="dropdown-separator"></div>

              {/* Close Section */}
              <div
                className="dropdown-item"
                onClick={() => {
                  alert('Revert File');
                  setOpenMenu(null);
                }}
              >
                <span>Revert File</span>
              </div>
              <div className="dropdown-item" onClick={handleCloseEditor}>
                <span>Close Editor</span>
                <span className="shortcut-hint">Ctrl+W</span>
              </div>
              <div
                className="dropdown-item"
                onClick={() => {
                  alert('Close Folder');
                  setOpenMenu(null);
                }}
              >
                <span>Close Folder</span>
                <span className="shortcut-hint">Ctrl+K F</span>
              </div>
              <div
                className="dropdown-item"
                onClick={() => {
                  alert('Close Window');
                  setOpenMenu(null);
                }}
              >
                <span>Close Window</span>
                <span className="shortcut-hint">Alt+F4</span>
              </div>

              <div className="dropdown-separator"></div>

              {/* Exit */}
              <div
                className="dropdown-item"
                onClick={() => {
                  if (confirm('هل تريد الخروج من التطبيق؟\nExit application?')) {
                    // @ts-ignore
                    window.electron?.window?.close();
                  }
                  setOpenMenu(null);
                }}
              >
                <span>Exit</span>
                <span className="shortcut-hint">Ctrl+Q</span>
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
              <div
                className="dropdown-item"
                onClick={() => {
                  alert('Explorer panel');
                  setOpenMenu(null);
                }}
              >
                <span>{t('menu.view.explorer')}</span>
                <span className="shortcut-hint">Ctrl+Shift+E</span>
              </div>
              <div
                className="dropdown-item"
                onClick={() => {
                  alert('Search panel');
                  setOpenMenu(null);
                }}
              >
                <span>{t('menu.view.search')}</span>
                <span className="shortcut-hint">Ctrl+Shift+F</span>
              </div>
              <div
                className="dropdown-item"
                onClick={() => {
                  alert('Extensions panel');
                  setOpenMenu(null);
                }}
              >
                <span>{t('menu.view.extensions')}</span>
                <span className="shortcut-hint">Ctrl+Shift+X</span>
              </div>
              <div className="dropdown-separator"></div>
              <div
                className="dropdown-item"
                onClick={() => {
                  alert('Terminal panel');
                  setOpenMenu(null);
                }}
              >
                <span>{t('menu.view.terminal')}</span>
                <span className="shortcut-hint">Ctrl+`</span>
              </div>
            </div>
          </div>

          <div className="menu-item" onClick={() => toggleMenu('go')}>
            {t('menu.go')}
            <div className={`dropdown-menu ${openMenu === 'go' ? 'show' : ''}`}>
              <div
                className="dropdown-item"
                onClick={() => {
                  alert('Go back');
                  setOpenMenu(null);
                }}
              >
                <span>{t('menu.go.back')}</span>
                <span className="shortcut-hint">Ctrl+Alt+←</span>
              </div>
              <div
                className="dropdown-item"
                onClick={() => {
                  alert('Go forward');
                  setOpenMenu(null);
                }}
              >
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

        <button
          className="api-button"
          onClick={() => setIsAPIModalOpen(true)}
          title="إدارة مزودي API - اضغط لإضافة مزود جديد"
          style={{
            background: '#3c3c3c',
            border: '1px solid #555',
            padding: '6px 14px',
            borderRadius: '4px',
            color: '#cccccc',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#454545';
            e.currentTarget.style.borderColor = '#666';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#3c3c3c';
            e.currentTarget.style.borderColor = '#555';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          🔑 إضافة API ({apiProviders.length})
        </button>

        <div className="language-selector">
          <select value={language} onChange={handleLanguageChange}>
            <option value="en">English</option>
            <option value="ar">العربية</option>
            <option value="de">Deutsch</option>
          </select>
        </div>
      </div>

      <APIProviderModal
        isOpen={isAPIModalOpen}
        onClose={() => setIsAPIModalOpen(false)}
        onSave={handleSaveProvider}
      />

      <div className="app-body">
        {/* Activity Bar */}
        <div className="activity-bar">
          <div className="activity-icon active" title="Explorer">
            <VscFiles size={24} />
          </div>
          <div className="activity-icon" title="Search">
            <VscSearch size={24} />
          </div>
          <div className="activity-icon" title="Source Control">
            <VscSourceControl size={24} />
          </div>
          <div className="activity-icon" title="Debug">
            <VscDebugAlt size={24} />
          </div>
          <div className="activity-icon" title="AI Assistant">
            <VscRobot size={24} />
          </div>
        </div>

        <Sidebar openedFolderPath={openedFolderPath} onFileSelect={handleFileSelectFromTree} />

        <div className="app-main">
          <Editor />
          <XTermTerminal />
        </div>

        {/* AI Chat Panel */}
        <div className="ai-panel">
          <div className="ai-header">
            <span>{t('ai.header')}</span>
            <div className="ai-header-actions">
              <button className="ai-header-btn" onClick={clearChat} title="Clear Chat">
                <VscClose size={16} />
              </button>
              <button className="ai-header-btn" title="Settings">
                <VscSettings size={16} />
              </button>
            </div>
          </div>

          <div className="ai-settings">
            <div className="ai-setting-group">
              <label className="ai-setting-label">🤖 AI Model</label>
              {apiProviders.length === 0 ? (
                <div
                  style={{
                    padding: '10px',
                    background: '#3c3c3c',
                    borderRadius: '4px',
                    fontSize: '11px',
                    color: '#858585',
                    marginBottom: '5px',
                  }}
                >
                  ⚠️ لم تضف API Key بعد. اضغط "إضافة API" في الأعلى لإضافة مفتاح API
                </div>
              ) : null}
              <select
                className="ai-setting-select"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                style={{ fontSize: '13px' }}
              >
                {AI_MODELS.reduce((acc, model, index, array) => {
                  // Check if this is the first item or if the group changed
                  if (index === 0 || model.group !== array[index - 1].group) {
                    acc.push(
                      <optgroup key={model.group} label={model.group}>
                        <option key={model.value} value={model.value}>
                          {model.label}
                        </option>
                      </optgroup>
                    );
                  } else {
                    // Add to the existing optgroup
                    const lastGroup = acc[acc.length - 1];
                    const children = Array.isArray(lastGroup.props.children)
                      ? lastGroup.props.children
                      : [lastGroup.props.children];

                    acc[acc.length - 1] = (
                      <optgroup key={model.group} label={model.group}>
                        {[
                          ...children,
                          <option key={model.value} value={model.value}>
                            {model.label}
                          </option>,
                        ]}
                      </optgroup>
                    );
                  }
                  return acc;
                }, [] as JSX.Element[])}
              </select>
            </div>

            <div className="ai-setting-group">
              <label className="ai-setting-label">👤 AI Personality</label>
              <select
                className="ai-setting-select"
                value={aiMode}
                onChange={(e) => setAiMode(e.target.value)}
              >
                <option value="architect">🏗️ Architect - System Designer</option>
                <option value="coder">💻 Coder - Code Writer</option>
                <option value="reviewer">👁️ Reviewer - Code Analyst</option>
                <option value="tester">🧪 Tester - QA Expert</option>
                <option value="debugger">🐛 Debugger - Problem Solver</option>
                <option value="optimizer">⚡ Optimizer - Performance Guru</option>
                <option value="security">🔐 Security - Security Expert</option>
                <option value="devops">🔧 DevOps - Infrastructure Pro</option>
              </select>
            </div>
          </div>

          <div className="ai-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`ai-message ${message.role === 'user' ? 'ai-message-user' : 'ai-message-assistant'}`}
              >
                <div className="ai-message-avatar">{message.role === 'user' ? 'U' : 'AI'}</div>
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
            <button className="ai-send-button" onClick={sendMessage} disabled={!aiInput.trim()}>
              ↗
            </button>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="status-bar">
        <div className="status-left">
          <span className="status-item status-git" title="Git Branch">
            <VscGitCommit size={16} />
            <span>{gitBranch}</span>
          </span>
          <span className="status-item status-errors" title="Errors">
            <VscError size={16} />
            <span>{errors}</span>
          </span>
          <span className="status-item status-warnings" title="Warnings">
            <VscWarning size={16} />
            <span>{warnings}</span>
          </span>
        </div>
        <div className="status-right">
          <span className="status-item" title="Feedback">
            <VscFeedback size={16} />
          </span>
          <span className="status-item" title="Notifications">
            <VscBell size={16} />
          </span>
          <span className="status-item status-language" title="Language">
            TypeScript
          </span>
          <span className="status-item" title="Encoding">
            UTF-8
          </span>
          <span className="status-item" title="Line Ending">
            LF
          </span>
          <span className="status-item status-position" title="Line:Column">
            Ln {cursorPosition.line}, Col {cursorPosition.column}
          </span>
        </div>
      </div>
    </div>
  );
}

export default App;
