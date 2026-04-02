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
    active ? "bg-ktds-red text-white shadow-md shadow-red-900/20" : "text-ktds-grey-light hover:bg-white/5"
  )}>
    {icon}
    <span className="font-medium">{label}</span>
  </div>
);

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-ktds-black border-r border-ktds-grey-border flex flex-col p-4 fixed left-0 top-0">
      <div className="flex items-center gap-2 px-2 py-6 mb-4">
        <div className="w-8 h-8 bg-ktds-red rounded-lg flex items-center justify-center font-bold text-white italic">
           KT
        </div>
        <span className="text-xl font-bold tracking-tight text-white uppercase italic">
          <span className="text-ktds-red">DS</span> AX Fabric
        </span>
      </div>

      <div className="flex-1 space-y-1">
        <SidebarItem icon={<LayoutDashboard size={20} />} label="Dashboard" active />
        <SidebarItem icon={<AlertCircle size={20} />} label="Active Incidents" />
        <SidebarItem icon={<History size={20} />} label="Change History" />
        <SidebarItem icon={<ShieldCheck size={20} />} label="Policy Rules" />
        <SidebarItem icon={<Search size={20} />} label="Similar Search" />
      </div>

      <div className="pt-4 border-t border-ktds-grey-border">
        <SidebarItem icon={<Settings size={20} />} label="Settings" />
      </div>
    </div>
  );
};

export default Sidebar;
