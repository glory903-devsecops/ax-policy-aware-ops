'use client';

import React from 'react';
import { 
  ShieldCheck, 
  Lightbulb, 
  Zap, 
  ChevronRight, 
  CheckCircle2,
  DollarSign,
  Users
} from 'lucide-react';
import { AnalysisResult } from '../types';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

interface AnalysisPanelProps {
  result: AnalysisResult;
}

const AnalysisPanel = ({ result }: AnalysisPanelProps) => {
  const isHighRisk = (result.score || 0) >= 70;
  
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="h-full bg-white rounded-[2.5rem] border border-midas-grey-border shadow-2xl flex flex-col overflow-hidden"
    >
      {/* Header with Score */}
      <div className="p-8 border-b border-midas-grey-border bg-slate-50/50">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap size={14} className={isHighRisk ? "text-red-500" : "text-midas-blue"} />
              <span className={clsx(
                "text-[10px] font-black uppercase tracking-widest",
                isHighRisk ? "text-red-500" : "text-midas-blue"
              )}>
                AX Policy Evaluation
              </span>
            </div>
            <h2 className="text-2xl font-black text-midas-black tracking-tight">의사결정 판단 지능</h2>
          </div>
          <div className="text-right">
            <div className={clsx(
              "text-5xl font-black mb-1 font-mono",
              isHighRisk ? "text-red-600" : "text-midas-blue"
            )}>
              {result.score}<span className="text-xl opacity-40 ml-1 leading-none">점</span>
            </div>
            <div className={clsx(
              "text-[10px] font-black uppercase px-2 py-0.5 rounded inline-block",
              isHighRisk ? "bg-red-600 text-white" : "bg-midas-blue text-white"
            )}>
              {result.response_level || (isHighRisk ? 'IMMEDIATE' : 'MONITORING')}
            </div>
          </div>
        </div>

        {/* Applied Rules Breadcrumbs */}
        <div className="flex flex-wrap gap-2">
          {(result.applied_rules || result.applied_policies || []).map((rule, i) => (
            <span key={i} className="text-[10px] font-bold text-midas-grey-text bg-white border border-midas-grey-border px-2.5 py-1 rounded-full shadow-sm">
              {rule}
            </span>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8">
        {/* Rationale Section */}
        <section>
          <div className="flex items-center gap-2 mb-4 text-midas-black/40">
            <ShieldCheck size={16} />
            <h3 className="text-[11px] font-black uppercase tracking-widest">Decision Rationale</h3>
          </div>
          <div className="p-6 bg-slate-50 rounded-3xl border border-midas-grey-border relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <CheckCircle2 size={40} />
            </div>
            <p className="text-sm font-bold text-midas-black leading-relaxed whitespace-pre-line">
              {result.rationale}
            </p>
          </div>
        </section>

        {/* Business Context Section */}
        {result.business_context && (
          <section>
            <div className="flex items-center gap-2 mb-4 text-midas-black/40">
              <Users size={16} />
              <h3 className="text-[11px] font-black uppercase tracking-widest">Business Context</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-white border border-midas-grey-border rounded-2xl flex flex-col items-center text-center">
                <span className="text-[10px] font-black text-midas-grey-text uppercase mb-1">계약 가치</span>
                <span className="text-lg font-black text-midas-black flex items-center gap-1">
                  <DollarSign size={14} className="text-midas-blue" />
                  {(result.business_context.contract_value / 100000000).toLocaleString()}억
                </span>
              </div>
              <div className="p-4 bg-white border border-midas-grey-border rounded-2xl flex flex-col items-center text-center">
                <span className="text-[10px] font-black text-midas-grey-text uppercase mb-1">반복 리스크</span>
                <span className="text-lg font-black text-midas-black">
                  {result.business_context.recurring_count}회
                </span>
              </div>
            </div>
          </section>
        )}

        {/* Recommended Action Card */}
        <section>
          <div className="flex items-center gap-2 mb-4 text-midas-black/40">
            <Lightbulb size={16} />
            <h3 className="text-[11px] font-black uppercase tracking-widest">Recommended Action</h3>
          </div>
          <div className="p-8 bg-midas-blue rounded-[2.25rem] text-white shadow-xl shadow-blue-900/10 relative overflow-hidden group">
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl transition-all group-hover:scale-150" />
             <div className="flex flex-col gap-4 relative z-10">
                <h4 className="text-xl font-black leading-tight tracking-tight">
                  {result.recommended_action || 'AI 최적 권고 대응 수립 중...'}
                </h4>
                <p className="text-white/60 text-[11px] font-bold leading-relaxed">
                  마이다스아이티 AX 영업 정책 가이드라인에 따라 정의된 최적 권고 액션입니다.
                </p>
                <button className="mt-4 w-full bg-white text-midas-blue py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors shadow-lg">
                  전략 리더 보고 실행
                  <ChevronRight size={16} />
                </button>
             </div>
          </div>
        </section>
      </div>

      {/* Footer Info */}
      <div className="p-6 bg-slate-50 border-t border-midas-grey-border flex justify-between items-center px-8">
        <div className="flex items-center gap-4 text-[10px] font-bold text-midas-grey-text">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-midas-blue" />
            VIP Policy ON
          </div>
          <div className="flex items-center gap-1.5 opacity-50">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
            Strategic Intelligence Mode
          </div>
        </div>
        <span className="text-[10px] font-black text-midas-black/20 italic tracking-widest uppercase">Midas AX Intelligence</span>
      </div>
    </motion.div>
  );
};

export default AnalysisPanel;
