import React from 'react';
import { Rocket, BarChart3, Activity, Settings, Award, PlusCircle } from 'lucide-react';
import { type Developer } from '../types';
import { cn } from '../lib/utils';
import { GradualBlur } from './GradualBlur';

interface SidebarProps {
  developers: Developer[];
  selectedDevId: string;
  onSelectDev: (id: string) => void;
  onAddNew: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ developers, selectedDevId, onSelectDev, onAddNew }) => {
  return (
    <aside className="fixed left-0 top-24 h-[calc(100vh-96px)] w-[272px] bg-surface-container-low/40 backdrop-blur-md flex flex-col p-4 space-y-4 overflow-y-auto border-r border-outline-variant/10">
      <div className="px-2 py-4 flex items-center justify-between">
        <div>
          <GradualBlur text="Developer Workspace" className="font-brand font-black text-lg text-on-surface" />
          <p className="text-xs text-on-surface/60 font-medium uppercase tracking-wider">AI-Curated Intelligence</p>
        </div>
        <button 
          onClick={onAddNew}
          className="p-2 text-primary hover:bg-primary/10 rounded-full transition-all"
          title="Add New Profile"
        >
          <PlusCircle className="w-6 h-6" />
        </button>
      </div>

      <div className="space-y-2">
        {developers.map((dev) => (
          <div 
            key={dev.id}
            onClick={() => onSelectDev(dev.id)}
            className={cn(
              "p-3 rounded-lg transition-all cursor-pointer",
              dev.id === selectedDevId ? "bg-surface/80 backdrop-blur-sm shadow-sm border-l-4 border-primary" : "hover:bg-surface/30"
            )}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                "h-10 w-10 rounded-full flex items-center justify-center text-background font-bold",
                dev.id === '1' ? "bg-secondary" : dev.id === '2' ? "bg-tertiary" : "bg-gray-400"
              )}>
                {dev.initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{dev.name}</p>
                <div className="flex items-center gap-1">
                  <span className={cn(
                    "h-2 w-2 rounded-full",
                    dev.status === 'Ready' ? "bg-tertiary" : dev.status === 'AI Processing' ? "bg-primary animate-pulse" : "bg-red-500"
                  )}></span>
                  <span className={cn(
                    "text-[10px] uppercase tracking-wider font-bold",
                    dev.status === 'Ready' ? "text-tertiary" : dev.status === 'AI Processing' ? "text-primary" : "text-red-500"
                  )}>
                    {dev.status}
                  </span>
                </div>
              </div>
              {dev.id === '1' && <Award className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-6 border-t border-outline-variant/10 flex flex-col space-y-1">
        <NavItem icon={<Rocket className="w-4 h-4" />} label="Projects" active />
        <NavItem icon={<BarChart3 className="w-4 h-4" />} label="Skill Gap" />
        <NavItem icon={<Activity className="w-4 h-4" />} label="Suitability" />
        <NavItem icon={<Settings className="w-4 h-4" />} label="Settings" />
      </div>
    </aside>
  );
};

const NavItem = ({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) => (
  <a className={cn(
    "flex items-center gap-3 p-3 rounded-lg transition-all",
    active ? "text-primary font-semibold bg-surface/80 backdrop-blur-sm shadow-sm" : "text-on-surface/70 hover:bg-surface/30"
  )} href="#">
    {icon}
    <span className="text-sm">{label}</span>
  </a>
);
