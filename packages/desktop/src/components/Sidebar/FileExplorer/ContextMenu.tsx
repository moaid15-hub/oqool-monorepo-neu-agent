import React from 'react';
import { FileNode } from '../../../types';
import './ContextMenu.css';

interface ContextMenuProps {
  node: FileNode;
  x: number;
  y: number;
  onClose: () => void;
  onAction: (action: string, node: FileNode) => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ node, x, y, onClose, onAction }) => {
  const menuItems =
    node.type === 'directory'
      ? [
          { label: 'ملف جديد', action: 'new-file', icon: '📄' },
          { label: 'مجلد جديد', action: 'new-folder', icon: '📁' },
          { label: '---', action: 'separator' },
          { label: 'إعادة تسمية', action: 'rename', icon: '✏️' },
          { label: 'حذف', action: 'delete', icon: '🗑️' },
          { label: '---', action: 'separator' },
          { label: 'نسخ المسار', action: 'copy-path', icon: '📋' },
        ]
      : [
          { label: 'فتح', action: 'open', icon: '📄' },
          { label: 'فتح في جانب', action: 'open-side', icon: '↔️' },
          { label: '---', action: 'separator' },
          { label: 'إعادة تسمية', action: 'rename', icon: '✏️' },
          { label: 'حذف', action: 'delete', icon: '🗑️' },
          { label: '---', action: 'separator' },
          { label: 'نسخ المسار', action: 'copy-path', icon: '📋' },
        ];

  const handleAction = (action: string) => {
    if (action !== 'separator') {
      onAction(action, node);
      onClose();
    }
  };

  return (
    <>
      <div className="context-menu-overlay" onClick={onClose} />
      <div className="context-menu" style={{ left: x, top: y }}>
        {menuItems.map((item, index) =>
          item.action === 'separator' ? (
            <div key={index} className="context-menu-separator" />
          ) : (
            <div
              key={index}
              className="context-menu-item"
              onClick={() => handleAction(item.action)}
            >
              <span className="context-menu-icon">{item.icon}</span>
              <span className="context-menu-label">{item.label}</span>
            </div>
          )
        )}
      </div>
    </>
  );
};
