import React, { useState } from 'react';
import { Hexagon, LayoutDashboard, Home, Info, DollarSign, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { GradualBlur } from './GradualBlur';

interface NavbarProps {
  onDashboardClick: () => void;
  onHomeClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onDashboardClick, onHomeClick }) => {
  const [activeTab, setActiveTab] = useState('home');

  const tabs = [
    { id: 'home', label: 'Home', icon: <Home className="w-4 h-4" />, action: onHomeClick },
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" />, action: onDashboardClick },
    { id: 'explore', label: 'Explore', icon: <Info className="w-4 h-4" />, action: () => {} },
    { id: 'pricing', label: 'Pricing', icon: <DollarSign className="w-4 h-4" />, action: () => {} },
  ];

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-fit px-4">
      <nav className="flex items-center gap-1 bg-surface/40 backdrop-blur-xl border border-outline-variant/20 p-1.5 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.1)]">
        <div className="flex items-center gap-2 px-4 border-r border-outline-variant/20 mr-2">
          <Hexagon className="text-primary fill-primary w-5 h-5" />
          <GradualBlur text="SkillMap" className="font-brand text-sm font-bold text-on-surface" />
        </div>
        
        <div className="flex items-center gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                tab.action();
              }}
              className={cn(
                "relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all duration-300",
                activeTab === tab.id ? "text-background" : "text-on-surface/60 hover:text-on-surface hover:bg-surface-container-low"
              )}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 bg-primary rounded-full z-0"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </span>
            </button>
          ))}
        </div>
        
        <div className="hidden lg:flex items-center gap-2 px-4 border-l border-outline-variant/20 ml-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-[10px] font-black uppercase tracking-widest text-on-surface/40">2,482 Users</span>
        </div>
      </nav>
    </div>
  );
};
