// constants/data.ts
import type { Language, Site, Department, DepartmentEmails } from '../types';

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