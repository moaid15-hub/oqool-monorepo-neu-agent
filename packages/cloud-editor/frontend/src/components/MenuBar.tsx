import React, { useState } from 'react';
import { useI18n } from '../hooks/useI18n';

interface MenuItem {
  id: string;
  labelKey: string;
  items: {
    id: string;
    labelKey: string;
    shortcut?: string;
    separator?: boolean;
  }[];
}

interface MenuBarProps {
  onMenuAction?: (action: string) => void;
}

const MenuBar: React.FC<MenuBarProps> = ({ onMenuAction }) => {
  const [activeMenu, setActiveMenu] = useState<string>('');
  const { t, language, setLanguage } = useI18n();

  const menuItems: MenuItem[] = [
    {
      id: 'file',
      labelKey: 'menu.file',
      items: [
        { id: 'new', labelKey: 'menu.file.new', shortcut: 'Ctrl+N' },
        { id: 'open', labelKey: 'menu.file.open', shortcut: 'Ctrl+O' },
        { id: 'openFolder', labelKey: 'menu.file.openFolder', shortcut: 'Ctrl+K Ctrl+O' },
        { id: 'separator1', labelKey: '', separator: true },
        { id: 'save', labelKey: 'menu.file.save', shortcut: 'Ctrl+S' },
        { id: 'saveAs', labelKey: 'menu.file.saveAs', shortcut: 'Ctrl+Shift+S' },
        { id: 'separator2', labelKey: '', separator: true },
        { id: 'close', labelKey: 'menu.file.close', shortcut: 'Ctrl+W' },
        { id: 'exit', labelKey: 'menu.file.exit', shortcut: 'Ctrl+Q' },
      ],
    },
    {
      id: 'edit',
      labelKey: 'menu.edit',
      items: [
        { id: 'undo', labelKey: 'menu.edit.undo', shortcut: 'Ctrl+Z' },
        { id: 'redo', labelKey: 'menu.edit.redo', shortcut: 'Ctrl+Y' },
        { id: 'separator1', labelKey: '', separator: true },
        { id: 'cut', labelKey: 'menu.edit.cut', shortcut: 'Ctrl+X' },
        { id: 'copy', labelKey: 'menu.edit.copy', shortcut: 'Ctrl+C' },
        { id: 'paste', labelKey: 'menu.edit.paste', shortcut: 'Ctrl+V' },
        { id: 'separator2', labelKey: '', separator: true },
        { id: 'find', labelKey: 'menu.edit.find', shortcut: 'Ctrl+F' },
        { id: 'replace', labelKey: 'menu.edit.replace', shortcut: 'Ctrl+H' },
      ],
    },
    {
      id: 'selection',
      labelKey: 'menu.selection',
      items: [
        { id: 'selectAll', labelKey: 'menu.selection.selectAll', shortcut: 'Ctrl+A' },
        {
          id: 'expandSelection',
          labelKey: 'menu.selection.expandSelection',
          shortcut: 'Shift+Alt+→',
        },
        {
          id: 'shrinkSelection',
          labelKey: 'menu.selection.shrinkSelection',
          shortcut: 'Shift+Alt+←',
        },
        { id: 'separator1', labelKey: '', separator: true },
        { id: 'copyLineUp', labelKey: 'menu.selection.copyLineUp', shortcut: 'Shift+Alt+↑' },
        { id: 'copyLineDown', labelKey: 'menu.selection.copyLineDown', shortcut: 'Shift+Alt+↓' },
      ],
    },
    {
      id: 'view',
      labelKey: 'menu.view',
      items: [
        { id: 'commandPalette', labelKey: 'menu.view.commandPalette', shortcut: 'Ctrl+Shift+P' },
        { id: 'openView', labelKey: 'menu.view.openView', shortcut: 'Ctrl+Q' },
        { id: 'separator1', labelKey: '', separator: true },
        { id: 'explorer', labelKey: 'menu.view.explorer', shortcut: 'Ctrl+Shift+E' },
        { id: 'search', labelKey: 'menu.view.search', shortcut: 'Ctrl+Shift+F' },
        { id: 'extensions', labelKey: 'menu.view.extensions', shortcut: 'Ctrl+Shift+X' },
        { id: 'separator2', labelKey: '', separator: true },
        { id: 'terminal', labelKey: 'menu.view.terminal', shortcut: 'Ctrl+`' },
      ],
    },
    {
      id: 'go',
      labelKey: 'menu.go',
      items: [
        { id: 'back', labelKey: 'menu.go.back', shortcut: 'Ctrl+Alt+←' },
        { id: 'forward', labelKey: 'menu.go.forward', shortcut: 'Ctrl+Alt+→' },
        { id: 'separator1', labelKey: '', separator: true },
        { id: 'goToFile', labelKey: 'menu.go.goToFile', shortcut: 'Ctrl+P' },
        { id: 'goToLine', labelKey: 'menu.go.goToLine', shortcut: 'Ctrl+G' },
      ],
    },
  ];

  const handleMenuClick = (menuId: string) => {
    setActiveMenu(activeMenu === menuId ? '' : menuId);
  };

  const handleMenuItemClick = (actionId: string) => {
    if (onMenuAction) {
      onMenuAction(actionId);
    }
    setActiveMenu('');
  };

  const handleClickOutside = () => {
    setActiveMenu('');
  };

  // Close menu when clicking outside
  React.useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="menu-bar">
      <div className="menu-items">
        {menuItems.map((menu) => (
          <div key={menu.id} className="menu-item-container">
            <div
              className={`menu-item ${activeMenu === menu.id ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                handleMenuClick(menu.id);
              }}
            >
              {t(menu.labelKey as any)}
            </div>

            {activeMenu === menu.id && (
              <div className="dropdown-menu" onClick={(e) => e.stopPropagation()}>
                {menu.items.map((item) =>
                  item.separator ? (
                    <div key={item.id} className="dropdown-separator" />
                  ) : (
                    <div
                      key={item.id}
                      className="dropdown-item"
                      onClick={() => handleMenuItemClick(item.id)}
                    >
                      <span>{t(item.labelKey as any)}</span>
                      {item.shortcut && <span className="shortcut-hint">{item.shortcut}</span>}
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="menu-search">
        <input type="text" placeholder={t('search.placeholder')} className="search-input" />
      </div>

      <div className="menu-actions">
        <select
          className="language-selector"
          value={language}
          onChange={(e) => setLanguage(e.target.value as any)}
        >
          <option value="en">English</option>
          <option value="ar">العربية</option>
          <option value="de">Deutsch</option>
        </select>
      </div>
    </div>
  );
};

export default MenuBar;
