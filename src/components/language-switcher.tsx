'use client';

import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { useState, useEffect } from 'react';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'my', name: 'မြန်မာ', flag: '🇲🇲' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const changeLanguage = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
  };

  return (
    <div className="flex items-center gap-1 bg-card rounded-full p-1 border border-border">
      <Globe className="h-4 w-4 text-foreground ml-2" />
      {languages.map((lang) => (
        <Button
          key={lang.code}
          variant="ghost"
          size="sm"
          onClick={() => changeLanguage(lang.code)}
          className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-all duration-200 btn-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
            mounted && i18n.language === lang.code 
              ? 'bg-foreground text-background shadow-modern' 
              : 'text-foreground hover:text-foreground hover:bg-accent'
          }`}
          aria-label={`Switch to ${lang.name} language`}
        >
          <span>{lang.flag}</span>
          <span className="hidden sm:inline">{lang.name}</span>
        </Button>
      ))}
    </div>
  );
}
