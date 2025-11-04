import React, { useState, useRef, useEffect } from 'react';
import { notificationManager } from '../hooks/useNotifications';

interface HeaderProps {
  onKeyManagerOpen?: () => void;
  onSettingsOpen?: () => void;
  onThemeToggle?: () => void;
}

interface DropdownItem {
  label: string;
  icon: string;
  action: () => void;
  separator?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onKeyManagerOpen, onSettingsOpen, onThemeToggle }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // إغلاق القوائم عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menuItems: DropdownItem[] = [
    {
      label: 'مشروع جديد',
      icon: '📁',
      action: () => {
        notificationManager.info('تم إنشاء مشروع جديد', { title: 'المشاريع' });
        setIsMenuOpen(false);
      },
    },
    {
      label: 'فتح مشروع',
      icon: '📂',
      action: () => {
        notificationManager.success('تم فتح المشروع بنجاح', { title: 'المشاريع' });
        setIsMenuOpen(false);
      },
    },
    {
      label: 'حفظ الكل',
      icon: '💾',
      action: () => {
        notificationManager.success('تم حفظ جميع الملفات', { title: 'حفظ الملفات' });
        setIsMenuOpen(false);
      },
      separator: true,
    },
    {
      label: 'استيراد',
      icon: '📥',
      action: () => {
        notificationManager.info('جاري استيراد الملفات...', { title: 'الاستيراد', duration: 3000 });
        setIsMenuOpen(false);
      },
    },
    {
      label: 'تصدير',
      icon: '📤',
      action: () => {
        notificationManager.success('تم تصدير المشروع بنجاح', {
          title: 'التصدير',
          action: {
            label: 'تحميل',
            onClick: () => console.log('تحميل الملف'),
          },
        });
        setIsMenuOpen(false);
      },
    },
  ];

  const userMenuItems: DropdownItem[] = [
    {
      label: 'الملف الشخصي',
      icon: '👤',
      action: () => {
        notificationManager.info('عرض الملف الشخصي', { title: 'المستخدم' });
        setIsUserMenuOpen(false);
      },
    },
    {
      label: 'مفاتيح API',
      icon: '🔑',
      action: () => {
        onKeyManagerOpen?.();
        notificationManager.info('فتح مدير مفاتيح API', { title: 'الأمان' });
        setIsUserMenuOpen(false);
      },
    },
    {
      label: 'الإعدادات',
      icon: '⚙️',
      action: () => {
        onSettingsOpen?.();
        notificationManager.info('فتح الإعدادات', { title: 'النظام' });
        setIsUserMenuOpen(false);
      },
      separator: true,
    },
    { label: 'المساعدة', icon: '❓', action: () => console.log('المساعدة') },
    { label: 'عن التطبيق', icon: 'ℹ️', action: () => console.log('عن التطبيق') },
  ];

  return (
    <>
      <header className="modern-header">
        {/* القسم الأيسر - الشعار والتنقل */}
        <div className="header-left">
          <div className="logo-section">
            <div className="logo-icon">
              <span className="logo-gradient">🚀</span>
            </div>
            <div className="logo-text">
              <h1 className="brand-name">OqoolAI</h1>
              <span className="brand-subtitle">Cloud Editor Pro</span>
            </div>
          </div>

          <nav className="main-nav">
            <div className="nav-dropdown" ref={menuRef}>
              <button className="nav-button" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                <span>📁</span>
                ملف
                <span className={`dropdown-arrow ${isMenuOpen ? 'open' : ''}`}>▼</span>
              </button>

              {isMenuOpen && (
                <div className="dropdown-menu animate-fade-in">
                  {menuItems.map((item, index) => (
                    <React.Fragment key={index}>
                      {item.separator && <div className="dropdown-separator" />}
                      <button
                        className="dropdown-item"
                        onClick={() => {
                          item.action();
                          setIsMenuOpen(false);
                        }}
                      >
                        <span className="item-icon">{item.icon}</span>
                        <span className="item-label">{item.label}</span>
                        <span className="item-shortcut">Ctrl+N</span>
                      </button>
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>

            <button className="nav-button">
              <span>✏️</span>
              تحرير
            </button>

            <button className="nav-button">
              <span>👁️</span>
              عرض
            </button>

            <button className="nav-button">
              <span>🔧</span>
              أدوات
            </button>
          </nav>
        </div>

        {/* القسم الأوسط - شريط البحث */}
        <div className="header-center">
          <div className="search-container">
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="بحث في الملفات والمجلدات..."
                className="search-input"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                    notificationManager.info(`جاري البحث عن: "${e.currentTarget.value}"`, {
                      title: 'البحث',
                      duration: 2000,
                    });
                  }
                }}
              />
              <kbd className="search-shortcut">Ctrl+P</kbd>
            </div>
          </div>
        </div>

        {/* القسم الأيمن - الأدوات والمستخدم */}
        <div className="header-right">
          <div className="header-actions">
            {/* أزرار الإجراءات السريعة */}
            <button className="action-btn" title="تبديل السمة">
              <span onClick={onThemeToggle}>🌙</span>
            </button>

            <button className="action-btn" title="الإشعارات">
              <span>🔔</span>
              <span className="notification-badge">3</span>
            </button>

            <button className="action-btn" title="Git">
              <span>🌿</span>
            </button>

            <div className="sync-status">
              <span className="sync-icon rotating">⚡</span>
              <span className="sync-text">متزامن</span>
            </div>

            {/* قائمة المستخدم */}
            <div className="user-menu" ref={userMenuRef}>
              <button className="user-avatar" onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=OqoolAI"
                  alt="User Avatar"
                  className="avatar-img"
                />
                <span className="user-name">مطور</span>
                <span className={`dropdown-arrow ${isUserMenuOpen ? 'open' : ''}`}>▼</span>
              </button>

              {isUserMenuOpen && (
                <div className="dropdown-menu user-dropdown animate-fade-in">
                  <div className="user-info">
                    <div className="user-details">
                      <strong>مطور OqoolAI</strong>
                      <small>developer@oqoolai.com</small>
                    </div>
                  </div>
                  <div className="dropdown-separator" />
                  {userMenuItems.map((item, index) => (
                    <React.Fragment key={index}>
                      {item.separator && <div className="dropdown-separator" />}
                      <button
                        className="dropdown-item"
                        onClick={() => {
                          item.action();
                          setIsUserMenuOpen(false);
                        }}
                      >
                        <span className="item-icon">{item.icon}</span>
                        <span className="item-label">{item.label}</span>
                      </button>
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* معلومات الحالة */}
          <div className="status-info">
            <span className="version-badge">v2.1.0</span>
          </div>
        </div>
      </header>

      {/* شريط الأدوات الثانوي */}
      <div className="secondary-toolbar">
        <div className="breadcrumb">
          <span className="breadcrumb-item">
            <span>🏠</span>
            الرئيسية
          </span>
          <span className="breadcrumb-separator">›</span>
          <span className="breadcrumb-item">
            <span>📁</span>
            المشاريع
          </span>
          <span className="breadcrumb-separator">›</span>
          <span className="breadcrumb-item active">
            <span>⚛️</span>
            React App
          </span>
        </div>

        <div className="toolbar-actions">
          <button className="toolbar-btn">
            <span>▶️</span>
            تشغيل
          </button>
          <button className="toolbar-btn">
            <span>🔨</span>
            بناء
          </button>
          <button className="toolbar-btn">
            <span>🧪</span>
            اختبار
          </button>
          <div className="toolbar-separator" />
          <button className="toolbar-btn">
            <span>📊</span>
            تحليل
          </button>
        </div>
      </div>
    </>
  );
};

export default Header;
