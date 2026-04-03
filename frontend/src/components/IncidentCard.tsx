'use client';

import React, { useEffect, useState } from 'react';
import { AlertTriangle, Clock, Server } from 'lucide-react';
import { Incident, Severity } from '../types';
import { clsx } from 'clsx';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

interface IncidentCardProps {
  incident: Incident;
  isActive?: boolean;
  onClick: (id: string) => void;
}

const severityLabels: Record<Severity, string> = {
  low: "보통",
  medium: "주의",
  high: "높음",
  critical: "긴급",
};

const severityColors: Record<Severity, string> = {
  low: "bg-blue-50 text-blue-600 border-blue-200",
  medium: "bg-yellow-50 text-yellow-600 border-yellow-200",
  high: "bg-orange-50 text-orange-600 border-orange-200",
  critical: "bg-red-50 text-red-600 border-red-200",
};

const IncidentCard = ({ incident, isActive, onClick }: IncidentCardProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-32 bg-slate-100 rounded-xl mb-3 animate-pulse"></div>;
  }

  // Extract Client Name (Format: "Client - Solution")
  const [clientName, solutionName] = incident.system_name.split(' - ');
  const clientInitial = clientName?.charAt(0) || '?';
  
  // Deterministic color based on client name
  const avatarColors = [
    'bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 'bg-pink-500', 
    'bg-rose-500', 'bg-orange-500', 'bg-amber-500', 'bg-emerald-500', 'bg-teal-500'
  ];
  const colorIndex = (clientName?.length || 0) % avatarColors.length;
  const avatarColor = avatarColors[colorIndex];

  return (
    <div 
      onClick={() => onClick(incident.id)}
      className={clsx(
        "p-4 border transition-all duration-300 cursor-pointer premium-card hover:translate-x-1 mb-3 group relative overflow-hidden",
        isActive 
          ? "border-midas-blue ring-2 ring-midas-blue/10 bg-blue-50/50 shadow-lg" 
          : "border-midas-grey-border bg-white"
      )}
    >
      {isActive && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-midas-blue" />
      )}

      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className={clsx(
            "w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-sm shrink-0",
            avatarColor
          )}>
            {clientInitial}
          </div>
          <div>
            <div className="text-[10px] text-midas-grey-text font-bold uppercase tracking-tighter mb-0.5">
              {solutionName}
            </div>
            <h3 className={clsx(
              "font-black text-sm leading-tight transition-colors",
              isActive ? "text-midas-blue" : "text-midas-black"
            )}>
              {clientName}
            </h3>
          </div>
        </div>
        <span className={clsx(
          "px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border shrink-0",
          severityColors[incident.severity]
        )}>
          {severityLabels[incident.severity]}
        </span>
      </div>

      <p className="text-xs font-bold text-midas-black mb-3 line-clamp-1 opacity-80 group-hover:opacity-100 transition-opacity">
        {incident.title}
      </p>

      <div className="flex items-center justify-between mt-auto pt-2 border-t border-dashed border-midas-grey-border">
        <span className="text-[10px] text-midas-grey-text flex items-center gap-1 font-medium">
          <Clock size={10} />
          {formatDistanceToNow(new Date(incident.detected_at), { addSuffix: true, locale: ko })}
        </span>
        <span className="text-[10px] text-midas-grey-text flex items-center gap-1 font-mono opacity-60">
          #{incident.id.slice(0, 8)}
        </span>
      </div>
    </div>
  );
};

export default IncidentCard;
