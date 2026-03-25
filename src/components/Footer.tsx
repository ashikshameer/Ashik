import React from 'react';
import { Hexagon } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-surface-container-highest py-16 px-8 border-t border-outline-variant/10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <Hexagon className="text-primary fill-primary w-6 h-6" />
            <span className="font-brand text-2xl font-bold text-on-surface">SkillMap</span>
          </div>
          <p className="text-on-surface-variant max-w-xs leading-relaxed">
            Curating the future of developer contributions through hyper-personalized AI mapping.
          </p>
        </div>
        
        <div>
          <h4 className="font-bold text-on-surface mb-6 uppercase tracking-widest text-xs">Resources</h4>
          <ul className="space-y-4 text-sm text-on-surface-variant">
            <li><a className="hover:text-primary transition-colors" href="#">Documentation</a></li>
            <li><a className="hover:text-primary transition-colors" href="#">Skill Taxonomy</a></li>
            <li><a className="hover:text-primary transition-colors" href="#">Open Source Policy</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold text-on-surface mb-6 uppercase tracking-widest text-xs">Platform</h4>
          <ul className="space-y-4 text-sm text-on-surface-variant">
            <li><a className="hover:text-primary transition-colors" href="#">Skill Gap Analysis</a></li>
            <li><a className="hover:text-primary transition-colors" href="#">Project Suitability</a></li>
            <li><a className="hover:text-primary transition-colors" href="#">Success Stories</a></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-outline-variant/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-on-surface-variant uppercase tracking-widest font-bold">
        <span>© 2024 SKILLMAP INTELLIGENCE. ALL RIGHTS RESERVED.</span>
        <div className="flex gap-8">
          <a className="hover:text-primary transition-colors" href="#">Privacy</a>
          <a className="hover:text-primary transition-colors" href="#">Terms</a>
          <a className="hover:text-primary transition-colors" href="#">Cookies</a>
        </div>
      </div>
    </footer>
  );
};
