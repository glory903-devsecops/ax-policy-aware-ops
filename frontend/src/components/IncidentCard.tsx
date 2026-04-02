'use client';

import React, { useEffect, useState } from 'react';
import { AlertTriangle, Clock, Server } from 'lucide-react';
import { Incident, Severity } from '../types';
import { clsx } from 'clsx';
import { formatDistanceToNow } from 'date-fns';

interface IncidentCardProps {
  incident: Incident;
  isActive?: boolean;
  onClick: (id: string) => void;
}

const severityColors: Record<Severity, string> = {
  low: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  high: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  critical: "bg-ktds-red/10 text-ktds-red border-ktds-red/20",
};

const IncidentCard = ({ incident, isActive, onClick }: IncidentCardProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div 
      onClick={() => onClick(incident.id)}
      className={clsx(
        "p-4 border transition-all duration-300 cursor-pointer premium-card hover:translate-x-1 mb-3 group",
        isActive ? "border-ktds-red bg-ktds-red/5" : "border-ktds-grey-border"
      )}
    >
      <div className="flex justify-between items-start mb-3">
        <span className={clsx(
          "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border",
          severityColors[incident.severity]
        )}>
          {incident.severity}
        </span>
        <span className="text-ktds-grey-light text-xs flex items-center gap-1">
          <Clock size={12} />
          {formatDistanceToNow(new Date(incident.detected_at))} ago
        </span>
      </div>

      <h3 className="font-semibold text-white mb-2 line-clamp-1 group-hover:text-ktds-red transition-colors">
        {incident.title}
      </h3>

      <div className="flex items-center gap-3 text-xs text-ktds-grey-light">
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
