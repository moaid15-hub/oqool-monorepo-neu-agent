import React, { useState } from 'react';

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

interface SidebarSection {
  id: string;
  title: string;
  icon: string;
  badge?: number;
  isActive?: boolean;
  isNew?: boolean;
}

interface SidebarItem {
  id: string;
  label: string;
  icon: string;
  action: () => void;
  badge?: number;
  isNew?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed = false, onToggle }) => {
  const [activeSection, setActiveSection] = useState<string>('explorer');
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const sections: SidebarSection[] = [
    { id: 'explorer', title: 'المستكشف', icon: '📁', isActive: true },
    { id: 'search', title: 'البحث', icon: '🔍' },
    { id: 'git', title: 'Git', icon: '🌿', badge: 3 },
    { id: 'debug', title: 'تصحيح الأخطاء', icon: '🐛' },
    { id: 'extensions', title: 'الإضافات', icon: '🧩', badge: 2 },
    { id: 'ai', title: 'الذكاء الاصطناعي', icon: '🤖', isNew: true },
    { id: 'settings', title: 'الإعدادات', icon: '⚙️' },
  ];

  const explorerItems: SidebarItem[] = [
    { id: 'files', label: 'الملفات', icon: '📄', action: () => console.log('Files') },
    { id: 'folders', label: 'المجلدات', icon: '📁', action: () => console.log('Folders') },
    { id: 'workspace', label: 'مساحة العمل', icon: '🏢', action: () => console.log('Workspace') },
  ];

  const searchItems: SidebarItem[] = [
    { id: 'find', label: 'البحث السريع', icon: '🔎', action: () => console.log('Find') },
    { id: 'replace', label: 'البحث والاستبدال', icon: '🔄', action: () => console.log('Replace') },
    { id: 'regex', label: 'البحث المتقدم', icon: '🧮', action: () => console.log('Regex') },
  ];

  const gitItems: SidebarItem[] = [
    {
      id: 'changes',
      label: 'التغييرات',
      icon: '📝',
      action: () => console.log('Changes'),
      badge: 5,
    },
    { id: 'commits', label: 'الحفظات', icon: '💾', action: () => console.log('Commits') },
    { id: 'branches', label: 'الفروع', icon: '🌳', action: () => console.log('Branches') },
    { id: 'remote', label: 'المستودع البعيد', icon: '☁️', action: () => console.log('Remote') },
  ];

  const aiItems: SidebarItem[] = [
    {
      id: 'assistant',
      label: 'المساعد الذكي',
      icon: '🤖',
      action: () => console.log('AI Assistant'),
    },
    {
      id: 'completion',
      label: 'إكمال الكود',
      icon: '✨',
      action: () => console.log('Code Completion'),
    },
    {
      id: 'explanation',
      label: 'شرح الكود',
      icon: '📖',
      action: () => console.log('Code Explanation'),
    },
    { id: 'review', label: 'مراجعة الكود', icon: '👁️', action: () => console.log('Code Review') },
    {
      id: 'optimization',
      label: 'تحسين الأداء',
      icon: '⚡',
      action: () => console.log('Performance'),
      isNew: true,
    },
  ];

  const getSectionItems = (sectionId: string): SidebarItem[] => {
    switch (sectionId) {
      case 'explorer':
        return explorerItems;
      case 'search':
        return searchItems;
      case 'git':
        return gitItems;
      case 'ai':
        return aiItems;
      default:
        return [];
    }
  };

  const handleSectionClick = (sectionId: string) => {
    setActiveSection(activeSection === sectionId ? '' : sectionId);
  };

  const shouldShowExpanded = !isCollapsed || isHovered;

  return (
    <div
      className={`modern-sidebar ${isCollapsed ? 'collapsed' : 'expanded'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* شريط الأيقونات الجانبي */}
      <div className="sidebar-icons">
        {/* زر التبديل */}
        <button
          className="sidebar-toggle-btn"
          onClick={onToggle}
          title={isCollapsed ? 'توسيع الشريط الجانبي' : 'طي الشريط الجانبي'}
        >
          {isCollapsed ? '▶️' : '◀️'}
        </button>

        {/* أيقونات الأقسام */}
        {sections.map((section) => (
          <div
            key={section.id}
            className={`sidebar-icon ${activeSection === section.id ? 'active' : ''}`}
            onClick={() => handleSectionClick(section.id)}
            title={section.title}
          >
            <span className="icon">{section.icon}</span>
            {section.badge && <span className="badge">{section.badge}</span>}
            {section.isNew && <span className="new-indicator">جديد</span>}
            <div className="icon-label">{section.title}</div>
          </div>
        ))}

        <div className="sidebar-spacer" />

        {/* إعدادات سريعة */}
        <div className="sidebar-quick-settings">
          <button className="quick-setting-btn" title="تبديل السمة">
            🌙
          </button>
          <button className="quick-setting-btn" title="الإعدادات">
            ⚙️
          </button>
          <button className="quick-setting-btn" title="المساعدة">
            ❓
          </button>
        </div>
      </div>

      {/* منطقة المحتوى القابلة للتوسع */}
      {shouldShowExpanded && activeSection && (
        <div className="sidebar-content">
          <div className="sidebar-header">
            <h3 className="section-title">
              <span className="title-icon">
                {sections.find((s) => s.id === activeSection)?.icon}
              </span>
              {sections.find((s) => s.id === activeSection)?.title}
            </h3>

            {activeSection === 'search' && (
              <div className="section-actions">
                <button className="action-btn" title="بحث متقدم">
                  🔧
                </button>
                <button className="action-btn" title="فلاتر">
                  🎛️
                </button>
              </div>
            )}

            {activeSection === 'git' && (
              <div className="section-actions">
                <button className="action-btn" title="تحديث">
                  🔄
                </button>
                <button className="action-btn" title="سحب التغييرات">
                  ⬇️
                </button>
                <button className="action-btn" title="دفع التغييرات">
                  ⬆️
                </button>
              </div>
            )}

            {activeSection === 'ai' && (
              <div className="section-actions">
                <button className="action-btn" title="إعدادات AI">
                  🤖
                </button>
                <button className="action-btn" title="تاريخ AI">
                  📜
                </button>
              </div>
            )}
          </div>

          {/* شريط بحث للقسم */}
          {(activeSection === 'explorer' || activeSection === 'search') && (
            <div className="section-search">
              <div className="search-input-container">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder={`بحث في ${sections.find((s) => s.id === activeSection)?.title}...`}
                  className="section-search-input"
                />
                <button className="clear-search-btn" title="مسح البحث">
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* محتوى القسم */}
          <div className="sidebar-section-content">
            {/* معلومات خاصة بكل قسم */}
            {activeSection === 'explorer' && (
              <div className="explorer-info">
                <div className="workspace-info">
                  <span className="workspace-icon">🏢</span>
                  <span className="workspace-name">OqoolAI Cloud IDE</span>
                  <button className="workspace-settings" title="إعدادات مساحة العمل">
                    ⚙️
                  </button>
                </div>
              </div>
            )}

            {activeSection === 'git' && (
              <div className="git-status">
                <div className="git-branch">
                  <span className="branch-icon">🌿</span>
                  <span className="branch-name">main</span>
                  <span className="branch-status">✅ محدث</span>
                </div>
                <div className="git-stats">
                  <span className="stat">📝 5 تغييرات</span>
                  <span className="stat">➕ 3 إضافات</span>
                  <span className="stat">➖ 1 حذف</span>
                </div>
              </div>
            )}

            {activeSection === 'ai' && (
              <div className="ai-status">
                <div className="ai-connection">
                  <span className="connection-indicator online">●</span>
                  <span className="connection-text">متصل بـ DeepSeek AI</span>
                </div>
                <div className="ai-stats">
                  <div className="stat-item">
                    <span className="stat-label">طلبات اليوم</span>
                    <span className="stat-value">47</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">نسبة النجاح</span>
                    <span className="stat-value">98%</span>
                  </div>
                </div>
              </div>
            )}

            {/* قائمة العناصر */}
            <div className="section-items">
              {getSectionItems(activeSection).map((item) => (
                <div key={item.id} className="sidebar-item" onClick={item.action}>
                  <div className="item-content">
                    <span className="item-icon">{item.icon}</span>
                    <span className="item-label">{item.label}</span>
                    {item.badge && <span className="item-badge">{item.badge}</span>}
                    {item.isNew && <span className="item-new">جديد</span>}
                  </div>
                  <span className="item-arrow">›</span>
                </div>
              ))}
            </div>

            {/* معلومات إضافية للقسم النشط */}
            {activeSection === 'ai' && (
              <div className="ai-features">
                <div className="feature-card">
                  <div className="feature-icon">🚀</div>
                  <div className="feature-content">
                    <h4>ميزات جديدة</h4>
                    <p>إكمال تلقائي محسن وشرح الكود المتقدم</p>
                  </div>
                </div>

                <div className="feature-card">
                  <div className="feature-icon">⚡</div>
                  <div className="feature-content">
                    <h4>أداء فائق</h4>
                    <p>استجابة سريعة وذكاء متطور</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* تذييل القسم */}
          <div className="sidebar-footer">
            {activeSection === 'git' && (
              <div className="git-actions">
                <button className="footer-btn primary">💾 حفظ التغييرات</button>
                <button className="footer-btn secondary">🔄 تحديث</button>
              </div>
            )}

            {activeSection === 'ai' && (
              <div className="ai-actions">
                <button className="footer-btn primary">🤖 فتح المساعد</button>
              </div>
            )}

            {activeSection !== 'git' && activeSection !== 'ai' && (
              <div className="general-actions">
                <button className="footer-btn secondary">⚙️ إعدادات القسم</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
