import React from 'react';
import './MenuBar.css';

export const MenuBar: React.FC = () => {
  const menus = [
    {
      label: 'ملف',
      items: ['ملف جديد', 'فتح ملف', 'فتح مجلد', '---', 'حفظ', 'حفظ الكل', '---', 'إغلاق', 'خروج'],
    },
    {
      label: 'تحرير',
      items: ['تراجع', 'إعادة', '---', 'قص', 'نسخ', 'لصق', '---', 'بحث', 'استبدال'],
    },
    {
      label: 'عرض',
      items: ['لوحة الأوامر', '---', 'المستكشف', 'البحث', 'Git', 'Terminal', '---', 'ملء الشاشة'],
    },
    {
      label: 'Terminal',
      items: ['Terminal جديد', 'تقسيم Terminal', '---', 'مسح'],
    },
    {
      label: 'مساعدة',
      items: ['الوثائق', 'الاختصارات', '---', 'الإبلاغ عن مشكلة', '---', 'حول'],
    },
  ];

  return (
    <div className="menu-bar">
      {menus.map((menu, index) => (
        <div key={index} className="menu-item">
          <button className="menu-button">{menu.label}</button>
        </div>
      ))}
    </div>
  );
};
