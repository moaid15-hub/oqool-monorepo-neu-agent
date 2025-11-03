import { useState, useEffect } from 'react';
import { translations, TranslationKeys } from '../i18n/translations';

type Language = 'en' | 'ar' | 'de';

interface UseI18nReturn {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof TranslationKeys) => string;
  dir: 'ltr' | 'rtl';
  isRTL: boolean;
}

export const useI18n = (): UseI18nReturn => {
  const [language, setLanguageState] = useState<Language>(() => {
    // استرجاع اللغة المحفوظة أو استخدام الإنجليزية كافتراضي
    const saved = localStorage.getItem('oqool-language');
    if (saved && (saved === 'en' || saved === 'ar' || saved === 'de')) {
      return saved as Language;
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('oqool-language', lang);

    // تحديث اتجاه النص في HTML
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
  };

  const t = (key: keyof TranslationKeys): string => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  const dir = language === 'ar' ? 'rtl' : 'ltr';
  const isRTL = language === 'ar';

  // تطبيق الاتجاه عند تحميل المكون
  useEffect(() => {
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', language);
  }, [language, dir]);

  return {
    language,
    setLanguage,
    t,
    dir,
    isRTL,
  };
};
