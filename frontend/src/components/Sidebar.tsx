'use client';

import React from 'react';
import { LayoutDashboard, AlertCircle, ShieldCheck, Settings, History, Search } from 'lucide-react';
import { clsx } from 'clsx';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const SidebarItem = ({ icon, label, active }: SidebarItemProps) => (
  <div className={clsx(
    "flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200",
    active ? "bg-midas-blue text-white shadow-md shadow-blue-900/10" : "text-midas-grey-text hover:bg-slate-100"
  )}>
    {icon}
    <span className="font-semibold">{label}</span>
  </div>
);

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-white border-r border-midas-grey-border flex flex-col p-4 fixed left-0 top-0">
      <div className="flex items-center gap-2 px-2 py-6 mb-4">
        <div className="w-8 h-8 bg-midas-blue rounded flex items-center justify-center font-bold text-white italic">
           M
        </div>
        <span className="text-xl font-bold tracking-tight text-midas-black uppercase">
          midas <span className="text-midas-blue font-black">AX</span>
        </span>
      </div>

      <div className="flex-1 space-y-1">
        <SidebarItem icon={<LayoutDashboard size={20} />} label="운영 대시보드" active />
        <SidebarItem icon={<AlertCircle size={20} />} label="장애 분석 현황" />
        <SidebarItem icon={<History size={20} />} label="최근 변경 이력" />
        <SidebarItem icon={<ShieldCheck size={20} />} label="운영 정책 관리" />
        <SidebarItem icon={<Search size={20} />} label="유사 사례 검색" />
      </div>

      <div className="pt-4 border-t border-midas-grey-border">
        <SidebarItem icon={<Settings size={20} />} label="환경 설정" />
      </div>
    </div>
  );
};

export default Sidebar;
