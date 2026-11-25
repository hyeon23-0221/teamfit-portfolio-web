'use client';

import React, { useState } from 'react';
import { ExternalLink, Github, ChevronDown, ChevronUp, Wrench, CheckCircle } from 'lucide-react';
import { Project } from '@/lib/portfolio-data';

export function ProjectCard({ project }: { project: Project }) {
  const [showTrouble, setShowTrouble] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-3 hover:border-indigo-200 transition">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <h3 className="font-bold text-slate-900 text-base">{project.title}</h3>
        <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full w-fit">
          {project.period} • {project.role}
        </span>
      </div>

      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
        {project.description}
      </p>

      {/* Tech tags */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Highlights */}
      <div className="pt-2 border-t border-slate-100 space-y-1.5">
        <span className="text-xs font-bold text-slate-700">주요 구현 내용:</span>
        <ul className="space-y-1">
          {project.highlights.map((h, i) => (
            <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
              <span>{h}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Troubleshooting collapsible */}
      {project.troubleshooting && (
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setShowTrouble(!showTrouble)}
            className="flex items-center justify-between w-full text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100/70 p-2.5 rounded-xl border border-amber-200 transition min-h-[44px]"
          >
            <div className="flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>핵심 트러블슈팅 경험 보기</span>
            </div>
            {showTrouble ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {showTrouble && (
            <div className="mt-2 p-3 rounded-xl bg-amber-50/50 border border-amber-100 text-xs text-slate-700 leading-relaxed">
              {project.troubleshooting}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
