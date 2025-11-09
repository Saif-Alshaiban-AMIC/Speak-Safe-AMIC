import React, { useState, useEffect } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Shield, Lock, FileText, MessageSquare, ChevronDown, Menu, X, Globe, Upload, File, XCircle, ZoomIn, Moon, Sun } from 'lucide-react';
import en from './locale/en.json';
import ar from './locale/ar.json';
// Import utility functions
import { stripMetadata, formatFileSize, validateFileSize, validateFileType } from './utils/metadataUtils';
import { fileToBase64 } from './utils/base64';
import './App.css';
import logo from './assets/logo.svg';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Backend API URL - update this with your actual backend endpoint
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost';

type Language = 'en' | 'ar';
type Theme = 'dark' | 'light';

interface Translations {
  nav: {
    home: string;
    form: string;
    faq: string;
  };
  hero: {
    badge: string;
    title1: string;
    title2: string;
    subtitle: string;
    submitBtn: string;
    learnBtn: string;
  };
  features: {
    anonymity: {
      title: string;
      desc: string;
    };
    help: {
      title: string;
      desc: string;
    };
    legal: {
      title: string;
      desc: string;
    };
  };
  form: {
    title: string;
    subtitle: string;
    name: string;
    namePlaceholder: string;
    email: string;
    emailPlaceholder: string;
    message: string;
    messagePlaceholder: string;
    securityNote: string;
    submitBtn: string;
  };
  faq: {
    title: string;
    subtitle: string;
    questions: Array<{ q: string; a: string }>;
    stillQuestions: string;
    supportText: string;
    contactBtn: string;
  };
  footer: string;
}

interface Site {
  id: string;
  name: string;
}

interface Department {
  id: string;
  name: string;
}

interface FormData {
  name: string;
  email: string;
  site: string;
  department: string;
  message: string;
}

interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  file: File;
}

interface DepartmentEmails {
  [key: string]: string;
}

const translations: Record<Language, Translations> = { en, ar };

export const departmentEmails: DepartmentEmails = {
  hr: 'salshaiban@alkhorayef.com',
  finance: 'salshaiban@alkhorayef.com',
  it: 'salshaiban@alkhorayef.com',
  compliance: 'salshaiban@alkhorayef.com',
  other: 'salshaiban@alkhorayef.com',
  project: 'salshaiban@alkhorayef.com'
};

export const sites: Record<Language, Site[]> = {
  en: [
    { id: 'riyadh', name: 'Riyadh HQ' },
    { id: 'jeddah', name: 'Jeddah' },
    { id: 'dammam', name: 'Dammam' },
    { id: 'khasm', name: 'Khasm Alan' },
    { id: 'taif', name: 'Taif' },
    { id: 'qassim', name: 'Qassim' },
    { id: 'hofuf', name: 'Hofuf' },
    { id: 'medina', name: 'Medina' },
  ],
  ar: [
    { id: 'riyadh', name: 'الرياض - المركز الرئيسي' },
    { id: 'jeddah', name: 'جدة' },
    { id: 'dammam', name: 'الدمام' },
    { id: 'khasm', name: 'خشم العان' },
    { id: 'taif', name: 'الطائف' },
    { id: 'qassim', name: 'القصيم' },
    { id: 'hofuf', name: 'الهفوف' },
    { id: 'medina', name: 'المدينة المنورة' },
  ]
};

export const departments: Record<Language, Department[]> = {
  en: [
    { id: 'hr', name: 'Human Resources' },
    { id: 'finance', name: 'Finance' },
    { id: 'it', name: 'Information Technology' },
    { id: 'compliance', name: 'Contracts & Compliance' },
    { id: 'project', name: 'Project Management' },
    { id: 'other', name: 'Other' },
  ],
  ar: [
    { id: 'hr', name: 'الموارد البشرية' },
    { id: 'finance', name: 'المالية' },
    { id: 'it', name: 'تقنية المعلومات' },
    { id: 'compliance', name: 'العقود والامتثال' },
    { id: 'project', name: 'إدارة المشاريع' },
    { id: 'other', name: 'أخرى' },
  ]
};

export default function WhistleblowerLanding(): React.JSX.Element {
  const [language, setLanguage] = useState<Language>('en');
  const [theme, setTheme] = useState<Theme>('dark');
  const [activeSection, setActiveSection] = useState<string>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    site: '',
    department: '',
    message: '',
  });
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const t = translations[language];
  const isRTL = language === 'ar';

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  const toggleLanguage = (): void => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const toggleTheme = (): void => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const scrollToSection = (section: string): void => {
    setActiveSection(section);
    setMobileMenuOpen(false);
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setUploading(true);

    try {
      const validFiles = files.filter(file => {
        if (!validateFileSize(file, 10)) {
          toast.error(
            language === 'en'
              ? `File "${file.name}" exceeds the 10MB limit`
              : `الملف "${file.name}" يتجاوز حد 10 ميجابايت`,
            {
              position: 'top-center',
              autoClose: 4000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              theme: theme === 'dark' ? 'dark' : 'light',
            }
          );
          return false;
        }

        if (!validateFileType(file)) {
          toast.error(
            language === 'en'
              ? `File type not allowed: "${file.name}"`
              : `نوع الملف غير مسموح به: "${file.name}"`,
            {
              position: 'top-center',
              autoClose: 4000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              theme: theme === 'dark' ? 'dark' : 'light',
            }
          );
          return false;
        }

        return true;
      });

      const processedFiles = await Promise.all(
        validFiles.map(async (file): Promise<Attachment> => {
          const strippedFile = await stripMetadata(file);

          return {
            id: Math.random().toString(36).substr(2, 9),
            name: file.name,
            size: file.size,
            type: file.type,
            file: strippedFile
          };
        })
      );

      setAttachments([...attachments, ...processedFiles]);
    } catch (error) {
      console.error('Error processing files:', error);
      toast.error(
        language === 'en'
          ? 'Error processing files. Please try again.'
          : 'خطأ في معالجة الملفات. يرجى المحاولة مرة أخرى.',
        {
          position: 'top-center',
          autoClose: 4000,
          theme: theme === 'dark' ? 'dark' : 'light',
        }
      );
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const removeAttachment = (id: string): void => {
    setAttachments(attachments.filter(att => att.id !== id));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!formData.site) {
      toast.warning(
        language === 'en' ? 'Please select a site' : 'يرجى اختيار موقع',
        {
          position: 'top-center',
          autoClose: 3000,
          theme: theme === 'dark' ? 'dark' : 'light',
        }
      );
      return;
    }

    setSubmitting(true);

    try {
      const emailAttachments = await Promise.all(
        attachments.map(async item => ({
          filename: item.name,
          content: await fileToBase64(item.file),
          contentType: item.type
        }))
      );

      const siteName = sites[language].find(s => s.id === formData.site)?.name || formData.site;
      const deptName = departments[language].find(d => d.id === formData.department)?.name || formData.department;

      const payload = {
        name: formData.name || (language === 'ar' ? 'مجهول' : 'Anonymous'),
        email: formData.email || (language === 'ar' ? 'غير مقدم' : 'Not provided'),
        site: formData.site,
        siteName: siteName,
        department: formData.department,
        departmentName: deptName,
        message: formData.message,
        language: language,
        attachments: emailAttachments,
        recipientEmail: departmentEmails[formData.department] || 'salshaiban@alkhorayef.com'
      };

      const response = await fetch(`${API_URL}:5000/api/sendReport`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.details || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Report sent successfully:', result);

      toast.success(
        language === 'en'
          ? 'Report submitted securely! You will receive a confirmation shortly.'
          : 'تم تقديم البلاغ بأمان! سوف تتلقى تأكيدًا قريبًا.',
        {
          position: 'top-center',
          autoClose: 4000,
          theme: theme === 'dark' ? 'dark' : 'light',
        }
      );

      setFormData({ name: '', email: '', site: '', department: '', message: '' });
      setAttachments([]);

    } catch (error) {
      console.error('Error submitting report:', error);

      toast.error(
        language === 'en'
          ? `Error submitting report: ${error instanceof Error ? error.message : 'Please try again.'}`
          : `خطأ في تقديم البلاغ: ${error instanceof Error ? error.message : 'يرجى المحاولة مرة أخرى.'}`,
        {
          position: 'top-center',
          autoClose: 5000,
          theme: theme === 'dark' ? 'dark' : 'light',
        }
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Theme-specific classes
  const bgGradient = theme === 'dark' 
    ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900'
    : 'bg-gradient-to-br from-blue-50 via-white to-purple-50';
  
  const navBg = theme === 'dark' 
    ? 'bg-slate-900/95 border-blue-500/20'
    : 'bg-white/95 border-blue-200 shadow-sm';
  
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const textSecondary = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
  const textTertiary = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  
  const cardBg = theme === 'dark' 
    ? 'bg-slate-800/50 border-blue-500/20'
    : 'bg-white border-blue-100 shadow-lg';
  
  const inputBg = theme === 'dark'
    ? 'bg-slate-900/50 border-blue-500/30 text-white'
    : 'bg-white border-gray-300 text-gray-900';

  return (
    <div className={`min-h-screen ${bgGradient} ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <ToastContainer position="top-center" theme={theme === 'dark' ? 'dark' : 'light'} />
      
      {/* Navigation */}
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
                className={`${textSecondary} hover:text-blue-500 transition-colors`}
              >
                {t.nav.home}
              </button>
              <button
                onClick={() => scrollToSection('form')}
                className={`${textSecondary} hover:text-blue-500 transition-colors`}
              >
                {t.nav.form}
              </button>
              <button
                onClick={() => scrollToSection('faq')}
                className={`${textSecondary} hover:text-blue-500 transition-colors`}
              >
                {t.nav.faq}
              </button>
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-blue-500/20 hover:bg-blue-500/30' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
              >
                {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-blue-600" />}
              </button>
              <button
                onClick={toggleLanguage}
                className={`flex items-center space-x-2 px-3 py-2 ${theme === 'dark' ? 'bg-blue-500/20 hover:bg-blue-500/30' : 'bg-gray-100 hover:bg-gray-200'} rounded-lg transition-colors`}
              >
                <Globe className={`w-4 h-4 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
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
          <div className={`md:hidden ${theme === 'dark' ? 'bg-slate-800 border-blue-500/20' : 'bg-white border-gray-200'} border-t`}>
            <div className="px-4 py-3 space-y-3">
              <button
                onClick={() => scrollToSection('home')}
                className={`block w-full text-left ${textSecondary} hover:text-blue-500 transition-colors`}
              >
                {t.nav.home}
              </button>
              <button
                onClick={() => scrollToSection('form')}
                className={`block w-full text-left ${textSecondary} hover:text-blue-500 transition-colors`}
              >
                {t.nav.form}
              </button>
              <button
                onClick={() => scrollToSection('faq')}
                className={`block w-full text-left ${textSecondary} hover:text-blue-500 transition-colors`}
              >
                {t.nav.faq}
              </button>
              <button
                onClick={toggleTheme}
                className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''} px-3 py-2 ${theme === 'dark' ? 'bg-blue-500/20 hover:bg-blue-500/30' : 'bg-gray-100 hover:bg-gray-200'} rounded-lg transition-colors w-full`}
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-blue-600" />}
                <span className={textSecondary}>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
              <button
                onClick={toggleLanguage}
                className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''} px-3 py-2 ${theme === 'dark' ? 'bg-blue-500/20 hover:bg-blue-500/30' : 'bg-gray-100 hover:bg-gray-200'} rounded-lg transition-colors w-full`}
              >
                <Globe className={`w-4 h-4 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                <span className={textSecondary}>{language === 'en' ? 'العربية' : 'English'}</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
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

      {/* Form Section */}
      <section id="form" className={`py-20 px-4 sm:px-6 lg:px-8 ${theme === 'dark' ? 'bg-slate-800/30' : 'bg-gray-50/50'}`}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className={`text-4xl font-bold ${textPrimary} mb-4`}>{t.form.title}</h2>
            <p className={textSecondary}>{t.form.subtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className={`${cardBg} backdrop-blur p-8 rounded-xl border`}>
            <div className="mb-6">
              <label className={`block ${textSecondary} mb-2 font-medium`}>{t.form.name}</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder={t.form.namePlaceholder}
                className={`w-full px-4 py-3 ${inputBg} border rounded-lg placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors`}
              />
            </div>

            <div className="mb-6">
              <label className={`block ${textSecondary} mb-2 font-medium`}>{t.form.email}</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder={t.form.emailPlaceholder}
                className={`w-full px-4 py-3 ${inputBg} border rounded-lg placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors`}
              />
            </div>

            <div className="mb-6">
              <label className={`block ${textSecondary} mb-2 font-medium`}>
                {language === 'en' ? 'Department (Optional)' : 'القسم (اختياري)'}
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 ${inputBg} border rounded-lg focus:outline-none focus:border-blue-500 transition-colors`}
              >
                <option value="">
                  {language === 'en' ? '-- Select Department --' : '-- اختر القسم --'}
                </option>
                {departments[language].map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className={`block ${textSecondary} mb-2 font-medium`}>
                {language === 'en' ? 'Location *' : 'الموقع *'}
              </label>
              <select
                required
                name="site"
                value={formData.site}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 ${inputBg} border rounded-lg focus:outline-none focus:border-blue-500 transition-colors`}
              >
                <option value="">
                  {language === 'en' ? '-- Select Location --' : '-- اختر الموقع --'}
                </option>
                {sites[language].map((site) => (
                  <option key={site.id} value={site.id}>
                    {site.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className={`block ${textSecondary} mb-2 font-medium`}>{t.form.message}</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={8}
                placeholder={t.form.messagePlaceholder}
                className={`w-full px-4 py-3 ${inputBg} border rounded-lg placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors resize-none`}
              />
            </div>

            {/* File Upload Section */}
            <div className="mb-6">
              <label className={`block ${textSecondary} mb-2 font-medium`}>
                {language === 'en' ? 'Attachments (Optional)' : 'المرفقات (اختياري)'}
              </label>
              <div className={`border-2 border-dashed ${theme === 'dark' ? 'border-blue-500/30 hover:border-blue-500/50' : 'border-gray-300 hover:border-blue-400'} rounded-lg p-6 text-center transition-colors`}>
                <input
                  type="file"
                  id="file-upload"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  accept="image/*,.pdf,.doc,.docx,.txt"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Upload className={`w-12 h-12 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} mb-3`} />
                  <span className={`${textSecondary} mb-2`}>
                    {language === 'en'
                      ? 'Click to upload or drag and drop'
                      : 'انقر للتحميل أو اسحب وأفلت'}
                  </span>
                  <span className={`text-sm ${textTertiary}`}>
                    {language === 'en'
                      ? 'Images, PDFs, Documents (Max 10MB each)'
                      : 'الصور، ملفات PDF، المستندات (حد أقصى 10 ميجابايت لكل ملف)'}
                  </span>
                </label>
              </div>

              {/* Metadata Stripping Notice */}
              <div className={`mt-3 ${theme === 'dark' ? 'bg-green-500/10 border-green-500/30' : 'bg-green-50 border-green-200'} border rounded-lg p-3`}>
                <div className={`flex items-start space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                  <Shield className={`w-4 h-4 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'} mt-0.5 flex-shrink-0`} />
                  <p className={`text-xs ${textSecondary}`}>
                    {language === 'en'
                      ? 'All metadata (location, device info, etc.) is automatically removed from uploaded files to protect your privacy.'
                      : 'تتم إزالة جميع البيانات الوصفية (الموقع، معلومات الجهاز، إلخ) تلقائيًا من الملفات المحملة لحماية خصوصيتك.'}
                  </p>
                </div>
              </div>

              {/* Uploaded Files List */}
              {attachments.length > 0 && (
                <div className="mt-4 space-y-2">
                  {attachments.map((file) => (
                    <div
                      key={file.id}
                      className={`flex items-center justify-between ${theme === 'dark' ? 'bg-slate-900/50 border-blue-500/30' : 'bg-gray-50 border-gray-300'} border rounded-lg p-3`}
                    >
                      <div className={`flex items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''} flex-1`}>
                        <File className={`w-5 h-5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} flex-shrink-0`} />
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${textPrimary} truncate`}>{file.name}</p>
                          <p className={`text-xs ${textTertiary}`}>{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAttachment(file.id)}
                        className={`text-red-400 hover:text-red-300 transition-colors ${isRTL ? 'mr-2' : 'ml-2'}`}
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {uploading && (
                <div className={`mt-3 text-center ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} text-sm`}>
                  {language === 'en' ? 'Processing files...' : 'معالجة الملفات...'}
                </div>
              )}
            </div>

            <div className={`${theme === 'dark' ? 'bg-blue-500/10 border-blue-500/30' : 'bg-blue-50 border-blue-200'} border rounded-lg p-4 mb-6`}>
              <div className={`flex items-start space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
                <Lock className={`w-5 h-5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} mt-0.5 flex-shrink-0`} />
                <p className={`text-sm ${textSecondary}`}>
                  {t.form.securityNote}
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={uploading || submitting}
              className="w-full px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {submitting
                ? (language === 'en' ? 'Submitting...' : 'جارٍ الإرسال...')
                : t.form.submitBtn
              }
            </button>
          </form>
        </div>
      </section>

      {/* FAQ Section */}
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

      {/* Footer */}
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
    </div>
  );
}