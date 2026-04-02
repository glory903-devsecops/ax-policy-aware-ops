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
  <div className="flex items-start gap-4 p-4 border border-ktds-grey-border rounded-lg bg-black/20 mb-3">
    <div className={clsx(
      "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
      evaluation.result === 'violation_risk' ? "bg-ktds-red/20 text-ktds-red" : "bg-accent-green/20 text-accent-green"
    )}>
      {evaluation.result === 'violation_risk' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
    </div>
    <div className="flex-1">
      <div className="flex justify-between items-center mb-1">
        <h4 className="font-semibold text-white">{evaluation.policy_code}</h4>
        <span className={clsx(
          "text-xs font-bold",
          evaluation.score > 0.8 ? "text-ktds-red" : "text-ktds-grey-light"
        )}>
          {(evaluation.score * 100).toFixed(0)}% Match
        </span>
      </div>
      <p className="text-sm text-ktds-grey-light leading-relaxed">
        {evaluation.rationale}
      </p>
    </div>
  </div>
);

const RecommendationCard = ({ recommendation }: { recommendation: Recommendation }) => (
  <div className="p-6 border border-ktds-red/30 bg-gradient-to-br from-ktds-red/10 to-transparent rounded-xl mb-4 relative overflow-hidden group">
    <div className="absolute top-0 right-0 p-3">
      <Lightbulb className="text-ktds-red opacity-20 group-hover:opacity-100 transition-opacity" size={48} />
    </div>
    
    <div className="flex items-center gap-2 text-ktds-red mb-3">
      <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-ktds-red/20 rounded">
        {recommendation.type}
      </span>
      <span className="text-sm font-semibold">Confidence: {(recommendation.confidence_score * 100).toFixed(0)}%</span>
    </div>

    <h3 className="text-xl font-bold text-white mb-3 leading-snug">
      {recommendation.action_text}
    </h3>
    <p className="text-ktds-grey-light text-sm mb-6 leading-relaxed">
      {recommendation.rationale}
    </p>

    <button className="w-full px-6 py-2.5 bg-ktds-red text-white font-bold rounded-lg hover:bg-red-700 transition-all shadow-lg hover:shadow-red-900/40">
      Run Workflow
    </button>
  </div>
);

const AnalysisPanel = ({ result }: AnalysisPanelProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 h-screen overflow-y-auto p-8 bg-ktds-grey-dark/50"
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-ktds-grey-border">
          <h2 className="text-3xl font-bold text-white">Incident Analysis</h2>
          <div className="flex items-center gap-2 text-ktds-grey-light bg-black/40 px-4 py-2 rounded-full border border-ktds-grey-border">
            <span className="w-2 h-2 bg-accent-green rounded-full animate-pulse"></span>
            <span className="text-sm font-medium">Real-time Policy Evaluation Active</span>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Left Column: Correlation & Policies */}
          <div className="col-span-12 lg:col-span-7 space-y-8">
            <section>
              <div className="flex items-center gap-2 mb-4 text-ktds-grey-light">
                <GitBranch size={18} />
                <h3 className="text-sm font-bold uppercase tracking-widest">Change Correlation</h3>
              </div>
              <div className="premium-card p-6 border-l-4 border-l-accent-cyan">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-4xl font-bold text-white">{(result.correlation_score * 100).toFixed(0)}%</div>
                  <div className="text-xs text-right text-ktds-grey-light font-medium uppercase tracking-tighter">
                    Correlation<br/>Score
                  </div>
                </div>
                <p className="text-sm text-ktds-grey-light mb-4 leading-relaxed">
                  최근 1시간 내 발생한 {result.related_changes.length}건의 미승인 변경 사항이 감지되었습니다.
                </p>
                <div className="space-y-4">
                  {result.related_changes.map(change => (
                    <div key={change.id} className="text-xs p-3 bg-black/40 rounded border border-ktds-grey-border">
                      <div className="flex justify-between mb-1">
                        <span className="text-accent-cyan font-bold">#{change.id.slice(0, 8)}</span>
                        <span className="text-ktds-red font-bold">Unapproved</span>
                      </div>
                      <div className="text-white font-medium mb-1">{change.description}</div>
                      <div className="flex gap-2 text-[10px]">
                        <span>By: {change.changed_by}</span>
                        <span>at: {new Date(change.changed_at).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-4 text-ktds-grey-light">
                <Shield size={18} />
                <h3 className="text-sm font-bold uppercase tracking-widest">Policy Evaluation</h3>
              </div>
              {result.evaluations.map(evaluation => (
                <PolicyItem key={evaluation.policy_code} evaluation={evaluation} />
              ))}
            </section>
          </div>

          {/* Right Column: Recommendations */}
          <div className="col-span-12 lg:col-span-5">
            <div className="sticky top-0">
              <div className="flex items-center gap-2 mb-4 text-ktds-grey-light">
                <Lightbulb size={18} />
                <h3 className="text-sm font-bold uppercase tracking-widest">AX Recommendation</h3>
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
