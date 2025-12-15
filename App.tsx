import React, { useState } from 'react';
import { Editor } from './components/Editor';
import { Preview } from './components/Preview';
import { ResumeData, Section } from './types';
import { IconDownload } from './components/Icons';

// Initial Data for Chinese Android Developer
const INITIAL_DATA: ResumeData = {
  theme: { color: '#2563eb', fontScale: 'md' },
  personalInfo: {
    fullName: '李明',
    title: '资深 Android 开发工程师',
    email: 'liming.dev@example.com',
    phone: '138-0000-8888',
    location: '北京市海淀区',
    website: 'github.com/limingdev',
    linkedin: ''
  },
  sections: [
    {
      id: 'summary',
      type: 'summary',
      title: '个人总结',
      isVisible: true,
      content: '拥有6年 Android 客户端开发经验，精通 Kotlin/Java 和 Jetpack 组件库。具有丰富的大型 App 架构重构经验，擅长性能优化（启动速度、内存优化）。对 Flutter 跨平台开发有实战经验。具备良好的技术领导力，曾带领 5 人团队完成核心业务迭代。'
    },
    {
      id: 'experience',
      type: 'experience',
      title: '工作经历',
      isVisible: true,
      content: [
        {
          id: 'exp1',
          company: '字节跳动 (ByteDance)',
          role: 'Android 高级开发工程师',
          startDate: '2021.06',
          endDate: '至今',
          current: true,
          description: '负责抖音短视频核心业务模块的架构设计与开发，参与客户端基础组件建设。',
          projects: [
             {
                 id: 'p1',
                 name: '视频编辑工具重构',
                 role: '技术负责人',
                 startDate: '2022.03',
                 endDate: '2022.12',
                 content: '负责视频编辑页面的整体架构重构，从 MVP 迁移至 MVVM 架构，引入 Jetpack Lifecycle 和 ViewModel。',
                 highlights: '通过对 OpenGL 渲染管线的优化，将视频预览帧率从 30fps 提升至 60fps；重构后代码行数减少 30%，Bug 率降低 20%。'
             },
             {
                 id: 'p2',
                 name: 'App 启动速度优化专项',
                 role: '核心成员',
                 startDate: '2021.10',
                 endDate: '2022.01',
                 content: '分析 App 启动流程中的耗时任务，实施异步加载和延迟初始化策略。',
                 highlights: '设计了一套任务调度框架，利用 DAG (有向无环图) 管理初始化任务依赖，使冷启动速度提升 40% (1.5s -> 0.9s)。'
             }
          ]
        },
        {
          id: 'exp2',
          company: '美团点评',
          role: 'Android 开发工程师',
          startDate: '2018.07',
          endDate: '2021.05',
          current: false,
          description: '负责外卖 App 商家端的功能迭代与维护。',
          projects: [
              {
                  id: 'p3',
                  name: '商家接单系统稳定性治理',
                  role: '主要开发者',
                  startDate: '2019.05',
                  endDate: '2020.02',
                  content: '负责解决商家端接单过程中的消息丢失和长连接断连问题。',
                  highlights: '引入 WebSocket 配合自研的高可用长连接 SDK，将接单消息到达率提升至 99.99%。'
              }
          ]
        }
      ]
    },
    {
      id: 'education',
      type: 'education',
      title: '教育经历',
      isVisible: true,
      content: [
        {
          id: 'edu1',
          school: '北京邮电大学',
          degree: '计算机科学与技术 / 本科',
          startDate: '2014.09',
          endDate: '2018.06',
          current: false,
          description: '主修课程：数据结构、操作系统、计算机网络、Java 程序设计。校学生会技术部部长。'
        }
      ]
    },
    {
      id: 'skills',
      type: 'skills',
      title: '技能与语言',
      isVisible: true,
      content: [
        { id: 's1', category: 'Android', items: ['Kotlin', 'Java', 'Jetpack (Compose, ViewModel, Room)', 'NDK', 'Gradle Plugin'] },
        { id: 's2', category: '架构 & 源码', items: ['MVVM/MVI', 'Retrofit/OkHttp', 'Glide', 'EventBus 源码分析'] },
        { id: 's3', category: '其他技能', items: ['Flutter', 'Git', 'CI/CD (Jenkins)', 'Python 脚本'] },
        { id: 's4', category: '语言能力', items: ['英语 CET-6 (良好的文档阅读能力)', '普通话'] }
      ]
    },
    {
      id: 'projects',
      type: 'projects',
      title: '开源/个人项目',
      isVisible: false, // Hidden by default as per request structure preference, but available
      content: []
    }
  ]
};

const App: React.FC = () => {
  const [resumeData, setResumeData] = useState<ResumeData>(INITIAL_DATA);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-sans">
      
      {/* Sidebar Editor (Left) - Hidden on print */}
      <div className="w-full md:w-[450px] lg:w-[500px] flex-shrink-0 bg-white border-r border-slate-200 z-10 flex flex-col h-full print:hidden shadow-xl">
        <div className="h-16 border-b border-slate-200 flex items-center justify-between px-6 bg-white shrink-0">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">R</div>
             <h1 className="font-bold text-xl text-slate-800 tracking-tight">ResumeCraft</h1>
          </div>
          <div className="text-xs font-medium px-2 py-1 bg-blue-50 text-blue-700 rounded border border-blue-100">AI 增强版</div>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <Editor data={resumeData} onChange={setResumeData} />
        </div>
      </div>

      {/* Preview Area (Right) */}
      <div className="flex-1 overflow-auto bg-slate-100 relative print:bg-white print:overflow-visible print:h-auto">
        
        {/* Toolbar - Hidden on print */}
        <div className="sticky top-0 z-20 w-full h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 print:hidden">
          <div className="text-sm text-slate-500">
            实时预览
          </div>
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl active:scale-95"
          >
            <IconDownload className="w-4 h-4" />
            导出 PDF
          </button>
        </div>

        {/* Resume Canvas */}
        <div className="p-8 pb-32 flex justify-center min-h-full print:p-0 print:block">
           <Preview data={resumeData} />
        </div>

      </div>
    </div>
  );
};

export default App;
