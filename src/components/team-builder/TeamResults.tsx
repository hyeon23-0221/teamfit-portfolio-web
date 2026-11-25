'use client';

import React from 'react';
import { Copy, Check, Users, Sparkles, Clock, RefreshCw } from 'lucide-react';
import { SolveResult } from '@/lib/team-builder/types';
import { formatTeamsForClipboard } from '@/lib/team-builder/formatter';
import { useToast } from '@/components/ui/Toast';

interface TeamResultsProps {
  result: SolveResult;
  totalParticipants: number;
  onReShuffle: () => void;
}

export function TeamResults({
  result,
  totalParticipants,
  onReShuffle,
}: TeamResultsProps) {
  const { showToast } = useToast();
  const [copied, setCopied] = React.useState(false);

  if (!result.success || !result.teams || result.teams.length === 0) {
    return null;
  }

  const handleCopy = async () => {
    const formatted = formatTeamsForClipboard(result, totalParticipants);
    try {
      await navigator.clipboard.writeText(formatted);
      setCopied(true);
      showToast('조 편성 결과가 클립보드에 복사되었습니다. (카카오톡/디스코드용)', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      showToast('클립보드 복사에 실패했습니다.', 'error');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h2 className="font-bold text-slate-900 text-lg">조 편성 결과</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            총 {totalParticipants}명 / {result.teams.length}개 조 배정 완료
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={onReShuffle}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition shadow-sm min-h-[44px]"
          >
            <RefreshCw className="w-4 h-4" />
            <span>다시 뽑기</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold transition shadow-sm min-h-[44px]"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? '복사 완료!' : '결과 복사 (카톡/디스코드)'}</span>
          </button>
        </div>
      </div>

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        {result.teams.map((team) => (
          <div
            key={team.id}
            className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-indigo-50/30 hover:border-indigo-200 transition space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-sm">
                ■ {team.name}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-700">
                {team.members.length}명
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {team.members.map((member, idx) => (
                <span
                  key={`${team.id}-${idx}-${member}`}
                  className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-white border border-slate-200 text-slate-800 shadow-2xs"
                >
                  {member}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Solver Meta Footer */}
      <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-600 pt-3 border-t border-slate-100 gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-600" />
            연산 시간: {result.executionTimeMs}ms
          </span>
          <span>탐색 반복: {result.iterationCount}회</span>
        </div>
        {result.rulesApplied && (
          <span>
            반영 규칙: 고정 {result.rulesApplied.fixedCount}건 / 분리 {result.rulesApplied.excludeCount}건
          </span>
        )}
      </div>
    </div>
  );
}
