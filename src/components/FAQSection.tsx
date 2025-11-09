// components/FAQSection.tsx
import React from 'react';
import { ChevronDown, MessageSquare } from 'lucide-react';
import type { Language, Theme, Translations } from '../types';

interface FAQSectionProps {
  language: Language;
  theme: Theme;
  openFaq: number | null;
  setOpenFaq: (index: number | null) => void;
  t: Translations;
  isRTL: boolean;
}

export const FAQSection: React.FC<FAQSectionProps> = ({
  language,
  theme,
  openFaq,
  setOpenFaq,
  t,
  isRTL,
}) => {
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const textSecondary = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
  
  const cardBg = theme === 'dark' 
    ? 'bg-slate-800/50 border-blue-500/20'
    : 'bg-white border-blue-100 shadow-lg';

  return (
    <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className={`text-4xl font-bold ${textPrimary} mb-4`}>{t.faq.title}</h2>
          <p className={textSecondary}>{t.faq.subtitle}</p>
        </div>

        <div className="space-y-4">
          {t.faq.questions.map((faq, index) => (
            <div
              key={index}
              className={`${cardBg} backdrop-blur rounded-xl border overflow-hidden`}
            >
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className={`w-full px-6 py-5 flex items-center justify-between text-left ${theme === 'dark' ? 'hover:bg-slate-800/70' : 'hover:bg-gray-50'} transition-colors`}
              >
                <span className={`text-lg font-semibold ${textPrimary} ${isRTL ? 'pl-4' : 'pr-4'}`}>{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} flex-shrink-0 transition-transform ${openFaq === index ? 'transform rotate-180' : ''}`}
                />
              </button>
              {openFaq === index && (
                <div className="px-6 pb-5">
                  <p className={`${textSecondary} leading-relaxed`}>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className={`mt-12 ${theme === 'dark' ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30' : 'bg-gradient-to-r from-blue-100 to-purple-100 border-blue-200'} rounded-xl p-8 border text-center`}>
          <MessageSquare className={`w-12 h-12 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} mx-auto mb-4`} />
          <h3 className={`text-2xl font-bold ${textPrimary} mb-3`}>{t.faq.stillQuestions}</h3>
          <p className={`${textSecondary} mb-6`}>{t.faq.supportText}</p>
          <button className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-all">
            {t.faq.contactBtn}
          </button>
        </div>
      </div>
    </section>
  );
};