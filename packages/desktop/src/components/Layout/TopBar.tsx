import React, { useState, useEffect, useRef } from 'react';
import { APIProviderModal } from '../Settings/APIProviderModal';
import './TopBar.css';

interface MenuItem {
  label?: string;
  action?: () => void;
  shortcut?: string;
  separator?: boolean;
  submenu?: MenuItem[];
}

interface MenuConfig {
  [key: string]: MenuItem[];
}

interface APIProvider {
  id: string;
  name: string;
  apiKey: string;
  models: string[];
  baseURL?: string;
  isActive: boolean;
}

const TopBar: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [language, setLanguage] = useState<'en' | 'ar' | 'de'>('ar');
  const [isAPIModalOpen, setIsAPIModalOpen] = useState(false);
  const [apiProviders, setApiProviders] = useState<APIProvider[]>([]);
  const menuRef = useRef<HTMLDivElement>(null);

  // تحميل API Providers
  useEffect(() => {
    loadAPIProviders();
  }, []);

  const loadAPIProviders = async () => {
    try {
      // @ts-ignore
      const result = await window.electron.settings.get('api.providers');
      if (result.success && result.value) {
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
      await window.electron.settings.set('api.providers', newProviders);
      setApiProviders(newProviders);
    } catch (error) {
      console.error('Failed to save provider:', error);
    }
  };

  // إغلاق القائمة عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Translations
  const translations = {
    en: {
      file: 'File',
      edit: 'Edit',
      view: 'View',
      go: 'Go',
      search: 'Search',
    },
    ar: {
      file: 'ملف',
      edit: 'تحرير',
      view: 'عرض',
      go: 'انتقال',
      search: 'بحث',
    },
    de: {
      file: 'Datei',
      edit: 'Bearbeiten',
      view: 'Ansicht',
      go: 'Gehe zu',
      search: 'Suchen',
    },
  };

  // Menu configurations (simplified for brevity)
  const menuConfigs: Record<string, MenuConfig> = {
    ar: {
      file: [
        { label: 'ملف جديد', shortcut: 'Ctrl+N' },
        { label: 'فتح ملف...', shortcut: 'Ctrl+O' },
        { separator: true },
        { label: 'حفظ', shortcut: 'Ctrl+S' },
        { label: 'حفظ باسم...', shortcut: 'Ctrl+Shift+S' },
      ],
      edit: [
        { label: 'تراجع', shortcut: 'Ctrl+Z' },
        { label: 'إعادة', shortcut: 'Ctrl+Y' },
        { separator: true },
        { label: 'قص', shortcut: 'Ctrl+X' },
        { label: 'نسخ', shortcut: 'Ctrl+C' },
        { label: 'لصق', shortcut: 'Ctrl+V' },
      ],
      view: [
        { label: 'المستكشف', shortcut: 'Ctrl+Shift+E' },
        { label: 'بحث', shortcut: 'Ctrl+Shift+F' },
        { label: 'الطرفية', shortcut: 'Ctrl+`' },
      ],
      go: [
        { label: 'انتقل إلى الملف...', shortcut: 'Ctrl+P' },
        { label: 'انتقل إلى السطر...', shortcut: 'Ctrl+G' },
      ],
    },
    en: {
      file: [
        { label: 'New File', shortcut: 'Ctrl+N' },
        { label: 'Open File...', shortcut: 'Ctrl+O' },
        { separator: true },
        { label: 'Save', shortcut: 'Ctrl+S' },
      ],
      edit: [
        { label: 'Undo', shortcut: 'Ctrl+Z' },
        { label: 'Redo', shortcut: 'Ctrl+Y' },
      ],
      view: [
        { label: 'Explorer', shortcut: 'Ctrl+Shift+E' },
        { label: 'Terminal', shortcut: 'Ctrl+`' },
      ],
      go: [{ label: 'Go to File...', shortcut: 'Ctrl+P' }],
    },
    de: {
      file: [
        { label: 'Neue Datei', shortcut: 'Ctrl+N' },
        { label: 'Speichern', shortcut: 'Ctrl+S' },
      ],
      edit: [{ label: 'Rückgängig', shortcut: 'Ctrl+Z' }],
      view: [{ label: 'Explorer', shortcut: 'Ctrl+Shift+E' }],
      go: [{ label: 'Gehe zu Datei...', shortcut: 'Ctrl+P' }],
    },
  };

  const handleMenuClick = (menuName: string) => {
    setActiveMenu(activeMenu === menuName ? null : menuName);
  };

  const handleMenuItemClick = (item: MenuItem) => {
    if (item.action) {
      item.action();
    }
    setActiveMenu(null);
  };

  const currentMenus = menuConfigs[language];
  const t = translations[language];

  return (
    <div className="top-bar" ref={menuRef}>
      {/* Menu Items - no-drag */}
      <div className="menu-items" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
        {Object.keys(currentMenus).map((menuKey) => (
          <div key={menuKey} className="menu-item-container">
            <div
              className={`menu-item ${activeMenu === menuKey ? 'active' : ''}`}
              onClick={() => handleMenuClick(menuKey)}
            >
              {t[menuKey as keyof typeof t]}
            </div>

            {activeMenu === menuKey && (
              <div className="dropdown-menu show">
                {currentMenus[menuKey].map((item, index) =>
                  item.separator ? (
                    <div key={`sep-${index}`} className="dropdown-separator" />
                  ) : (
                    <div
                      key={index}
                      className="dropdown-item"
                      onClick={() => handleMenuItemClick(item)}
                    >
                      <span>{item.label}</span>
                      {item.shortcut && <span className="shortcut-hint">{item.shortcut}</span>}
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Search Bar - DRAGGABLE AREA (يقدر يسحب من هنا) */}
      <div className="search-bar">
        <div className="search-bar__drag-layer" aria-hidden />
        <input
          type="text"
          placeholder={t.search}
          className="search-input"
          style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
        />
      </div>

      {/* API Button - no-drag */}
      <button
        className="api-button"
        onClick={() => setIsAPIModalOpen(true)}
        style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
        title="إدارة مزودي API"
      >
        🔑 API ({apiProviders.length})
      </button>

      {/* Language Selector - no-drag */}
      <div
        className="language-selector"
        style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
      >
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as 'en' | 'ar' | 'de')}
          className="language-select"
        >
          <option value="ar">العربية</option>
          <option value="en">English</option>
          <option value="de">Deutsch</option>
        </select>
      </div>

      {/* API Provider Modal */}
      <APIProviderModal
        isOpen={isAPIModalOpen}
        onClose={() => setIsAPIModalOpen(false)}
        onSave={handleSaveProvider}
      />
    </div>
  );
};

export default TopBar;
