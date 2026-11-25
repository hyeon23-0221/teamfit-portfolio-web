'use client';

import React from 'react';
import { Users2, Bot } from 'lucide-react';

export type ActiveTab = 'team-builder' | 'portfolio';

interface TabsProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export function Tabs({ activeTab, onTabChange }: TabsProps) {
  return (
    <div className="w-full max-w-2xl mx-auto mb-5">
      <div className="grid grid-cols-2 p-1.5 bg-slate-200/70 rounded-2xl border border-slate-200">
        <button
          type="button"
          onClick={() => onTabChange('team-builder')}
          className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition min-h-[44px] ${
            activeTab === 'team-builder'
              ? 'bg-white text-indigo-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users2 className="w-4 h-4" />
          <span>조 편성기</span>
        </button>

        <button
          type="button"
          onClick={() => onTabChange('portfolio')}
          className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition min-h-[44px] ${
            activeTab === 'portfolio'
              ? 'bg-white text-indigo-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>포트폴리오 & AI</span>
        </button>
      </div>
    </div>
  );
}
