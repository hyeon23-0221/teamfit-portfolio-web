'use client';

import React from 'react';
import { Layers, Plus, Minus } from 'lucide-react';

interface TeamConfigProps {
  totalParticipants: number;
  teamCount: number;
  onTeamCountChange: (count: number) => void;
}

export function TeamConfig({
  totalParticipants,
  teamCount,
  onTeamCountChange,
}: TeamConfigProps) {
  const minTeams = 2;
  const maxTeams = Math.max(2, totalParticipants);

  const handleIncrement = () => {
    if (teamCount < maxTeams) {
      onTeamCountChange(teamCount + 1);
    }
  };

  const handleDecrement = () => {
    if (teamCount > minTeams) {
      onTeamCountChange(teamCount - 1);
    }
  };

  // Calculate slot distribution preview
  const previewSlots: number[] = [];
  if (totalParticipants > 0 && teamCount >= 2) {
    const base = Math.floor(totalParticipants / teamCount);
    const extra = totalParticipants % teamCount;
    for (let i = 0; i < teamCount; i++) {
      previewSlots.push(i < extra ? base + 1 : base);
    }
  }

  const slotPreviewText =
    previewSlots.length > 0
      ? previewSlots.map((s) => `${s}명`).join(', ') + '으로 균등 분배됩니다.'
      : '인원을 입력하면 조별 예상 인원이 계산됩니다.';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-600" />
          <h2 className="font-bold text-slate-900 text-base">조 개수 설정</h2>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 p-3 rounded-xl bg-slate-50 border border-slate-100">
        <span className="text-sm font-medium text-slate-700">편성할 조 개수</span>
        <div className="flex items-center gap-3">
          <button
            onClick={handleDecrement}
            disabled={teamCount <= minTeams}
            className="w-11 h-11 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition shadow-sm"
            aria-label="조 개수 감소"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-12 text-center font-bold text-xl text-indigo-600 font-mono">
            {teamCount}
          </span>
          <button
            onClick={handleIncrement}
            disabled={teamCount >= maxTeams}
            className="w-11 h-11 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition shadow-sm"
            aria-label="조 개수 증가"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Real-time slot preview banner */}
      <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-100 text-xs text-indigo-900 flex items-center gap-2">
        <span className="font-semibold shrink-0">예상 구성:</span>
        <span className="truncate">{slotPreviewText}</span>
      </div>
    </div>
  );
}
