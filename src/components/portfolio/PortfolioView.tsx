'use client';

import React from 'react';
import { Github, Globe, Mail, BookOpen, Sparkles, Code2, Server, Database, Cpu } from 'lucide-react';
import { ProjectCard } from './ProjectCard';
import { ChatBot } from './ChatBot';
import { initialCreatorProfile, initialProjects, initialFAQs } from '@/lib/portfolio-data';

export function PortfolioView() {
  const profile = initialCreatorProfile;

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-8">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white font-extrabold text-2xl flex items-center justify-center shadow-md shrink-0">
            KJ
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">{profile.name}</h1>
              <span className="text-xs px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-semibold">
                구직/협업 오픈
              </span>
            </div>
            <p className="text-xs font-semibold text-indigo-600">{profile.role}</p>
            <p className="text-xs text-slate-600 leading-relaxed">{profile.bio}</p>
          </div>
        </div>

        {/* Contact & Social Links */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
          <a
            href={`mailto:${profile.email}`}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition min-h-[44px]"
          >
            <Mail className="w-3.5 h-3.5 text-indigo-600" />
            <span>{profile.email}</span>
          </a>
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition min-h-[44px]"
          >
            <Github className="w-3.5 h-3.5 text-slate-800" />
            <span>GitHub</span>
          </a>
          <a
            href={profile.blog}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition min-h-[44px]"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
            <span>기술 블로그</span>
          </a>
        </div>
      </div>

      {/* AI Chatbot Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 px-1">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <h2 className="font-bold text-slate-900 text-base">포트폴리오 안내 AI 도우미</h2>
        </div>
        <ChatBot />
      </div>

      {/* Featured Projects Showcase */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="font-bold text-slate-900 text-base">핵심 프로젝트 (Featured)</h2>
          <span className="text-xs text-slate-500 font-medium">{initialProjects.length}개 프로젝트</span>
        </div>
        <div className="space-y-3">
          {initialProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>

      {/* Skills Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
        <h2 className="font-bold text-slate-900 text-base">보유 기술 역량 (Skills)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <Code2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>Frontend</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {profile.skills.frontend.map((s) => (
                <span key={s} className="px-2 py-0.5 bg-white text-[11px] rounded border border-slate-200 text-slate-700">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <Server className="w-3.5 h-3.5 text-emerald-600" />
              <span>Backend & Serverless</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {profile.skills.backend.map((s) => (
                <span key={s} className="px-2 py-0.5 bg-white text-[11px] rounded border border-slate-200 text-slate-700">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <Database className="w-3.5 h-3.5 text-amber-600" />
              <span>Database & Vector Store</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {profile.skills.database.map((s) => (
                <span key={s} className="px-2 py-0.5 bg-white text-[11px] rounded border border-slate-200 text-slate-700">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <Cpu className="w-3.5 h-3.5 text-violet-600" />
              <span>AI Engine & DevOps</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {profile.skills.ai_devops.map((s) => (
                <span key={s} className="px-2 py-0.5 bg-white text-[11px] rounded border border-slate-200 text-slate-700">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
