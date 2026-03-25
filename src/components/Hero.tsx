import React from 'react';
import { Hexagon, Terminal } from 'lucide-react';
import { motion } from 'motion/react';
import { GradualBlur } from './GradualBlur';

export const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden px-6 lg:px-12 py-20 lg:py-32 max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-12 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-7 flex flex-col space-y-8 z-10"
        >
          <GradualBlur 
            text="Every developer deserves the right project." 
            className="font-brand text-5xl lg:text-[5.5rem] leading-[0.95] font-extrabold tracking-tighter text-on-surface"
          />
          
          <p className="text-xl text-on-surface-variant max-w-xl leading-relaxed">
            SkillMap uses advanced neural processing to align your unique technical stack with high-impact open source and commercial opportunities. Stop searching, start contributing.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            <button className="hero-gradient text-background px-8 py-5 rounded-xl font-bold flex items-center gap-3 w-full sm:w-auto shadow-lg hover:scale-[1.02] transition-transform">
              <Hexagon className="w-6 h-6 fill-white" />
              Get Started Now
            </button>
            <button className="bg-surface border-2 border-outline-variant text-on-surface px-8 py-5 rounded-xl font-bold hover:bg-surface-container-low transition-colors w-full sm:w-auto">
              Explore Projects
            </button>
          </div>

          <div className="flex items-center gap-3 py-4">
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <img 
                  key={i}
                  src={`https://picsum.photos/seed/dev${i}/100/100`} 
                  alt="user" 
                  className="w-10 h-10 rounded-full border-2 border-background object-cover"
                  referrerPolicy="no-referrer"
                />
              ))}
            </div>
            <div className="bg-surface-container-low px-4 py-1.5 rounded-full">
              <span className="text-sm font-semibold text-on-surface">2,482 Developers already mapped</span>
            </div>
          </div>
        </motion.div>

        <div className="lg:col-span-5 relative">
          <div className="relative w-full aspect-square flex items-center justify-center">
            <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl scale-125"></div>
            
            <div className="relative z-10 w-full h-full flex items-center justify-center">
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -right-4 bg-surface p-6 rounded-2xl shadow-[0_20px_40px_rgba(58,16,0,0.06)]"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
                    <Terminal className="w-4 h-4" />
                  </div>
                  <div className="h-2 w-16 bg-surface-container rounded-full"></div>
                </div>
                <div className="h-1.5 w-24 bg-surface-container-low rounded-full mb-1"></div>
                <div className="h-1.5 w-20 bg-surface-container-low rounded-full"></div>
              </motion.div>

              <div className="bg-surface-container-lowest p-2 rounded-3xl shadow-2xl rotate-3 border border-outline-variant/20 overflow-hidden group">
                <img 
                  src="https://picsum.photos/seed/code/600/800" 
                  alt="skill mapping" 
                  className="w-full h-[400px] object-cover rounded-2xl grayscale hover:grayscale-0 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-6 left-6 right-6 bg-surface/90 backdrop-blur-md p-4 rounded-xl shadow-xl">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold uppercase tracking-widest text-primary">Intelligence Node</span>
                    <span className="text-xs font-mono text-on-surface-variant">98% Match</span>
                  </div>
                  <div className="mt-2 h-1 bg-surface-variant rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[98%]"></div>
                  </div>
                </div>
              </div>

              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-8 -left-8 bg-surface p-6 rounded-2xl shadow-[0_20px_40px_rgba(58,16,0,0.06)] -rotate-6"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-xs font-bold text-on-surface">Live Project Found</span>
                </div>
                <div className="space-y-2">
                  <div className="h-2 w-32 bg-surface-container rounded-full"></div>
                  <div className="h-2 w-24 bg-surface-container rounded-full"></div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
