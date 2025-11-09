// components/Footer.tsx
import React from 'react';
import logo from '../assets/logo.svg';
import type { Language, Theme, Translations } from '../types';

interface FooterProps {
  language: Language;
  theme: Theme;
  t: Translations;
  isRTL: boolean;
}

export const Footer: React.FC<FooterProps> = ({
 
  theme,
  t,
  isRTL,
}) => {
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const textTertiary = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';

  return (
    <footer className={`${theme === 'dark' ? 'bg-slate-900/50 border-blue-500/20' : 'bg-gray-50 border-gray-200'} border-t py-8 px-4`}>
      <div className="max-w-7xl mx-auto text-center">
        <div className={`flex items-center justify-center space-x-2 ${isRTL ? 'space-x-reverse' : ''} mb-4`}>
          <img src={logo} alt="Speak Safe Logo" className="logo h-8 w-auto" />
          <span className={`text-lg font-bold ${textPrimary}`}>Speak Safe AMIC</span>
        </div>
        <p className={`${textTertiary} text-sm`}>
          {t.footer}
        </p>
      </div>
    </footer>
  );
};