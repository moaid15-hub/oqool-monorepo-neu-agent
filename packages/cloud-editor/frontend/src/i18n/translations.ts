// نظام الترجمة متعدد اللغات
export interface TranslationKeys {
  // Menu translations
  'menu.file': string;
  'menu.file.new': string;
  'menu.file.open': string;
  'menu.file.openFolder': string;
  'menu.file.save': string;
  'menu.file.saveAs': string;
  'menu.file.close': string;
  'menu.file.exit': string;
  'menu.edit': string;
  'menu.edit.undo': string;
  'menu.edit.redo': string;
  'menu.edit.cut': string;
  'menu.edit.copy': string;
  'menu.edit.paste': string;
  'menu.edit.find': string;
  'menu.edit.replace': string;
  'menu.selection': string;
  'menu.selection.selectAll': string;
  'menu.selection.expandSelection': string;
  'menu.selection.shrinkSelection': string;
  'menu.selection.copyLineUp': string;
  'menu.selection.copyLineDown': string;
  'menu.view': string;
  'menu.view.commandPalette': string;
  'menu.view.openView': string;
  'menu.view.explorer': string;
  'menu.view.search': string;
  'menu.view.extensions': string;
  'menu.view.terminal': string;
  'menu.go': string;
  'menu.go.back': string;
  'menu.go.forward': string;
  'menu.go.goToFile': string;
  'menu.go.goToLine': string;

  // Search & UI
  'search.placeholder': string;
  'explorer.title': string;

  // Chat translations
  'chat.tab': string;
  'chat.title': string;
  'chat.subtitle': string;
  'chat.link': string;
  'chat.onboard': string;
  'chat.placeholder': string;
  'chat.agent': string;

  // Shortcuts
  'shortcuts.commands': string;
  'shortcuts.file': string;
  'shortcuts.chat': string;

  // Status bar
  'status.branch': string;
  'status.errors': string;
  'status.warnings': string;
  'status.encoding': string;
  'status.lineEnding': string;
  'status.language': string;
  'status.position': string;
}

export const translations: Record<string, TranslationKeys> = {
  en: {
    'menu.file': 'File',
    'menu.file.new': 'New File',
    'menu.file.open': 'Open File...',
    'menu.file.openFolder': 'Open Folder...',
    'menu.file.save': 'Save',
    'menu.file.saveAs': 'Save As...',
    'menu.file.close': 'Close Editor',
    'menu.file.exit': 'Exit',
    'menu.edit': 'Edit',
    'menu.edit.undo': 'Undo',
    'menu.edit.redo': 'Redo',
    'menu.edit.cut': 'Cut',
    'menu.edit.copy': 'Copy',
    'menu.edit.paste': 'Paste',
    'menu.edit.find': 'Find',
    'menu.edit.replace': 'Replace',
    'menu.selection': 'Selection',
    'menu.selection.selectAll': 'Select All',
    'menu.selection.expandSelection': 'Expand Selection',
    'menu.selection.shrinkSelection': 'Shrink Selection',
    'menu.selection.copyLineUp': 'Copy Line Up',
    'menu.selection.copyLineDown': 'Copy Line Down',
    'menu.view': 'View',
    'menu.view.commandPalette': 'Command Palette...',
    'menu.view.openView': 'Open View...',
    'menu.view.explorer': 'Explorer',
    'menu.view.search': 'Search',
    'menu.view.extensions': 'Extensions',
    'menu.view.terminal': 'Terminal',
    'menu.go': 'Go',
    'menu.go.back': 'Back',
    'menu.go.forward': 'Forward',
    'menu.go.goToFile': 'Go to File...',
    'menu.go.goToLine': 'Go to Line...',
    'search.placeholder': 'Search',
    'explorer.title': 'EXPLORER',
    'chat.tab': 'CHAT',
    'chat.title': 'Build with agent mode',
    'chat.subtitle': 'AI responses may be inaccurate.',
    'chat.link': 'Generate Agent Instructions',
    'chat.onboard': 'to onboard AI onto your codebase.',
    'chat.placeholder': 'Add context (#), extensions (@), commands',
    'chat.agent': 'Agent',
    'shortcuts.commands': 'Show All Commands',
    'shortcuts.file': 'Go to File',
    'shortcuts.chat': 'Open Chat',
    'status.branch': 'Branch',
    'status.errors': 'Errors',
    'status.warnings': 'Warnings',
    'status.encoding': 'Encoding',
    'status.lineEnding': 'Line Ending',
    'status.language': 'Language',
    'status.position': 'Position',
  },
  ar: {
    'menu.file': 'ملف',
    'menu.file.new': 'ملف جديد',
    'menu.file.open': 'فتح ملف...',
    'menu.file.openFolder': 'فتح مجلد...',
    'menu.file.save': 'حفظ',
    'menu.file.saveAs': 'حفظ باسم...',
    'menu.file.close': 'إغلاق المحرر',
    'menu.file.exit': 'خروج',
    'menu.edit': 'تحرير',
    'menu.edit.undo': 'تراجع',
    'menu.edit.redo': 'إعادة',
    'menu.edit.cut': 'قص',
    'menu.edit.copy': 'نسخ',
    'menu.edit.paste': 'لصق',
    'menu.edit.find': 'بحث',
    'menu.edit.replace': 'استبدال',
    'menu.selection': 'تحديد',
    'menu.selection.selectAll': 'تحديد الكل',
    'menu.selection.expandSelection': 'توسيع التحديد',
    'menu.selection.shrinkSelection': 'تقليص التحديد',
    'menu.selection.copyLineUp': 'نسخ السطر لأعلى',
    'menu.selection.copyLineDown': 'نسخ السطر لأسفل',
    'menu.view': 'عرض',
    'menu.view.commandPalette': 'لوحة الأوامر...',
    'menu.view.openView': 'فتح عرض...',
    'menu.view.explorer': 'المستكشف',
    'menu.view.search': 'بحث',
    'menu.view.extensions': 'الملحقات',
    'menu.view.terminal': 'الطرفية',
    'menu.go': 'انتقال',
    'menu.go.back': 'رجوع',
    'menu.go.forward': 'تقدم',
    'menu.go.goToFile': 'انتقل إلى الملف...',
    'menu.go.goToLine': 'انتقل إلى السطر...',
    'search.placeholder': 'بحث',
    'explorer.title': 'المستكشف',
    'chat.tab': 'محادثة',
    'chat.title': 'البناء مع وضع الوكيل',
    'chat.subtitle': 'قد تكون استجابات الذكاء الاصطناعي غير دقيقة.',
    'chat.link': 'إنشاء تعليمات الوكيل',
    'chat.onboard': 'لإضافة الذكاء الاصطناعي إلى قاعدة التعليمات البرمجية الخاصة بك.',
    'chat.placeholder': 'أضف سياق (#)، ملحقات (@)، أوامر',
    'chat.agent': 'الوكيل',
    'shortcuts.commands': 'عرض جميع الأوامر',
    'shortcuts.file': 'انتقل إلى الملف',
    'shortcuts.chat': 'فتح المحادثة',
    'status.branch': 'الفرع',
    'status.errors': 'الأخطاء',
    'status.warnings': 'التحذيرات',
    'status.encoding': 'الترميز',
    'status.lineEnding': 'نهاية السطر',
    'status.language': 'اللغة',
    'status.position': 'الموضع',
  },
  de: {
    'menu.file': 'Datei',
    'menu.file.new': 'Neue Datei',
    'menu.file.open': 'Datei öffnen...',
    'menu.file.openFolder': 'Ordner öffnen...',
    'menu.file.save': 'Speichern',
    'menu.file.saveAs': 'Speichern unter...',
    'menu.file.close': 'Editor schließen',
    'menu.file.exit': 'Beenden',
    'menu.edit': 'Bearbeiten',
    'menu.edit.undo': 'Rückgängig',
    'menu.edit.redo': 'Wiederholen',
    'menu.edit.cut': 'Ausschneiden',
    'menu.edit.copy': 'Kopieren',
    'menu.edit.paste': 'Einfügen',
    'menu.edit.find': 'Suchen',
    'menu.edit.replace': 'Ersetzen',
    'menu.selection': 'Auswahl',
    'menu.selection.selectAll': 'Alles auswählen',
    'menu.selection.expandSelection': 'Auswahl erweitern',
    'menu.selection.shrinkSelection': 'Auswahl verkleinern',
    'menu.selection.copyLineUp': 'Zeile nach oben kopieren',
    'menu.selection.copyLineDown': 'Zeile nach unten kopieren',
    'menu.view': 'Ansicht',
    'menu.view.commandPalette': 'Befehlspalette...',
    'menu.view.openView': 'Ansicht öffnen...',
    'menu.view.explorer': 'Explorer',
    'menu.view.search': 'Suchen',
    'menu.view.extensions': 'Erweiterungen',
    'menu.view.terminal': 'Terminal',
    'menu.go': 'Gehe zu',
    'menu.go.back': 'Zurück',
    'menu.go.forward': 'Vorwärts',
    'menu.go.goToFile': 'Gehe zu Datei...',
    'menu.go.goToLine': 'Gehe zu Zeile...',
    'search.placeholder': 'Suchen',
    'explorer.title': 'EXPLORER',
    'chat.tab': 'CHAT',
    'chat.title': 'Mit Agentenmodus erstellen',
    'chat.subtitle': 'KI-Antworten können ungenau sein.',
    'chat.link': 'Agentenanweisungen generieren',
    'chat.onboard': 'um KI in Ihre Codebasis zu integrieren.',
    'chat.placeholder': 'Kontext hinzufügen (#), Erweiterungen (@), Befehle',
    'chat.agent': 'Agent',
    'shortcuts.commands': 'Alle Befehle anzeigen',
    'shortcuts.file': 'Gehe zu Datei',
    'shortcuts.chat': 'Chat öffnen',
    'status.branch': 'Zweig',
    'status.errors': 'Fehler',
    'status.warnings': 'Warnungen',
    'status.encoding': 'Kodierung',
    'status.lineEnding': 'Zeilenende',
    'status.language': 'Sprache',
    'status.position': 'Position',
  },
};
