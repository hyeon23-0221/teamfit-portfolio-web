'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Save, LogOut, Plus, Trash2, CheckCircle2, AlertCircle, FileText, HelpCircle } from 'lucide-react';
import { Project, FAQ, CreatorProfile, initialCreatorProfile, initialProjects, initialFAQs } from '@/lib/portfolio-data';
import { useToast } from '@/components/ui/Toast';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [profile, setProfile] = useState<CreatorProfile>(initialCreatorProfile);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [faqs, setFaqs] = useState<FAQ[]>(initialFAQs);
  const [activeTab, setActiveTab] = useState<'projects' | 'faqs' | 'profile'>('projects');
  const [isSaving, setIsSaving] = useState(false);
  const [adminEmail, setAdminEmail] = useState<string>('admin@teamfit.com');

  useEffect(() => {
    // Read current admin email cookie
    const match = document.cookie.match(/teamfit_admin_email=([^;]+)/);
    if (match) {
      setAdminEmail(decodeURIComponent(match[1]));
    }

    // Fetch existing knowledge data from API
    fetch('/api/admin/knowledge')
      .then((res) => {
        if (res.status === 403 || res.status === 401) {
          router.push('/admin/unauthorized');
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.success && data.data) {
          setProfile(data.data.profile);
          setProjects(data.data.projects);
          setFaqs(data.data.faqs);
        }
      })
      .catch((err) => console.error(err));
  }, [router]);

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile, projects, faqs }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast('지식 베이스가 성공적으로 저장되었습니다.', 'success');
      } else {
        showToast(data.error || '저장 중 오류가 발생했습니다.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('네트워크 저장 오류가 발생했습니다.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    document.cookie = 'teamfit_admin_email=; path=/; max-age=0';
    showToast('로그아웃되었습니다.', 'info');
    router.push('/admin/login');
  };

  const handleAddProject = () => {
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      title: '새 프로젝트 제목',
      description: '프로젝트에 대한 상세 설명을 입력하세요.',
      period: '2024.11',
      role: '풀스택 개발',
      tags: ['Next.js', 'TypeScript'],
      highlights: ['주요 기능 설명 1', '주요 기능 설명 2'],
      troubleshooting: '해결한 문제 상황 및 개선 지표 기록',
    };
    setProjects([newProj, ...projects]);
    showToast('새 프로젝트 템플릿이 추가되었습니다.', 'info');
  };

  const handleRemoveProject = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id));
    showToast('프로젝트가 삭제되었습니다.', 'info');
  };

  const handleAddFaq = () => {
    const newFaq: FAQ = {
      id: `faq-${Date.now()}`,
      category: 'projects',
      question: '새 질문 내용을 입력하세요',
      answer: '챗봇이 답변할 명확한 내용을 작성하세요.',
    };
    setFaqs([newFaq, ...faqs]);
    showToast('새 FAQ 항목이 추가되었습니다.', 'info');
  };

  const handleRemoveFaq = (id: string) => {
    setFaqs(faqs.filter((f) => f.id !== id));
    showToast('FAQ가 삭제되었습니다.', 'info');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-5 pb-16 px-2 sm:px-4">
      {/* Admin Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">포트폴리오 관리자 콘솔</h1>
            <p className="text-xs text-slate-500">
              인증된 관리자: <span className="font-mono text-indigo-600">{adminEmail}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleSaveAll}
            disabled={isSaving}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold shadow-sm transition min-h-[44px]"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? '저장 중...' : '변경사항 저장'}</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-xs font-semibold transition min-h-[44px]"
            title="로그아웃"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">로그아웃</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('projects')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition min-h-[44px] ${
            activeTab === 'projects'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>프로젝트 관리 ({projects.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('faqs')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition min-h-[44px] ${
            activeTab === 'faqs'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>FAQ 관리 ({faqs.length})</span>
        </button>
      </div>

      {/* Tab 1: Projects Editor */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">등록된 프로젝트 목록</span>
            <button
              onClick={handleAddProject}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition min-h-[44px]"
            >
              <Plus className="w-4 h-4" />
              <span>새 프로젝트 추가</span>
            </button>
          </div>

          <div className="space-y-4">
            {projects.map((proj, idx) => (
              <div key={proj.id} className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-600">프로젝트 #{idx + 1}</span>
                  <button
                    onClick={() => handleRemoveProject(proj.id)}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition min-h-[44px] min-w-[44px] flex items-center justify-center"
                    aria-label="프로젝트 삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700">프로젝트 제목</label>
                  <input
                    type="text"
                    value={proj.title}
                    onChange={(e) => {
                      const updated = [...projects];
                      updated[idx].title = e.target.value;
                      setProjects(updated);
                    }}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-base text-slate-800 min-h-[44px]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700">요약 설명</label>
                  <textarea
                    value={proj.description}
                    onChange={(e) => {
                      const updated = [...projects];
                      updated[idx].description = e.target.value;
                      setProjects(updated);
                    }}
                    rows={2}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-base text-slate-800 resize-y"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-semibold text-slate-700">개발 기간</label>
                    <input
                      type="text"
                      value={proj.period}
                      onChange={(e) => {
                        const updated = [...projects];
                        updated[idx].period = e.target.value;
                        setProjects(updated);
                      }}
                      className="w-full rounded-xl border border-slate-200 p-2.5 text-base text-slate-800 min-h-[44px]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700">역할</label>
                    <input
                      type="text"
                      value={proj.role}
                      onChange={(e) => {
                        const updated = [...projects];
                        updated[idx].role = e.target.value;
                        setProjects(updated);
                      }}
                      className="w-full rounded-xl border border-slate-200 p-2.5 text-base text-slate-800 min-h-[44px]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700">트러블슈팅 경험</label>
                  <textarea
                    value={proj.troubleshooting || ''}
                    onChange={(e) => {
                      const updated = [...projects];
                      updated[idx].troubleshooting = e.target.value;
                      setProjects(updated);
                    }}
                    rows={2}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-base text-slate-800 resize-y"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: FAQs Editor */}
      {activeTab === 'faqs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">챗봇 참조 FAQ 항목</span>
            <button
              onClick={handleAddFaq}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition min-h-[44px]"
            >
              <Plus className="w-4 h-4" />
              <span>새 FAQ 추가</span>
            </button>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={faq.id} className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-600">FAQ #{idx + 1}</span>
                  <button
                    onClick={() => handleRemoveFaq(faq.id)}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition min-h-[44px] min-w-[44px] flex items-center justify-center"
                    aria-label="FAQ 삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700">예상 질문</label>
                  <input
                    type="text"
                    value={faq.question}
                    onChange={(e) => {
                      const updated = [...faqs];
                      updated[idx].question = e.target.value;
                      setFaqs(updated);
                    }}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-base text-slate-800 min-h-[44px]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700">답변 내용</label>
                  <textarea
                    value={faq.answer}
                    onChange={(e) => {
                      const updated = [...faqs];
                      updated[idx].answer = e.target.value;
                      setFaqs(updated);
                    }}
                    rows={3}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-base text-slate-800 resize-y"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
