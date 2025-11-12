// components/Navigation.tsx
import React from 'react';
import { Menu, X, Globe, Moon, Sun } from 'lucide-react';
import logo from '../assets/logo-bg.png';
import type { Language, Theme, Translations } from '../types';

interface NavigationProps {
  language: Language;
  theme: Theme;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  scrollToSection: (section: string) => void;
  toggleLanguage: () => void;
  toggleTheme: () => void;
  t: Translations;
  isRTL: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  language,
  theme,
  mobileMenuOpen,
  setMobileMenuOpen,
  scrollToSection,
  toggleLanguage,
  toggleTheme,
  t,
  isRTL,
}) => {
  const navBg = theme === 'dark' 
    ? 'bg-slate-900/95 border-brand-500/20'
    : 'bg-white/95 border-brand-200 shadow-sm';
  
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const textSecondary = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';

  return (
    <nav className={`fixed top-0 w-full ${navBg} backdrop-blur-sm border-b z-50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className={`flex items-center justify-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
            <img src={logo} alt="Speak Safe Logo" className="logo h-8 w-auto" />
            <span className={`text-xl font-bold ${textPrimary}`}>Speak Safe AMIC</span>
          </div>

          {/* Desktop Navigation */}
          <div className={`hidden md:flex items-center space-x-8 ${isRTL ? 'space-x-reverse' : ''}`}>
            <button
              onClick={() => scrollToSection('home')}
              className={`${textSecondary} hover:text-brand-500 transition-colors`}
            >
              {t.nav.home}
            </button>
            <button
              onClick={() => scrollToSection('form')}
              className={`${textSecondary} hover:text-brand-500 transition-colors`}
            >
              {t.nav.form}
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className={`${textSecondary} hover:text-brand-500 transition-colors`}
            >
              {t.nav.faq}
            </button>
           
            <button
              onClick={toggleLanguage}
              className={`flex items-center space-x-2 px-3 py-2 ${theme === 'dark' ? 'bg-brand-500/20 hover:bg-brand-500/30' : 'bg-gray-100 hover:bg-gray-200'} rounded-lg transition-colors`}
            >
              <Globe className={`w-4 h-4 ${theme === 'dark' ? 'text-brand-400' : 'text-brand-600'}`} />
              <span className={textSecondary}>{language === 'en' ? 'العربية' : 'English'}</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden ${textPrimary}`}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className={`md:hidden ${theme === 'dark' ? 'bg-slate-800 border-brand-500/20' : 'bg-white border-gray-200'} border-t`}>
          <div className="px-4 py-3 space-y-3">
            <button
              onClick={() => scrollToSection('home')}
              className={`block w-full text-left ${textSecondary} hover:text-brand-500 transition-colors`}
            >
              {t.nav.home}
            </button>
            <button
              onClick={() => scrollToSection('form')}
              className={`block w-full text-left ${textSecondary} hover:text-brand-500 transition-colors`}
            >
              {t.nav.form}
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className={`block w-full text-left ${textSecondary} hover:text-brand-500 transition-colors`}
            >
              {t.nav.faq}
            </button>
            <button
              onClick={toggleTheme}
              className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''} px-3 py-2 ${theme === 'dark' ? 'bg-brand-500/20 hover:bg-brand-500/30' : 'bg-gray-100 hover:bg-gray-200'} rounded-lg transition-colors w-full`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-brand-600" />}
              <span className={textSecondary}>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
            <button
              onClick={toggleLanguage}
              className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''} px-3 py-2 ${theme === 'dark' ? 'bg-brand-500/20 hover:bg-brand-500/30' : 'bg-gray-100 hover:bg-gray-200'} rounded-lg transition-colors w-full`}
            >
              <Globe className={`w-4 h-4 ${theme === 'dark' ? 'text-brand-400' : 'text-brand-600'}`} />
              <span className={textSecondary}>{language === 'en' ? 'العربية' : 'English'}</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};