'use client';

import React, { useState, useMemo } from 'react';
import { Sparkles, AlertOctagon, RotateCcw } from 'lucide-react';
import { ParticipantInput } from './ParticipantInput';
import { TeamConfig } from './TeamConfig';
import { ConstraintBuilder } from './ConstraintBuilder';
import { TeamResults } from './TeamResults';
import { parseParticipantInput } from '@/lib/team-builder/parser';
import { solveTeams } from '@/lib/team-builder/solver';
import { Constraint, SolveResult } from '@/lib/team-builder/types';
import { useToast } from '@/components/ui/Toast';

export function TeamBuilder() {
  const { showToast } = useToast();

  const [rawText, setRawText] = useState<string>(
    '홍길동, 김철수, 이영희, 박민수, 정다은, 최지우, 강태호, 윤서연, 한도윤, 신예은, 오지훈, 배수현, 류시원, 문지원'
  );
  const [teamCount, setTeamCount] = useState<number>(4);
  const [constraints, setConstraints] = useState<Constraint[]>([]);
  const [solveResult, setSolveResult] = useState<SolveResult | null>(null);

  // Cleansed list of participant names
  const parsed = useMemo(() => parseParticipantInput(rawText), [rawText]);
  const participants = parsed.names;

  const handleAddConstraint = (newConstraint: Omit<Constraint, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setConstraints((prev) => [...prev, { ...newConstraint, id }]);
    showToast(
      `'${newConstraint.personA}'와(과) '${newConstraint.personB}'의 ${
        newConstraint.type === 'fixed' ? '고정' : '분리'
      } 규칙이 추가되었습니다.`,
      'info'
    );
  };

  const handleRemoveConstraint = (id: string) => {
    setConstraints((prev) => prev.filter((c) => c.id !== id));
    showToast('규칙이 삭제되었습니다.', 'info');
  };

  const handleSolve = () => {
    if (participants.length < 2) {
      showToast('최소 2명 이상의 참여자를 입력해 주세요.', 'error');
      return;
    }
    if (participants.length < teamCount) {
      showToast(
        `참여자 수(${participants.length}명)가 조 개수(${teamCount}개)보다 적습니다.`,
        'error'
      );
      return;
    }

    const result = solveTeams(participants, teamCount, constraints);
    setSolveResult(result);

    if (result.success) {
      showToast('조 편성이 성공적으로 완료되었습니다!', 'success');
    } else {
      showToast(result.error || '조 편성에 실패했습니다.', 'error');
    }
  };

  const handleResetAll = () => {
    setConstraints([]);
    setSolveResult(null);
    showToast('모든 조건과 결과가 초기화되었습니다.', 'info');
  };

  return (
    <div className="space-y-4 sm:space-y-5 pb-8 max-w-2xl mx-auto">
      {/* Participant Input */}
      <ParticipantInput
        rawText={rawText}
        onRawTextChange={(text) => {
          setRawText(text);
          setSolveResult(null);
        }}
        participants={participants}
      />

      {/* Team Count Config */}
      <TeamConfig
        totalParticipants={participants.length}
        teamCount={teamCount}
        onTeamCountChange={(count) => {
          setTeamCount(count);
          setSolveResult(null);
        }}
      />

      {/* Constraints Builder */}
      <ConstraintBuilder
        participants={participants}
        constraints={constraints}
        onAddConstraint={handleAddConstraint}
        onRemoveConstraint={handleRemoveConstraint}
        teamCount={teamCount}
      />

      {/* Conflict / Error Banner */}
      {solveResult && !solveResult.success && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 shadow-sm space-y-2 animate-shake">
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-rose-600 shrink-0" />
            <h3 className="font-bold text-sm">조 편성 불가 (모순 조건 감지)</h3>
          </div>
          <p className="text-xs leading-relaxed text-rose-800">
            {solveResult.conflictDetails?.message || solveResult.error}
          </p>
          {solveResult.conflictDetails?.details && (
            <div className="text-[11px] bg-white/70 p-2 rounded-lg border border-rose-200 text-rose-900 font-mono">
              관련 인원: {solveResult.conflictDetails.details.join(', ')}
            </div>
          )}
        </div>
      )}

      {/* Primary Action Button */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleSolve}
          disabled={participants.length < teamCount}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white text-base font-bold shadow-md hover:shadow-lg transition min-h-[48px] disabled:opacity-50 disabled:pointer-events-none"
        >
          <Sparkles className="w-5 h-5" />
          <span>조건 반영 조 편성하기</span>
        </button>

        {(constraints.length > 0 || solveResult) && (
          <button
            type="button"
            onClick={handleResetAll}
            className="flex items-center justify-center p-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition min-h-[48px] min-w-[48px]"
            title="조건 및 결과 초기화"
            aria-label="조건 및 결과 초기화"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Results View */}
      {solveResult && solveResult.success && (
        <TeamResults
          result={solveResult}
          totalParticipants={participants.length}
          onReShuffle={handleSolve}
        />
      )}
    </div>
  );
}
