import React from 'react';
import { ResumeData, Section, ExperienceItem, EducationItem, ProjectItem, SkillItem, WorkProject } from '../types';
import { IconPhone, IconMail, IconMapPin, IconLink } from './Icons';

interface PreviewProps {
  data: ResumeData;
  scale?: number;
}

const SectionTitle = ({ children }: { children?: React.ReactNode }) => (
  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 border-b border-slate-300 pb-1 mb-3 mt-6">
    {children}
  </h3>
);

const DateDisplay = ({ start, end, current }: { start: string; end: string; current: boolean }) => (
  <span className="text-xs text-slate-500 font-medium">
    {start} — {current ? '至今' : end}
  </span>
);

export const Preview: React.FC<PreviewProps> = ({ data }) => {
  const { personalInfo, sections } = data;

  const renderSection = (section: Section) => {
    if (!section.isVisible) return null;

    switch (section.type) {
      case 'summary':
        return (
          <div key={section.id} className="mb-4">
            <SectionTitle>{section.title}</SectionTitle>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{section.content}</p>
          </div>
        );

      case 'experience':
        return (
          <div key={section.id} className="mb-4">
            <SectionTitle>{section.title}</SectionTitle>
            <div className="space-y-6">
              {(section.content as ExperienceItem[]).map((exp) => (
                <div key={exp.id} className="relative">
                  {/* Company Header */}
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-bold text-slate-900 text-base">{exp.company}</h4>
                    <DateDisplay start={exp.startDate} end={exp.endDate} current={exp.current} />
                  </div>
                  <div className="text-sm font-semibold text-slate-600 mb-2">{exp.role}</div>
                  
                  {exp.description && (
                     <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap mb-3">{exp.description}</p>
                  )}

                  {/* Nested Projects */}
                  {exp.projects && exp.projects.length > 0 && (
                    <div className="ml-0 space-y-3 mt-2">
                        {exp.projects.map((proj: WorkProject) => (
                          <div key={proj.id} className="pl-4 border-l-2 border-slate-200">
                             <div className="flex justify-between items-baseline mb-1">
                                <span className="font-bold text-sm text-slate-800">{proj.name}</span>
                                <span className="text-xs text-slate-500">{proj.startDate} - {proj.endDate}</span>
                             </div>
                             {proj.role && <div className="text-xs text-slate-600 font-medium mb-1">担任角色: {proj.role}</div>}
                             
                             {proj.content && (
                               <div className="mb-1">
                                 <span className="text-xs font-bold text-slate-700">负责内容: </span>
                                 <span className="text-sm text-slate-700">{proj.content}</span>
                               </div>
                             )}
                             
                             {proj.highlights && (
                               <div>
                                 <span className="text-xs font-bold text-slate-700">技术亮点: </span>
                                 <span className="text-sm text-slate-700">{proj.highlights}</span>
                               </div>
                             )}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'education':
        return (
          <div key={section.id} className="mb-4">
            <SectionTitle>{section.title}</SectionTitle>
            <div className="space-y-4">
              {(section.content as EducationItem[]).map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-bold text-slate-800">{edu.school}</h4>
                    <DateDisplay start={edu.startDate} end={edu.endDate} current={edu.current} />
                  </div>
                  <div className="text-sm text-slate-600 mb-1">{edu.degree}</div>
                  {edu.description && <p className="text-sm text-slate-700 leading-relaxed">{edu.description}</p>}
                </div>
              ))}
            </div>
          </div>
        );

      case 'projects': // Independent projects (Open Source etc)
        return (
            <div key={section.id} className="mb-4">
                <SectionTitle>{section.title}</SectionTitle>
                <div className="space-y-4">
                    {(section.content as ProjectItem[]).map(proj => (
                        <div key={proj.id}>
                            <div className="flex justify-between items-center mb-1">
                                <h4 className="font-bold text-slate-800">{proj.name}</h4>
                                {proj.link && (
                                    <a href={proj.link} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                                       <IconLink className="w-3 h-3"/> 链接
                                    </a>
                                )}
                            </div>
                            <p className="text-sm text-slate-700 leading-relaxed mb-2">{proj.description}</p>
                            {proj.technologies && proj.technologies.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                    {proj.technologies.map((tech, i) => (
                                        <span key={i} className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-600 border border-slate-200">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );

      case 'skills':
        return (
          <div key={section.id} className="mb-4">
            <SectionTitle>{section.title}</SectionTitle>
            <div className="space-y-2">
              {(section.content as SkillItem[]).map((group) => (
                <div key={group.id} className="flex flex-col sm:flex-row sm:items-baseline">
                  <span className="font-bold text-sm text-slate-800 w-32 shrink-0">{group.category}</span>
                  <span className="text-sm text-slate-700 flex-1">{group.items.join('、')}</span>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div id="resume-preview" className="bg-white w-[210mm] min-h-[297mm] shadow-2xl mx-auto p-[15mm] print-container relative print:shadow-none">
      
      {/* Header */}
      <header className="border-b-2 border-slate-800 pb-6 mb-6">
        <h1 className="text-4xl font-serif font-bold text-slate-900 mb-2">{personalInfo.fullName}</h1>
        <p className="text-lg text-slate-600 font-medium mb-4">{personalInfo.title}</p>
        
        <div className="flex flex-wrap gap-4 text-sm text-slate-600">
          {personalInfo.email && (
            <div className="flex items-center gap-1.5">
              <IconMail />
              <span>{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-1.5">
              <IconPhone />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.location && (
            <div className="flex items-center gap-1.5">
              <IconMapPin />
              <span>{personalInfo.location}</span>
            </div>
          )}
          {personalInfo.website && (
            <div className="flex items-center gap-1.5">
              <IconLink />
              <span>{personalInfo.website}</span>
            </div>
          )}
        </div>
      </header>

      {/* Sections */}
      <div className="space-y-2">
        {sections.map(renderSection)}
      </div>

    </div>
  );
};