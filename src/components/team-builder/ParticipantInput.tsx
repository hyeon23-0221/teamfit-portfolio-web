'use client';

import React from 'react';
import { Users, AlertTriangle, Sparkles, Trash2, ListRestart } from 'lucide-react';
import { parseParticipantInput, deduplicateNames, autoNumberDuplicates } from '@/lib/team-builder/parser';

interface ParticipantInputProps {
  rawText: string;
  onRawTextChange: (text: string) => void;
  participants: string[];
}

const SAMPLE_NAMES = [
  '홍길동', '김철수', '이영희', '박민수', '정다은',
  '최지우', '강태호', '윤서연', '한도윤', '신예은',
  '오지훈', '배수현', '류시원', '문지원'
].join('\n');

export function ParticipantInput({
  rawText,
  onRawTextChange,
  participants,
}: ParticipantInputProps) {
  const parsed = parseParticipantInput(rawText);

  const handleApplyDeduplication = () => {
    const deduped = deduplicateNames(parsed.names);
    onRawTextChange(deduped.join('\n'));
  };

  const handleApplyAutoNumbering = () => {
    const numbered = autoNumberDuplicates(parsed.names);
    onRawTextChange(numbered.join('\n'));
  };

  const handleLoadSample = () => {
    onRawTextChange(SAMPLE_NAMES);
  };

  const handleClear = () => {
    onRawTextChange('');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-600" />
          <h2 className="font-bold text-slate-900 text-base">참여자 명단 입력</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            총 {participants.length}명
          </span>
        </div>
      </div>

      <div className="relative">
        <textarea
          value={rawText}
          onChange={(e) => onRawTextChange(e.target.value)}
          placeholder="참여자 이름을 쉼표, 줄바꿈 또는 공백으로 입력하세요&#10;예: 홍길동, 김철수, 이영희&#10;박민수 정다은"
          rows={5}
          className="w-full rounded-xl border border-slate-200 p-3 text-base text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-y font-mono min-h-[120px]"
        />
      </div>

      {parsed.hasDuplicates && (
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              중복된 이름 발견: <strong>{parsed.duplicateNames.join(', ')}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleApplyAutoNumbering}
              className="flex-1 sm:flex-none px-3 py-2 bg-amber-200 hover:bg-amber-300 text-amber-900 rounded-lg font-medium transition min-h-[44px]"
            >
              자동 넘버링 부여
            </button>
            <button
              onClick={handleApplyDeduplication}
              className="flex-1 sm:flex-none px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg font-medium transition min-h-[44px]"
            >
              중복 제거
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100">
        <button
          onClick={handleLoadSample}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition min-h-[44px]"
        >
          <Sparkles className="w-4 h-4" />
          <span>샘플 명단(14명) 불러오기</span>
        </button>

        {rawText.length > 0 && (
          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition min-h-[44px]"
          >
            <Trash2 className="w-4 h-4" />
            <span>비우기</span>
          </button>
        )}
      </div>
    </div>
  );
}
