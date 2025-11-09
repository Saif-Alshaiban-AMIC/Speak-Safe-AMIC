// components/ReportForm.tsx
import React from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Lock, Upload, File, XCircle, Shield } from 'lucide-react';
import type { Language, Theme, Translations, FormData, Attachment, Site, Department } from '../types';
import { formatFileSize } from '../utils/metadataUtils';

interface ReportFormProps {
  language: Language;
  theme: Theme;
  formData: FormData;
  attachments: Attachment[];
  uploading: boolean;
  submitting: boolean;
  sites: Site[];
  departments: Department[];
  handleInputChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleFileUpload: (e: ChangeEvent<HTMLInputElement>) => Promise<void>;
  removeAttachment: (id: string) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  t: Translations;
  isRTL: boolean;
}

export const ReportForm: React.FC<ReportFormProps> = ({
  language,
  theme,
  formData,
  attachments,
  uploading,
  submitting,
  sites,
  departments,
  handleInputChange,
  handleFileUpload,
  removeAttachment,
  handleSubmit,
  t,
  isRTL,
}) => {
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
              {departments.map((dept) => (
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
              {sites.map((site) => (
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
  );
};