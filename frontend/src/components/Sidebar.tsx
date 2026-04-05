'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  ShieldCheck, 
  Settings, 
  History, 
  Search,
  MessageSquare,
  Terminal,
  ExternalLink
} from 'lucide-react';
import { clsx } from 'clsx';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const SidebarItem = ({ icon, label, active, onClick }: SidebarItemProps) => (
  <div 
    onClick={onClick}
    className={clsx(
      "flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200",
      active ? "bg-midas-blue text-white shadow-xl shadow-blue-500/20" : "text-midas-grey-text hover:bg-slate-50"
    )}
  >
    {icon}
    <span className="font-black text-xs uppercase tracking-tight">{label}</span>
  </div>
);

interface SidebarProps {
  activeStep: string;
  onStepChange: (step: any) => void;
}

const Sidebar = ({ activeStep, onStepChange }: SidebarProps) => {
  return (
    <div className="w-64 h-screen bg-white border-r border-midas-grey-border flex flex-col p-6 fixed left-0 top-0 z-50">
      <div className="flex items-center gap-3 px-2 py-6 mb-8 group cursor-pointer" onClick={() => onStepChange('dashboard')}>
        <div className="w-10 h-10 bg-midas-blue rounded-2xl flex items-center justify-center font-black text-white italic shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
           M
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-black tracking-tighter text-midas-black uppercase leading-none">
            midas <span className="text-midas-blue">AX</span>
          </span>
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-1">Decision Fabric</span>
        </div>
      </div>

      <div className="flex-1 space-y-2">
        <p className="px-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Main Menu</p>
        <SidebarItem 
          icon={<LayoutDashboard size={18} />} 
          label="의사결정 대시보드" 
          active={activeStep === 'dashboard'} 
          onClick={() => onStepChange('dashboard')}
        />
        <SidebarItem 
          icon={<History size={18} />} 
          label="문의사항 리스트" 
          active={activeStep === 'classification'} 
          onClick={() => onStepChange('classification')}
        />
        <SidebarItem 
          icon={<MessageSquare size={18} />} 
          label="고객 문의사항 접수" 
          active={activeStep === 'reception'} 
          onClick={() => onStepChange('reception')}
        />
        
        <p className="px-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-10 mb-4">Operation Control</p>
        <SidebarItem 
          icon={<ShieldCheck size={18} />} 
          label="운영 규칙 관리" 
          active={activeStep === 'policy'}
          onClick={() => onStepChange('policy')}
        />
        <SidebarItem 
          icon={<Search size={18} />} 
          label="전략적 유사 사례" 
          active={activeStep === 'cases'}
          onClick={() => onStepChange('cases')}
        />
      </div>

      <div className="pt-6 border-t border-midas-grey-border space-y-2">
        <SidebarItem 
          icon={<Terminal size={18} />} 
          label="API 명세서 (Docs)" 
          onClick={() => window.open('http://localhost:8000/docs', '_blank')}
        />
        <SidebarItem icon={<Settings size={18} />} label="시스템 설정" />
      </div>
    </div>
  );
};

export default Sidebar;
