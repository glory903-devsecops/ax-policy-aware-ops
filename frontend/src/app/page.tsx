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
    <div className="flex bg-ktds-black min-h-screen text-white font-sans selection:bg-ktds-red/30">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Content Area (Shifted right for sidebar) */}
      <main className="flex-1 ml-64 flex overflow-hidden">
        
        {/* Incident List Column */}
        <div className="w-80 h-screen border-r border-ktds-grey-border flex flex-col bg-black/40">
          <div className="p-6 border-b border-ktds-grey-border flex justify-between items-center bg-ktds-black/50 backdrop-blur-md">
            <div>
              <h2 className="text-lg font-bold text-white">Incidents</h2>
              <p className="text-[10px] text-ktds-grey-light font-bold uppercase tracking-widest bg-ktds-red/10 text-ktds-red px-2 py-0.5 rounded inline-block">
                {mockIncidents.length} Active Alerts
              </p>
            </div>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-white/5 rounded-lg text-ktds-grey-light">
                <ListFilter size={18} />
              </button>
              <button className="p-2 hover:bg-white/5 rounded-lg text-ktds-grey-light">
                <LayoutGrid size={18} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
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
