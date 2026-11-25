'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, AlertCircle, ShieldAlert } from 'lucide-react';
import { OUT_OF_DOMAIN_REJECTION } from '@/lib/gemini';
import { useToast } from '@/components/ui/Toast';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isRejection?: boolean;
}

const QUICK_PROMPTS = [
  '주요 기술 스택은?',
  '조 편성 알고리즘 설명해줘',
  '연락처 및 이력 안내',
  '포트폴리오 주요 프로젝트는?',
];

export function ChatBot() {
  const { showToast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: '안녕하세요! 김인재의 포트폴리오 안내 전용 AI 어시스턴트입니다.\n제작자의 프로젝트, 기술 스택, 알고리즘 구현, 트러블슈팅 또는 이력에 대해 무엇이든 질문해 주세요!',
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isLoading) return;

    if (query.length > 300) {
      showToast('질문은 최대 300자 이내로 입력해 주세요.', 'error');
      return;
    }

    const userMsg: Message = {
      id: Math.random().toString(36).substring(2, 9),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: query }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        const isRejection = data.message === OUT_OF_DOMAIN_REJECTION || data.isRejection;
        const assistantMsg: Message = {
          id: Math.random().toString(36).substring(2, 9),
          sender: 'assistant',
          text: data.message,
          timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
          isRejection,
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        showToast(data.error || '답변을 불러오지 못했습니다.', 'error');
        setMessages((prev) => [
          ...prev,
          {
            id: Math.random().toString(36).substring(2, 9),
            sender: 'assistant',
            text: '죄송합니다. 서버 처리 중 오류가 발생했습니다. 잠시 후 다시 질문해 주세요.',
            timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
    } catch (err) {
      console.error(err);
      showToast('네트워크 오류가 발생했습니다.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[520px] max-h-[75dvh] overflow-hidden">
      {/* Chat Header */}
      <div className="px-4 py-3 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">AI 포트폴리오 도우미</h3>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>온라인 (Gemini Flash 연동)</span>
            </div>
          </div>
        </div>

        <div className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200 hidden sm:block">
          포트폴리오 외 질문 엄격 차단
        </div>
      </div>

      {/* Suggestion Pills */}
      <div className="px-3 py-2 bg-slate-50/40 border-b border-slate-100 flex gap-1.5 overflow-x-auto no-scrollbar shrink-0">
        {QUICK_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            onClick={() => handleSendMessage(prompt)}
            disabled={isLoading}
            className="shrink-0 text-xs px-2.5 py-1.5 rounded-full bg-white border border-slate-200 hover:border-indigo-400 hover:text-indigo-600 active:bg-indigo-50 text-slate-700 font-medium transition shadow-2xs min-h-[36px]"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Message Feed */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/20">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${
              msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0 ${
                msg.sender === 'user'
                  ? 'bg-slate-800 text-white'
                  : msg.isRejection
                  ? 'bg-rose-100 text-rose-700'
                  : 'bg-indigo-100 text-indigo-700'
              }`}
            >
              {msg.sender === 'user' ? (
                <User className="w-3.5 h-3.5" />
              ) : msg.isRejection ? (
                <ShieldAlert className="w-3.5 h-3.5" />
              ) : (
                <Bot className="w-3.5 h-3.5" />
              )}
            </div>

            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap shadow-2xs ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : msg.isRejection
                  ? 'bg-rose-50 text-rose-900 border border-rose-200 rounded-tl-none font-medium'
                  : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
              }`}
            >
              {msg.isRejection && (
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-rose-600 mb-1">
                  <ShieldAlert className="w-3 h-3 shrink-0" />
                  <span>[범위 외 질문 거절 가드레일 작동]</span>
                </div>
              )}
              {msg.text}
              <div
                className={`text-[10px] mt-1 text-right ${
                  msg.sender === 'user' ? 'text-indigo-200' : 'text-slate-600'
                }`}
              >
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-slate-600 text-xs py-2">
            <Bot className="w-4 h-4 animate-spin text-indigo-600" />
            <span>답변을 생성하고 있습니다...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-3 border-t border-slate-200 bg-white shrink-0">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="포트폴리오에 대해 질문해 보세요 (최대 300자)"
            maxLength={300}
            disabled={isLoading}
            className="flex-1 rounded-xl border border-slate-200 px-3.5 py-2.5 text-base text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent min-h-[44px]"
          />
          <button
            type="button"
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isLoading}
            className="w-11 h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-40 text-white flex items-center justify-center transition shadow-sm shrink-0"
            aria-label="질문 전송"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <div className="flex justify-between items-center text-[11px] text-slate-600 px-1 pt-1.5">
          <span>* 날씨, 숙제 등 포트폴리오 무관 질문은 지정 문구로 차단됩니다.</span>
          <span className={inputText.length > 280 ? 'text-rose-500 font-bold' : ''}>
            {inputText.length}/300자
          </span>
        </div>
      </div>
    </div>
  );
}
