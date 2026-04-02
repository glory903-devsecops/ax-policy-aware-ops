'use client';

import React from 'react';
import { Shield, GitBranch, Lightbulb, CheckCircle2, AlertCircle } from 'lucide-react';
import { AnalysisResult, PolicyEvaluation, Recommendation } from '../types';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

interface AnalysisPanelProps {
  result: AnalysisResult;
}

const PolicyItem = ({ evaluation }: { evaluation: PolicyEvaluation }) => (
  <div className="flex items-start gap-4 p-4 border border-midas-grey-border rounded-lg bg-slate-50/50 mb-3">
    <div className={clsx(
      "w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm",
      evaluation.result === 'violation_risk' ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
    )}>
      {evaluation.result === 'violation_risk' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
    </div>
    <div className="flex-1">
      <div className="flex justify-between items-center mb-1">
        <h4 className="font-bold text-midas-black tracking-tight">{evaluation.policy_code}</h4>
        <span className={clsx(
          "text-xs font-black",
          evaluation.score > 0.8 ? "text-red-600" : "text-midas-grey-text"
        )}>
          일치도 {(evaluation.score * 100).toFixed(0)}%
        </span>
      </div>
      <p className="text-sm text-slate-600 leading-relaxed font-medium">
        {evaluation.rationale}
      </p>
    </div>
  </div>
);

const RecommendationCard = ({ recommendation }: { recommendation: Recommendation }) => (
  <div className="p-6 border border-midas-blue/20 bg-blue-50/30 rounded-xl mb-4 relative overflow-hidden group shadow-sm hover:shadow-md transition-all">
    <div className="absolute top-0 right-0 p-3">
      <Lightbulb className="text-midas-blue opacity-10 group-hover:opacity-40 transition-opacity" size={48} />
    </div>
    
    <div className="flex items-center gap-2 text-midas-blue mb-3">
      <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-midas-blue/10 rounded">
        {recommendation.type === 'Rollback' ? '롤백 권고' : '알림 전파'}
      </span>
      <span className="text-sm font-bold">신뢰도: {(recommendation.confidence_score * 100).toFixed(0)}%</span>
    </div>

    <h3 className="text-xl font-black text-midas-black mb-3 leading-snug">
      {recommendation.action_text}
    </h3>
    <p className="text-slate-600 text-sm mb-6 leading-relaxed font-medium">
      {recommendation.rationale}
    </p>

    <button className="w-full px-6 py-2.5 bg-midas-blue text-white font-black rounded hover:bg-blue-800 transition-all shadow-md shadow-blue-900/10">
      워크플로우 실행
    </button>
  </div>
);

const AnalysisPanel = ({ result }: AnalysisPanelProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 h-screen overflow-y-auto p-8 bg-white"
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-midas-grey-border">
          <h2 className="text-3xl font-black text-midas-black tracking-tight tracking-tighter">장애 분석 리포트</h2>
          <div className="flex items-center gap-2 text-midas-grey-text bg-slate-50 px-4 py-2 rounded-full border border-midas-grey-border shadow-sm">
            <span className="w-2 h-2 bg-accent-green rounded-full animate-pulse"></span>
            <span className="text-sm font-bold">실시간 정책 엔진 가동 중</span>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Left Column: Correlation & Policies */}
          <div className="col-span-12 lg:col-span-7 space-y-8">
            <section>
              <div className="flex items-center gap-2 mb-4 text-midas-grey-text">
                <GitBranch size={18} />
                <h3 className="text-sm font-black uppercase tracking-widest">변경 연관성 분석</h3>
              </div>
              <div className="premium-card p-6 border-l-4 border-l-midas-blue">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-4xl font-black text-midas-blue">{(result.correlation_score * 100).toFixed(0)}%</div>
                  <div className="text-xs text-right text-midas-grey-text font-bold uppercase tracking-tighter">
                    상관관계<br/>점수
                  </div>
                </div>
                <p className="text-sm text-slate-600 mb-4 font-medium leading-relaxed">
                  최근 1시간 내 분석된 {result.related_changes.length}건의 미승인 변경 사항이 장애와 높은 연관성을 가집니다.
                </p>
                <div className="space-y-4">
                  {result.related_changes.map(change => (
                    <div key={change.id} className="text-xs p-3 bg-slate-50 rounded border border-midas-grey-border">
                      <div className="flex justify-between mb-1">
                        <span className="text-midas-blue font-black">#{change.id.slice(0, 8)}</span>
                        <span className="text-red-600 font-black">미승인 변경</span>
                      </div>
                      <div className="text-midas-black font-bold mb-1">{change.description}</div>
                      <div className="flex gap-2 text-[10px] text-midas-grey-text">
                        <span>담당: {change.changed_by}</span>
                        <span>시각: {new Date(change.changed_at).toLocaleTimeString('ko-KR')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-4 text-midas-grey-text">
                <Shield size={18} />
                <h3 className="text-sm font-black uppercase tracking-widest">정책 엔진 판정 결과</h3>
              </div>
              {result.evaluations.map(evaluation => (
                <PolicyItem key={evaluation.policy_code} evaluation={evaluation} />
              ))}
            </section>
          </div>

          {/* Right Column: Recommendations */}
          <div className="col-span-12 lg:col-span-5">
            <div className="sticky top-0">
              <div className="flex items-center gap-2 mb-4 text-midas-grey-text">
                <Lightbulb size={18} />
                <h3 className="text-sm font-black uppercase tracking-widest">AI 의사결정 권고</h3>
              </div>
              {result.recommendations.map((rec, i) => (
                <RecommendationCard key={i} recommendation={rec} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AnalysisPanel;
