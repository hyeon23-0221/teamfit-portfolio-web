'use client';

import React, { useState } from 'react';
import { Sliders, Link2, Unlink2, Plus, X, AlertCircle } from 'lucide-react';
import { Constraint, ConstraintType } from '@/lib/team-builder/types';

interface ConstraintBuilderProps {
  participants: string[];
  constraints: Constraint[];
  onAddConstraint: (c: Omit<Constraint, 'id'>) => void;
  onRemoveConstraint: (id: string) => void;
  teamCount: number;
}

export function ConstraintBuilder({
  participants,
  constraints,
  onAddConstraint,
  onRemoveConstraint,
  teamCount,
}: ConstraintBuilderProps) {
  const [type, setType] = useState<ConstraintType>('fixed');
  const [personA, setPersonA] = useState<string>('');
  const [personB, setPersonB] = useState<string>('');
  const [inputError, setInputError] = useState<string | null>(null);

  const handleAdd = () => {
    setInputError(null);

    if (!personA || !personB) {
      setInputError('두 명의 참여자를 모두 선택해 주세요.');
      return;
    }

    if (personA === personB) {
      setInputError('서로 다른 두 명을 선택해야 합니다.');
      return;
    }

    // Check if duplicate rule already exists
    const exists = constraints.some(
      (c) =>
        c.type === type &&
        ((c.personA === personA && c.personB === personB) ||
          (c.personA === personB && c.personB === personA))
    );

    if (exists) {
      setInputError('이미 동일한 조건이 등록되어 있습니다.');
      return;
    }

    onAddConstraint({
      type,
      personA,
      personB,
    });

    setPersonA('');
    setPersonB('');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-indigo-600" />
          <h2 className="font-bold text-slate-900 text-base">조건부 규칙 빌더</h2>
        </div>
        <span className="text-xs font-semibold text-slate-500">
          등록된 규칙: {constraints.length}건
        </span>
      </div>

      {participants.length < 2 ? (
        <p className="text-xs text-slate-500 py-2">
          규칙을 추가하려면 최소 2명 이상의 참여자를 먼저 입력해 주세요.
        </p>
      ) : (
        <div className="space-y-3">
          {/* Rule type selector */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setType('fixed')}
              className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-semibold transition min-h-[44px] ${
                type === 'fixed'
                  ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-sm'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Link2 className="w-4 h-4" />
              <span>고정 (같은 조 배정)</span>
            </button>
            <button
              type="button"
              onClick={() => setType('exclude')}
              className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-semibold transition min-h-[44px] ${
                type === 'exclude'
                  ? 'bg-rose-50 border-rose-500 text-rose-700 shadow-sm'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Unlink2 className="w-4 h-4" />
              <span>분리 (다른 조 배정)</span>
            </button>
          </div>

          {/* Participant selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <select
              value={personA}
              onChange={(e) => {
                setPersonA(e.target.value);
                setInputError(null);
              }}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-base text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[44px]"
            >
              <option value="">참여자 1 선택</option>
              {participants.map((name) => (
                <option key={`a-${name}`} value={name}>
                  {name}
                </option>
              ))}
            </select>

            <select
              value={personB}
              onChange={(e) => {
                setPersonB(e.target.value);
                setInputError(null);
              }}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-base text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[44px]"
            >
              <option value="">참여자 2 선택</option>
              {participants.map((name) => (
                <option key={`b-${name}`} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          {inputError && (
            <p className="text-xs text-rose-600 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {inputError}
            </p>
          )}

          <button
            type="button"
            onClick={handleAdd}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold transition active:scale-[0.99] min-h-[44px]"
          >
            <Plus className="w-4 h-4" />
            <span>조건 추가하기</span>
          </button>
        </div>
      )}

      {/* Constraints Chip List */}
      {constraints.length > 0 && (
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <span className="text-xs font-semibold text-slate-600">등록된 조건 목록:</span>
          <div className="flex flex-wrap gap-2">
            {constraints.map((c) => (
              <div
                key={c.id}
                className={`inline-flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-xl border text-xs font-medium shadow-sm transition ${
                  c.type === 'fixed'
                    ? 'bg-indigo-50 text-indigo-900 border-indigo-200'
                    : 'bg-rose-50 text-rose-900 border-rose-200'
                }`}
              >
                <span>
                  <strong>[{c.type === 'fixed' ? '고정' : '분리'}]</strong> {c.personA} ↔ {c.personB}
                </span>
                <button
                  type="button"
                  onClick={() => onRemoveConstraint(c.id)}
                  className="p-1 hover:bg-black/10 rounded-md text-slate-500 hover:text-slate-800 min-w-[24px] min-h-[24px] flex items-center justify-center"
                  aria-label="조건 삭제"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
