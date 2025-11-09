// components/HeroSection.tsx
import React from 'react';
import { Shield, FileText, ZoomIn } from 'lucide-react';
import type { Language, Theme, Translations } from '../types';

interface HeroSectionProps {
  language: Language;
  theme: Theme;
  scrollToSection: (section: string) => void;
  t: Translations;
}

export const HeroSection: React.FC<HeroSectionProps> = ({

  theme,
  scrollToSection,
  t,
}) => {
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const textSecondary = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
  const textTertiary = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  
  const cardBg = theme === 'dark' 
    ? 'bg-slate-800/50 border-blue-500/20'
    : 'bg-white border-blue-100 shadow-lg';

  return (
    <section id="home" className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <div className={`inline-block mb-6 px-4 py-2 ${theme === 'dark' ? 'bg-blue-500/20 border-blue-400/30' : 'bg-blue-100 border-blue-300'} rounded-full border`}>
          <span className={`${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'} text-sm font-medium`}>{t.hero.badge}</span>
        </div>
        <h1 className={`text-5xl md:text-7xl font-bold ${textPrimary} mb-6 leading-tight`}>
          {t.hero.title1}<br />{t.hero.title2}
        </h1>
        <p className={`text-xl ${textSecondary} mb-12 max-w-3xl mx-auto`}>
          {t.hero.subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => scrollToSection('form')}
            className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg shadow-blue-500/50"
          >
            {t.hero.submitBtn}
          </button>
          <button
            onClick={() => scrollToSection('faq')}
            className={`px-8 py-4 ${theme === 'dark' ? 'bg-slate-800 hover:bg-slate-700 border-blue-500/30' : 'bg-white hover:bg-gray-50 border-gray-300'} ${textPrimary} rounded-lg font-semibold transition-all border`}
          >
            {t.hero.learnBtn}
          </button>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className={`${cardBg} backdrop-blur p-8 rounded-xl border hover:border-blue-500/40 transition-all`}>
            <ZoomIn className={`w-12 h-12 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} mx-auto mb-4`} />
            <h3 className={`text-xl font-bold ${textPrimary} mb-3`}>{t.features.help.title}</h3>
            <p className={textTertiary}>{t.features.help.desc}</p>
          </div>
          <div className={`${cardBg} backdrop-blur p-8 rounded-xl border hover:border-blue-500/40 transition-all`}>
            <Shield className={`w-12 h-12 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} mx-auto mb-4`} />
            <h3 className={`text-xl font-bold ${textPrimary} mb-3`}>{t.features.anonymity.title}</h3>
            <p className={textTertiary}>{t.features.anonymity.desc}</p>
          </div>
          <div className={`${cardBg} backdrop-blur p-8 rounded-xl border hover:border-blue-500/40 transition-all`}>
            <FileText className={`w-12 h-12 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} mx-auto mb-4`} />
            <h3 className={`text-xl font-bold ${textPrimary} mb-3`}>{t.features.legal.title}</h3>
            <p className={textTertiary}>{t.features.legal.desc}</p>
          </div>
        </div>
      </div>
    </section>
  );
};