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

  return (
    <div 
      onClick={() => onClick(incident.id)}
      className={clsx(
        "p-4 border transition-all duration-300 cursor-pointer premium-card hover:translate-x-1 mb-3 group",
        isActive ? "border-midas-blue ring-2 ring-midas-blue/10 bg-blue-50/30" : "border-midas-grey-border"
      )}
    >
      <div className="flex justify-between items-start mb-3">
        <span className={clsx(
          "px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider border",
          severityColors[incident.severity]
        )}>
          {severityLabels[incident.severity]}
        </span>
        <span className="text-midas-grey-text text-xs flex items-center gap-1">
          <Clock size={12} />
          {formatDistanceToNow(new Date(incident.detected_at), { addSuffix: true, locale: ko })}
        </span>
      </div>

      <h3 className="font-bold text-midas-black mb-2 line-clamp-1 group-hover:text-midas-blue transition-colors">
        {incident.title}
      </h3>

      <div className="flex items-center gap-3 text-xs text-midas-grey-text">
        <div className="flex items-center gap-1">
          <Server size={14} />
          {incident.system_name}
        </div>
        <div className="flex items-center gap-1">
          <AlertTriangle size={14} />
          #{incident.id.slice(0, 8)}
        </div>
      </div>
    </div>
  );
};

export default IncidentCard;
