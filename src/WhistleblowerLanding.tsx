// App.tsx
import React, { useState, useEffect } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import en from './locale/en.json';
import ar from './locale/ar.json';
import { Navigation } from './components/Navigation';
import { HeroSection } from './components/HeroSection';
import { ReportForm } from './components/ReportForm';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { stripMetadata, validateFileSize, validateFileType } from './utils/metadataUtils';
import { fileToBase64 } from './utils/base64';
import { departmentEmails, sites, departments } from './constants/data';
import type { Language, Theme, Translations, FormData, Attachment } from './types';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost';
const translations: Record<Language, Translations> = { en, ar };

export default function WhistleblowerLanding(): React.JSX.Element {
  const [language, setLanguage] = useState<Language>('en');
  const [theme, setTheme] = useState<Theme>('dark');
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
    // setActiveSection(section);
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

  const bgGradient = theme === 'dark' 
    ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900'
    : 'bg-gradient-to-br from-blue-50 via-white to-purple-50';

  return (
    <div className={`min-h-screen ${bgGradient} ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <ToastContainer position="top-center" theme={theme === 'dark' ? 'dark' : 'light'} />
      
      <Navigation
        language={language}
        theme={theme}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        scrollToSection={scrollToSection}
        toggleLanguage={toggleLanguage}
        toggleTheme={toggleTheme}
        t={t}
        isRTL={isRTL}
      />

      <HeroSection
        language={language}
        theme={theme}
        scrollToSection={scrollToSection}
        t={t}
      />

      <ReportForm
        language={language}
        theme={theme}
        formData={formData}
        attachments={attachments}
        uploading={uploading}
        submitting={submitting}
        sites={sites[language]}
        departments={departments[language]}
        handleInputChange={handleInputChange}
        handleFileUpload={handleFileUpload}
        removeAttachment={removeAttachment}
        handleSubmit={handleSubmit}
        t={t}
        isRTL={isRTL}
      />

      <FAQSection
        language={language}
        theme={theme}
        openFaq={openFaq}
        setOpenFaq={setOpenFaq}
        t={t}
        isRTL={isRTL}
      />

      <Footer
        language={language}
        theme={theme}
        t={t}
        isRTL={isRTL}
      />
    </div>
  );
}