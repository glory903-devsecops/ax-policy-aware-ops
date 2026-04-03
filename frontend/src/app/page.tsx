'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import IncidentCard from '@/components/IncidentCard';
import AnalysisPanel from '@/components/AnalysisPanel';
import { api } from '@/services/api';
import { Incident, AnalysisResult } from '@/types';
import { LayoutGrid, ListFilter, RefreshCw, Search } from 'lucide-react';

export default function Home() {
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
    fetchIncidents();
  }, []);

  useEffect(() => {
    if (selectedIncidentId) {
      fetchAnalysis(selectedIncidentId);
    }
  }, [selectedIncidentId]);

  return (
    <div className="flex bg-midas-grey-bg min-h-screen text-midas-black font-sans selection:bg-midas-blue/20">
      <Sidebar />

      <main className="flex-1 ml-64 flex overflow-hidden">
        {/* Incident List Column */}
        <div className="w-96 h-screen border-r border-midas-grey-border flex flex-col bg-slate-50/50">
          <div className="p-6 border-b border-midas-grey-border flex justify-between items-center bg-white/80 backdrop-blur-xl sticky top-0 z-10 shadow-sm">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-midas-blue animate-pulse" />
                <span className="text-[10px] font-black text-midas-blue uppercase tracking-widest">Live Feed</span>
              </div>
              <h2 className="text-xl font-black text-midas-black tracking-tight">Global Sales Ops</h2>
              <p className="text-[10px] text-midas-grey-text font-bold mt-0.5">
                현장 장애 및 비즈니스 리스크 모니터링
              </p>
            </div>
            <div className="flex gap-1">
              <button 
                onClick={fetchIncidents}
                className="p-2 hover:bg-slate-100 rounded-xl text-midas-grey-text transition-all active:scale-95"
                title="새로고침"
              >
                <RefreshCw size={16} className={loading ? "animate-spin text-midas-blue" : ""} />
              </button>
              <button className="p-2 hover:bg-slate-100 rounded-xl text-midas-grey-text transition-colors">
                <ListFilter size={16} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-1">
            <div className="flex items-center justify-between px-2 pb-4 pt-2">
              <span className="text-[11px] font-black text-midas-black/40 uppercase tracking-widest">
                Active Client Incidents
              </span>
              <span className="bg-midas-black text-white text-[9px] font-black px-1.5 py-0.5 rounded">
                {incidents.length}
              </span>
            </div>
            
            {incidents.length === 0 && !loading && (
              <div className="text-center py-20 px-10">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                  <LayoutGrid size={20} />
                </div>
                <p className="text-midas-grey-text text-sm font-bold">감지된 장애가 없습니다.</p>
                <p className="text-midas-grey-text text-[11px] mt-1 italic">테스트 엔진을 실행하여 데이터를 생성하세요.</p>
              </div>
            )}
            
            {incidents.map(incident => (
              <IncidentCard 
                key={incident.id} 
                incident={incident} 
                isActive={selectedIncidentId === incident.id}
                onClick={setSelectedIncidentId}
              />
            ))}
          </div>
        </div>

        {/* Dynamic Analysis Panel */}
        {analysis ? (
          <AnalysisPanel result={analysis} />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-white text-midas-grey-text">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 animate-bounce">
              <Search size={24} className="text-midas-blue/30" />
            </div>
            <p className="font-black text-sm text-midas-black/20 uppercase tracking-widest">
              Analysing Real-time Data...
            </p>
            <p className="text-xs italic mt-2 opacity-60">좌측 리스트에서 고객사를 선택하여 상세 분석을 시작하세요.</p>
          </div>
        )}
      </main>
    </div>
  );
}
