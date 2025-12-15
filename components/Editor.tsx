import React, { useState } from 'react';
import { ResumeData, Section, ExperienceItem, EducationItem, ProjectItem, SkillItem, PersonalInfo, WorkProject } from '../types';
import { IconChevronDown, IconChevronUp, IconTrash, IconPlus, IconMagicWand, IconEye, IconEyeSlash } from './Icons';
import { polishText } from '../services/geminiService';

interface EditorProps {
  data: ResumeData;
  onChange: (newData: ResumeData) => void;
}

// --- Helper Components ---

const Button = ({ onClick, children, variant = 'primary', className = "", disabled=false }: any) => {
  const baseStyle = "px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50",
    secondary: "bg-slate-200 text-slate-700 hover:bg-slate-300 disabled:opacity-50",
    danger: "text-red-600 hover:bg-red-50 disabled:opacity-50",
    ghost: "text-slate-500 hover:text-slate-800 hover:bg-slate-100",
  };
  return (
    <button onClick={onClick} className={`${baseStyle} ${variants[variant as keyof typeof variants]} ${className}`} disabled={disabled}>
      {children}
    </button>
  );
};

const Input = ({ label, value, onChange, placeholder, className = "" }: any) => (
  <div className={`flex flex-col gap-1 ${className}`}>
    <label className="text-xs font-semibold text-slate-500 uppercase">{label}</label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
    />
  </div>
);

const TextAreaAI = ({ label, value, onChange, placeholder, rows = 3 }: any) => {
  const [loading, setLoading] = useState(false);

  const handlePolish = async () => {
    setLoading(true);
    const polished = await polishText(value, label);
    onChange(polished);
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center">
        <label className="text-xs font-semibold text-slate-500 uppercase">{label}</label>
        <button
          onClick={handlePolish}
          disabled={loading || !value}
          className="text-xs flex items-center gap-1 text-purple-600 hover:text-purple-700 font-medium disabled:opacity-50"
          title="使用 AI 润色"
        >
          <IconMagicWand className="w-3 h-3" />
          {loading ? '优化中...' : 'AI 润色'}
        </button>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white resize-y"
      />
    </div>
  );
};

const SectionHeader = ({ title, isOpen, onToggle, isVisible, onToggleVisibility, type }: any) => (
  <div className="flex items-center justify-between p-4 bg-white border-b border-slate-100 hover:bg-slate-50 transition-colors">
    <div className="flex items-center gap-3 flex-1 cursor-pointer" onClick={onToggle}>
      <span className="text-slate-400">
        {isOpen ? <IconChevronUp /> : <IconChevronDown />}
      </span>
      <h3 className="font-semibold text-slate-700">{title}</h3>
    </div>
    <div className="flex items-center gap-2">
       <button 
          onClick={(e) => { e.stopPropagation(); onToggleVisibility(); }}
          className={`p-1.5 rounded hover:bg-slate-200 ${isVisible ? 'text-slate-600' : 'text-slate-400'}`}
          title={isVisible ? "隐藏板块" : "显示板块"}
        >
          {isVisible ? <IconEye /> : <IconEyeSlash />}
       </button>
    </div>
  </div>
);

// --- Main Editor Component ---

export const Editor: React.FC<EditorProps> = ({ data, onChange }) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({ 'personal': true });

  const toggleSection = (id: string) => {
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const updatePersonalInfo = (field: keyof PersonalInfo, value: string) => {
    onChange({
      ...data,
      personalInfo: { ...data.personalInfo, [field]: value }
    });
  };

  const updateSection = (sectionId: string, newContent: any) => {
    const newSections = data.sections.map(s => 
      s.id === sectionId ? { ...s, content: newContent } : s
    );
    onChange({ ...data, sections: newSections });
  };

  const toggleSectionVisibility = (sectionId: string) => {
      const newSections = data.sections.map(s => 
        s.id === sectionId ? { ...s, isVisible: !s.isVisible } : s
      );
      onChange({ ...data, sections: newSections });
  }

  // Generic List Handler helpers
  const addItem = <T extends { id: string }>(sectionId: string, newItem: T) => {
    const section = data.sections.find(s => s.id === sectionId);
    if (!section) return;
    updateSection(sectionId, [...(section.content as T[]), newItem]);
    // Auto open the section if adding item
    if (!openSections[sectionId]) toggleSection(sectionId);
  };

  const removeItem = (sectionId: string, itemId: string) => {
    const section = data.sections.find(s => s.id === sectionId);
    if (!section) return;
    updateSection(sectionId, (section.content as any[]).filter(item => item.id !== itemId));
  };

  const updateItem = (sectionId: string, itemId: string, field: string, value: any) => {
    const section = data.sections.find(s => s.id === sectionId);
    if (!section) return;
    const newContent = (section.content as any[]).map(item => 
      item.id === itemId ? { ...item, [field]: value } : item
    );
    updateSection(sectionId, newContent);
  };

  // Specific helper for nested projects in experience
  const addProject = (sectionId: string, experienceId: string) => {
      const section = data.sections.find(s => s.id === sectionId);
      if (!section) return;
      
      const newProject: WorkProject = {
          id: Date.now().toString(),
          name: '',
          role: '',
          startDate: '',
          endDate: '',
          content: '',
          highlights: ''
      };

      const newContent = (section.content as ExperienceItem[]).map(exp => {
          if (exp.id === experienceId) {
              return { ...exp, projects: [...(exp.projects || []), newProject] };
          }
          return exp;
      });
      updateSection(sectionId, newContent);
  };

  const removeProject = (sectionId: string, experienceId: string, projectId: string) => {
      const section = data.sections.find(s => s.id === sectionId);
      if (!section) return;
      
      const newContent = (section.content as ExperienceItem[]).map(exp => {
          if (exp.id === experienceId) {
              return { ...exp, projects: exp.projects.filter(p => p.id !== projectId) };
          }
          return exp;
      });
      updateSection(sectionId, newContent);
  };

  const updateProject = (sectionId: string, experienceId: string, projectId: string, field: keyof WorkProject, value: string) => {
      const section = data.sections.find(s => s.id === sectionId);
      if (!section) return;
      
      const newContent = (section.content as ExperienceItem[]).map(exp => {
          if (exp.id === experienceId) {
              const newProjects = exp.projects.map(p => 
                  p.id === projectId ? { ...p, [field]: value } : p
              );
              return { ...exp, projects: newProjects };
          }
          return exp;
      });
      updateSection(sectionId, newContent);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 border-r border-slate-200 overflow-y-auto w-full no-scrollbar">
      
      {/* Personal Info */}
      <div className="border-b border-slate-200">
        <SectionHeader 
          title="基本信息" 
          isOpen={openSections['personal']} 
          onToggle={() => toggleSection('personal')}
          isVisible={true}
          onToggleVisibility={()=>{}}
        />
        {openSections['personal'] && (
          <div className="p-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-2 gap-4">
              <Input label="姓名" value={data.personalInfo.fullName} onChange={(v: string) => updatePersonalInfo('fullName', v)} />
              <Input label="求职意向/职位" value={data.personalInfo.title} onChange={(v: string) => updatePersonalInfo('title', v)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="邮箱" value={data.personalInfo.email} onChange={(v: string) => updatePersonalInfo('email', v)} />
              <Input label="电话" value={data.personalInfo.phone} onChange={(v: string) => updatePersonalInfo('phone', v)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="所在城市" value={data.personalInfo.location} onChange={(v: string) => updatePersonalInfo('location', v)} />
              <Input label="博客/GitHub" value={data.personalInfo.website} onChange={(v: string) => updatePersonalInfo('website', v)} />
            </div>
          </div>
        )}
      </div>

      {/* Dynamic Sections */}
      {data.sections.map(section => {
        const isOpen = openSections[section.id];
        
        return (
          <div key={section.id} className="border-b border-slate-200">
            <SectionHeader 
                title={section.title} 
                isOpen={isOpen} 
                onToggle={() => toggleSection(section.id)} 
                isVisible={section.isVisible}
                onToggleVisibility={() => toggleSectionVisibility(section.id)}
            />
            
            {isOpen && (
              <div className="p-4 animate-in slide-in-from-top-2 duration-200">
                {/* SUMMARY */}
                {section.type === 'summary' && (
                  <TextAreaAI 
                    label="个人总结" 
                    value={section.content} 
                    onChange={(v: string) => updateSection(section.id, v)} 
                    placeholder="简要描述你的专业背景和优势..."
                  />
                )}

                {/* EXPERIENCE */}
                {section.type === 'experience' && (
                  <div className="space-y-6">
                    {(section.content as ExperienceItem[]).map((item) => (
                      <div key={item.id} className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm relative group">
                        <button 
                          onClick={() => removeItem(section.id, item.id)}
                          className="absolute top-2 right-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        >
                          <IconTrash className="w-4 h-4" />
                        </button>
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <Input label="公司名称" value={item.company} onChange={(v: string) => updateItem(section.id, item.id, 'company', v)} />
                          <Input label="职位/头衔" value={item.role} onChange={(v: string) => updateItem(section.id, item.id, 'role', v)} />
                        </div>
                        <div className="grid grid-cols-2 gap-3 mb-3">
                            <Input label="开始时间" value={item.startDate} onChange={(v: string) => updateItem(section.id, item.id, 'startDate', v)} placeholder="2022.01" />
                            <div className="flex gap-2 items-end">
                                <Input label="结束时间" value={item.endDate} onChange={(v: string) => updateItem(section.id, item.id, 'endDate', v)} placeholder="至今" className="flex-1" />
                                <div className="mb-2">
                                  <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                                    <input 
                                      type="checkbox" 
                                      checked={item.current} 
                                      onChange={(e) => updateItem(section.id, item.id, 'current', e.target.checked)} 
                                      className="rounded text-blue-600 focus:ring-blue-500"
                                    />
                                    至今
                                  </label>
                                </div>
                            </div>
                        </div>
                        <TextAreaAI 
                          label="公司/工作简介 (可选)" 
                          value={item.description} 
                          onChange={(v: string) => updateItem(section.id, item.id, 'description', v)} 
                          rows={2}
                          placeholder="简要描述公司业务或整体职责..."
                        />

                        {/* Nested Projects Editor */}
                        <div className="mt-4 pl-3 border-l-2 border-slate-100">
                             <div className="text-xs font-bold text-slate-400 uppercase mb-2">项目经历</div>
                             <div className="space-y-4">
                                {(item.projects || []).map(proj => (
                                    <div key={proj.id} className="bg-slate-50 p-3 rounded border border-slate-200 relative">
                                        <button 
                                          onClick={() => removeProject(section.id, item.id, proj.id)}
                                          className="absolute top-2 right-2 text-slate-400 hover:text-red-500"
                                        >
                                          <IconTrash className="w-3 h-3" />
                                        </button>
                                        <div className="grid grid-cols-2 gap-2 mb-2">
                                            <Input label="项目名称" value={proj.name} onChange={(v: string) => updateProject(section.id, item.id, proj.id, 'name', v)} className="bg-white" />
                                            <Input label="担任角色" value={proj.role} onChange={(v: string) => updateProject(section.id, item.id, proj.id, 'role', v)} className="bg-white" />
                                        </div>
                                         <div className="grid grid-cols-2 gap-2 mb-2">
                                            <Input label="开始时间" value={proj.startDate} onChange={(v: string) => updateProject(section.id, item.id, proj.id, 'startDate', v)} className="bg-white" />
                                            <Input label="结束时间" value={proj.endDate} onChange={(v: string) => updateProject(section.id, item.id, proj.id, 'endDate', v)} className="bg-white" />
                                        </div>
                                        <div className="space-y-2">
                                            <TextAreaAI 
                                              label="负责内容" 
                                              value={proj.content} 
                                              onChange={(v: string) => updateProject(section.id, item.id, proj.id, 'content', v)} 
                                              rows={2}
                                              placeholder="主要负责模块、功能..."
                                            />
                                             <TextAreaAI 
                                              label="技术亮点/难点" 
                                              value={proj.highlights} 
                                              onChange={(v: string) => updateProject(section.id, item.id, proj.id, 'highlights', v)} 
                                              rows={2}
                                              placeholder="性能优化、架构设计、疑难攻克..."
                                            />
                                        </div>
                                    </div>
                                ))}
                                <Button onClick={() => addProject(section.id, item.id)} variant="ghost" className="w-full text-xs">
                                  <IconPlus className="w-3 h-3" /> 添加项目
                                </Button>
                             </div>
                        </div>

                      </div>
                    ))}
                    <Button onClick={() => addItem(section.id, {
                      id: Date.now().toString(),
                      company: '', role: '', startDate: '', endDate: '', current: false, description: '', projects: []
                    })} variant="secondary" className="w-full">
                      <IconPlus className="w-4 h-4" /> 添加工作经历
                    </Button>
                  </div>
                )}

                {/* EDUCATION */}
                {section.type === 'education' && (
                  <div className="space-y-6">
                     {(section.content as EducationItem[]).map((item) => (
                      <div key={item.id} className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm relative group">
                        <button 
                          onClick={() => removeItem(section.id, item.id)}
                          className="absolute top-2 right-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <IconTrash className="w-4 h-4" />
                        </button>
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <Input label="学校" value={item.school} onChange={(v: string) => updateItem(section.id, item.id, 'school', v)} />
                          <Input label="学历/专业" value={item.degree} onChange={(v: string) => updateItem(section.id, item.id, 'degree', v)} />
                        </div>
                        <div className="grid grid-cols-2 gap-3 mb-3">
                            <Input label="开始时间" value={item.startDate} onChange={(v: string) => updateItem(section.id, item.id, 'startDate', v)} />
                            <Input label="结束时间" value={item.endDate} onChange={(v: string) => updateItem(section.id, item.id, 'endDate', v)} />
                        </div>
                      </div>
                    ))}
                    <Button onClick={() => addItem(section.id, {
                      id: Date.now().toString(),
                      school: '', degree: '', startDate: '', endDate: '', current: false, description: ''
                    })} variant="secondary" className="w-full">
                      <IconPlus className="w-4 h-4" /> 添加教育经历
                    </Button>
                  </div>
                )}

                 {/* PROJECTS (Standalone/Open Source) */}
                 {section.type === 'projects' && (
                  <div className="space-y-6">
                     {(section.content as ProjectItem[]).map((item) => (
                      <div key={item.id} className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm relative group">
                        <button 
                          onClick={() => removeItem(section.id, item.id)}
                          className="absolute top-2 right-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <IconTrash className="w-4 h-4" />
                        </button>
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <Input label="项目名称" value={item.name} onChange={(v: string) => updateItem(section.id, item.id, 'name', v)} />
                          <Input label="链接 (可选)" value={item.link} onChange={(v: string) => updateItem(section.id, item.id, 'link', v)} />
                        </div>
                        <div className="mb-3">
                             <Input 
                                label="技术栈 (逗号分隔)" 
                                value={item.technologies.join(', ')} 
                                onChange={(v: string) => updateItem(section.id, item.id, 'technologies', v.split(',').map(s => s.trim()))} 
                             />
                        </div>
                        <TextAreaAI 
                          label="项目描述" 
                          value={item.description} 
                          onChange={(v: string) => updateItem(section.id, item.id, 'description', v)} 
                          rows={3}
                        />
                      </div>
                    ))}
                    <Button onClick={() => addItem(section.id, {
                      id: Date.now().toString(),
                      name: '', link: '', description: '', technologies: []
                    })} variant="secondary" className="w-full">
                      <IconPlus className="w-4 h-4" /> 添加个人/开源项目
                    </Button>
                  </div>
                )}

                {/* SKILLS */}
                {section.type === 'skills' && (
                  <div className="space-y-4">
                     {(section.content as SkillItem[]).map((item) => (
                      <div key={item.id} className="p-3 bg-white rounded border border-slate-200 shadow-sm relative group flex flex-col gap-2">
                         <button 
                          onClick={() => removeItem(section.id, item.id)}
                          className="absolute top-2 right-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <IconTrash className="w-4 h-4" />
                        </button>
                        <Input label="技能类别" value={item.category} onChange={(v: string) => updateItem(section.id, item.id, 'category', v)} placeholder="例如: Android, 语言" />
                        <Input 
                            label="具体技能 (逗号分隔)" 
                            value={item.items.join(', ')} 
                            onChange={(v: string) => updateItem(section.id, item.id, 'items', v.split(/[,，、]/).map(s => s.trim()))} 
                            placeholder="例如: Kotlin, Java, Jetpack"
                        />
                      </div>
                     ))}
                     <Button onClick={() => addItem(section.id, {
                      id: Date.now().toString(),
                      category: '', items: []
                    })} variant="secondary" className="w-full">
                      <IconPlus className="w-4 h-4" /> 添加技能组
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
      
      <div className="p-8 text-center text-slate-400 text-sm">
        <p>提示: 点击 <IconMagicWand className="inline w-3 h-3" /> 按钮使用 AI 润色您的简历描述。</p>
      </div>
    </div>
  );
};