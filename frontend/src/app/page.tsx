'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import IncidentCard from '@/components/IncidentCard';
import AnalysisPanel from '@/components/AnalysisPanel';
import { mockIncidents, mockAnalysisResults } from '@/services/mockData';
import { LayoutGrid, ListFilter } from 'lucide-react';

export default function Home() {
  const [selectedIncidentId, setSelectedIncidentId] = useState(mockIncidents[0].id);

  const selectedAnalysis = mockAnalysisResults[selectedIncidentId] || mockAnalysisResults[mockIncidents[0].id];

  return (
    <div className="flex bg-midas-grey-bg min-h-screen text-midas-black font-sans selection:bg-midas-blue/20">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Content Area (Shifted right for sidebar) */}
      <main className="flex-1 ml-64 flex overflow-hidden">
        
        {/* Incident List Column */}
        <div className="w-80 h-screen border-r border-midas-grey-border flex flex-col bg-white">
          <div className="p-6 border-b border-midas-grey-border flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-10">
            <div>
              <h2 className="text-xl font-black text-midas-black tracking-tight">장애 현황</h2>
              <p className="text-[10px] text-midas-blue font-black uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded inline-block mt-1">
                {mockIncidents.length}건의 활성 알람
              </p>
            </div>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-slate-100 rounded-lg text-midas-grey-text transition-colors">
                <ListFilter size={18} />
              </button>
              <button className="p-2 hover:bg-slate-100 rounded-lg text-midas-grey-text transition-colors">
                <LayoutGrid size={18} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-1">
            {mockIncidents.map(incident => (
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
        <AnalysisPanel result={selectedAnalysis} />

      </main>
    </div>
  );
}
