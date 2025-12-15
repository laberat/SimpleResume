export interface ResumeData {
  personalInfo: PersonalInfo;
  sections: Section[];
  theme: ResumeTheme;
}

export interface ResumeTheme {
  color: string;
  fontScale: 'sm' | 'md' | 'lg';
}

export interface PersonalInfo {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
}

export type SectionType = 'summary' | 'experience' | 'education' | 'skills' | 'projects' | 'custom';

export interface Section {
  id: string;
  type: SectionType;
  title: string;
  isVisible: boolean;
  content: any;
}

export interface WorkProject {
  id: string;
  name: string;
  role: string;
  startDate: string;
  endDate: string;
  content: string; // 负责内容
  highlights: string; // 技术亮点/难点
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string; // Optional company-level description
  projects: WorkProject[]; // Nested projects
}

export interface EducationItem {
  id: string;
  school: string;
  degree: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  link: string;
  description: string;
  technologies: string[];
}

export interface SkillItem {
  id: string;
  category: string;
  items: string[];
}
