// types/index.ts
export type Language = 'en' | 'ar';
export type Theme = 'dark' | 'light';

export interface Translations {
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

export interface Site {
  id: string;
  name: string;
}

export interface Department {
  id: string;
  name: string;
}

export interface FormData {
  name: string;
  email: string;
  site: string;
  department: string;
  message: string;
}

export interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  file: File;
}

export interface DepartmentEmails {
  [key: string]: string;
}