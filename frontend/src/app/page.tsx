'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import AnalysisPanel from '@/components/AnalysisPanel';
import ReceptionView from '@/components/pipeline/ReceptionView';
import ClassificationView from '@/components/pipeline/ClassificationView';
import PolicyManagement from '@/components/pipeline/PolicyManagement';
import SimilarCases from '@/components/pipeline/SimilarCases';
import { api } from '@/services/api';
import { Incident, AnalysisResult } from '@/types';
import { 
  RefreshCw, 
  Search, 
  TrendingUp, 
  AlertCircle, 
  ShieldCheck, 
  Zap,
  ChevronRight,
  LayoutGrid,
  MessageSquare,
  FileSpreadsheet,
  Activity
} from 'lucide-react';
import { clsx } from 'clsx';

type PipelineStep = 'reception' | 'classification' | 'dashboard' | 'policy' | 'cases';

export default function Home() {
  const [step, setStep] = useState<PipelineStep>('reception');
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      const data = await api.getIncidents();
      setIncidents(data);
      if (data.length > 0 && !selectedIncidentId) {
        setSelectedIncidentId(data[0].id);
      }
    } catch (error) {
      console.error("Failed to fetch incidents:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalysis = async (id: string) => {
    try {
      const data = await api.getAnalysisResult(id);
      setAnalysis(data);
    } catch (error) {
      console.error("Failed to fetch analysis:", error);
      setAnalysis(null);
    }
  };

  useEffect(() => {
    if (step === 'dashboard') {
      fetchIncidents();
    }
  }, [step]);

  useEffect(() => {
    if (selectedIncidentId && step === 'dashboard') {
      fetchAnalysis(selectedIncidentId);
    }
  }, [selectedIncidentId, step]);

  const kpis = {
    total: incidents.length,
    immediate: incidents.filter(i => (i.priority_score || 0) >= 70).length,
    vip: incidents.filter(i => i.is_vip).length,
    poc: incidents.filter(i => i.is_poc).length
  };

  const renderDashboard = () => (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: '오늘 장애 고객', val: kpis.total, icon: AlertCircle, color: 'text-midas-black', sub: '실시간 감지됨' },
          { label: '즉시 대응 필요', val: kpis.immediate, icon: Zap, color: 'text-red-600', sub: '정책 점수 70점 이상', border: 'border-2 border-red-500/20' },
          { label: 'VIP 고객 영향', val: kpis.vip, icon: ShieldCheck, color: 'text-midas-blue', sub: '특별 관리 대상' },
          { label: 'PoC 리스크 수', val: kpis.poc, icon: LayoutGrid, color: 'text-amber-600', sub: '계약 전환 핵심 건' }
        ].map((k, i) => (
          <div key={i} className={clsx(
            "bg-white p-6 rounded-3xl border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group",
            k.border || "border-midas-grey-border", k.color
          )}>
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <k.icon size={64} />
            </div>
            <p className="text-[11px] font-black opacity-60 uppercase tracking-widest mb-1">{k.label}</p>
            <h3 className="text-4xl font-black">{k.val}</h3>
            <div className="mt-4 flex items-center gap-1 opacity-80 text-[11px] font-bold">
              <TrendingUp size={12} />
              <span>{k.sub}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        <div className="flex-1 bg-white rounded-[2.5rem] border border-midas-grey-border shadow-xl flex flex-col overflow-hidden">
          <div className="p-8 border-b border-midas-grey-border flex justify-between items-center">
            <h2 className="text-xl font-black text-midas-black tracking-tight">Active Client Risks</h2>
            <button onClick={fetchIncidents} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
               <RefreshCw size={16} className={loading ? "animate-spin text-midas-blue" : "text-slate-400"} />
            </button>
          </div>
          <div className="flex-1 overflow-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-white/80 backdrop-blur-md z-10 border-b border-midas-grey-border">
                <tr className="text-[10px] font-black text-midas-grey-text uppercase tracking-widest">
                  <th className="px-8 py-4 w-48">고객사</th>
                  <th className="px-6 py-4">장애 유형</th>
                  <th className="px-6 py-4 w-24 text-center">심각도</th>
                  <th className="px-6 py-4 w-24 text-center">계약가치</th>
                  <th className="px-6 py-4 w-24 text-center">VIP</th>
                  <th className="px-6 py-4 w-32 text-center text-midas-blue">순위점수</th>
                  <th className="px-6 py-4 w-12"></th>
                </tr>
              </thead>
              <tbody>
                {incidents.map(i => (
                  <tr key={i.id} onClick={() => setSelectedIncidentId(i.id)} className={clsx("cursor-pointer transition-all border-b border-midas-grey-border/50", selectedIncidentId === i.id ? 'bg-midas-blue/[0.03]' : 'hover:bg-slate-50')}>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-midas-black tracking-tight">{i.system_name}</span>
                        {i.is_poc && <span className="text-[9px] font-black text-amber-600 tracking-tighter mt-0.5">PoC Project</span>}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-xs font-bold text-midas-grey-text line-clamp-1">{i.title}</td>
                    <td className="px-6 py-5 text-center">
                      <span className={clsx("text-[9px] font-black uppercase px-2 py-1 rounded-md", i.severity === 'critical' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500')}>
                        {i.severity}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center text-xs font-bold">{i.contract_value / 100000000}억</td>
                    <td className="px-6 py-5 text-center">{i.is_vip ? <div className="mx-auto w-1.5 h-1.5 rounded-full bg-midas-blue shadow-[0_0_8px_rgba(0,115,230,0.5)]" /> : '-'}</td>
                    <td className="px-6 py-5 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className={clsx("text-sm font-black", i.priority_score >= 70 ? 'text-red-600' : 'text-midas-blue')}>{i.priority_score}점</span>
                        <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden">
                          <div className={clsx("h-full", i.priority_score >= 70 ? 'bg-red-500' : 'bg-midas-blue')} style={{ width: `${i.priority_score}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5"><ChevronRight className={clsx("transition-all", selectedIncidentId === i.id ? 'translate-x-1 text-midas-blue' : 'text-slate-300')} size={16} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="w-[480px] h-full">{analysis ? <AnalysisPanel result={analysis} /> : <div className="h-full bg-white rounded-[2.5rem] border border-midas-grey-border shadow-xl flex items-center justify-center text-slate-300">고객사를 선택하세요</div>}</div>
      </div>
    </div>
  );

  return (
    <div className="flex bg-midas-grey-bg min-h-screen text-midas-black font-sans selection:bg-midas-blue/20">
      <Sidebar activeStep={step} onStepChange={setStep} />
      <main className="flex-1 ml-64 p-8 flex flex-col h-screen overflow-hidden">
        {/* Pipeline Navigation - Visible only for pipeline steps */}
        {['reception', 'classification', 'dashboard'].includes(step) && (
          <div className="flex items-center gap-4 mb-8 bg-white p-1 rounded-3xl border border-midas-grey-border w-fit shadow-sm">
            <button onClick={() => setStep('reception')} className={clsx("px-8 py-3 rounded-2xl text-xs font-black flex items-center gap-2 transition-all", step === 'reception' ? "bg-midas-blue text-white shadow-lg" : "text-midas-grey-text hover:bg-slate-50")}>
                <MessageSquare size={16} />
                고객 문의 사항 접수
            </button>
            <ChevronRight size={14} className="text-slate-300" />
            <button onClick={() => setStep('classification')} className={clsx("px-8 py-3 rounded-2xl text-xs font-black flex items-center gap-2 transition-all", step === 'classification' ? "bg-midas-blue text-white shadow-lg" : "text-midas-grey-text hover:bg-slate-50")}>
                <FileSpreadsheet size={16} />
                고객 문의 사항 분류 (RPA)
            </button>
            <ChevronRight size={14} className="text-slate-300" />
            <button onClick={() => setStep('dashboard')} className={clsx("px-8 py-3 rounded-2xl text-xs font-black flex items-center gap-2 transition-all", step === 'dashboard' ? "bg-midas-blue text-white shadow-lg" : "text-midas-grey-text hover:bg-slate-50")}>
                <Activity size={16} />
                의사결정 대시보드
            </button>
          </div>
        )}

        {/* Header for non-pipeline steps */}
        {!['reception', 'classification', 'dashboard'].includes(step) && (
           <div className="mb-8">
              <h1 className="text-3xl font-black text-midas-black tracking-tight flex items-center gap-3 capitalize">
                {step.replace('_', ' ')}
                <span className="bg-midas-blue text-white text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest">Intelligence</span>
              </h1>
           </div>
        )}

        <div className="flex-1 flex flex-col overflow-hidden">
          {step === 'reception' && <ReceptionView onSuccess={() => setStep('classification')} />}
          {step === 'classification' && <ClassificationView onSuccess={() => setStep('dashboard')} />}
          {step === 'dashboard' && renderDashboard()}
          {step === 'policy' && <PolicyManagement />}
          {step === 'cases' && <SimilarCases />}
        </div>
      </main>
    </div>
  );
}
