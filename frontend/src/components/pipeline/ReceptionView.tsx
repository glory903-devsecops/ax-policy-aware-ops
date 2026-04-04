'use client';

import React, { useState } from 'react';
import { Send, MessageSquare, Sparkles, RefreshCw } from 'lucide-react';
import { api } from '../../services/api';

interface ReceptionViewProps {
  onSuccess: () => void;
}

export default function ReceptionView({ onSuccess }: ReceptionViewProps) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      await api.createInquiry(text);
      setText('');
      
      // Delay to ensure DB commit before switching view
      setTimeout(() => {
        onSuccess();
      }, 500);
      
    } catch (error) {
      console.error("Failed to submit inquiry:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white rounded-[2.5rem] border border-midas-grey-border shadow-2xl overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-midas-blue via-purple-500 to-midas-blue opacity-50" />
      
      <div className="max-w-2xl w-full flex flex-col gap-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-midas-blue/10 rounded-3xl flex items-center justify-center mx-auto mb-6 text-midas-blue">
            <MessageSquare size={32} />
          </div>
          <h2 className="text-3xl font-black text-midas-black tracking-tight mb-3">고객 문의 사항 접수</h2>
          <p className="text-midas-grey-text font-bold">영업 현장의 목소리를 자연어로 들려주세요. AI가 비즈니스 맥락을 분석합니다.</p>
        </div>

        <div className="relative group">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="예: A건설 VIP 고객입니다. 현재 P1 등급 시스템 장애가 발생했으며, 이번 건은 500억 규모의 대형 계약이 걸린 핵심 프로젝트입니다."
            className="w-full h-64 p-8 bg-slate-50 border-2 border-slate-100 rounded-[2rem] text-lg font-bold text-midas-black placeholder:text-slate-300 focus:border-midas-blue/30 focus:ring-4 focus:ring-midas-blue/5 transition-all outline-none resize-none shadow-inner"
          />
          <div className="absolute bottom-6 right-6 flex items-center gap-4">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles size={12} className="text-midas-blue" />
                AI Analysis Ready
             </span>
             <button
              onClick={handleSubmit}
              disabled={loading || !text.trim()}
              className="bg-midas-blue text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 hover:shadow-xl hover:shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
            >
              {loading ? <RefreshCw size={20} className="animate-spin" /> : <Send size={20} />}
              현장 리포트 분석 요청
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {['VIP 우선 정책 적용', '계약 가치 가중치 환산', '심각도 자동 분류'].map((feature, i) => (
            <div key={i} className="flex items-center gap-2 text-[11px] font-black text-slate-400 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
               <div className="w-1 h-1 rounded-full bg-midas-blue" />
               {feature}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
