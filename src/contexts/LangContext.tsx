import { createContext, useContext, useState, type ReactNode } from 'react';

type Lang = 'zh' | 'en';

interface LangContextValue {
  lang: Lang;
  toggleLang: () => void;
  t: (zh: string, en: string) => string;
}

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    return (localStorage.getItem('yijing-lang') as Lang) ?? 'zh';
  });

  const toggleLang = () => {
    setLang(prev => {
      const next = prev === 'zh' ? 'en' : 'zh';
      localStorage.setItem('yijing-lang', next);
      return next;
    });
  };

  const t = (zh: string, en: string) => lang === 'zh' ? zh : en;

  return (
    <LangContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used within LangProvider');
  return ctx;
}
