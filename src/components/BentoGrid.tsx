import React from 'react';
import { Sparkles, Rocket, BarChart3, Users } from 'lucide-react';
import { GradualBlur } from './GradualBlur';

export const BentoGrid: React.FC = () => {
  return (
    <section className="px-6 lg:px-12 py-24 bg-surface-container-low">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <GradualBlur text="Precision over Volume." className="font-brand text-4xl font-bold mb-4" />
          <p className="text-on-surface-variant max-w-2xl text-lg">We don't just find projects. We curate technical legacies by analyzing the nuanced gaps in your portfolio.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="md:col-span-2 bg-surface-container-lowest p-8 rounded-[2rem] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8">
              <BarChart3 className="text-primary/10 w-32 h-32" />
            </div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container/10 text-secondary-container text-xs font-bold mb-6">
                <Sparkles className="w-3 h-3" />
                DEEP ANALYTICS
              </div>
              <h3 className="text-2xl font-bold mb-4 font-editorial">Semantic Code Analysis</h3>
              <p className="text-on-surface-variant leading-relaxed max-w-md">
                Our AI reads your actual commits, not just your resume. We understand your coding style, architectural preferences, and documentation habits.
              </p>
              <div className="mt-8 flex gap-2">
                <span className="px-3 py-1 bg-surface-container text-xs rounded-full font-medium text-on-surface">Rust</span>
                <span className="px-3 py-1 bg-surface-container text-xs rounded-full font-medium text-on-surface">Concurrency</span>
                <span className="px-3 py-1 bg-surface-container text-xs rounded-full font-medium text-on-surface">WASM</span>
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="bg-primary text-background p-8 rounded-[2rem] flex flex-col justify-between">
            <div>
              <Rocket className="w-10 h-10 mb-6" />
              <h3 className="text-2xl font-bold mb-2 font-editorial">Career Acceleration</h3>
              <p className="text-background/80 text-sm leading-relaxed">
                Join projects that fill your specific skill gaps and prepare you for your next senior role.
              </p>
            </div>
            <div className="pt-8">
              <div className="text-4xl font-black font-brand">15%</div>
              <div className="text-xs uppercase tracking-widest opacity-70">Avg. Salary Increase</div>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="bg-surface p-8 rounded-[2rem] shadow-sm border border-outline-variant/10">
            <BarChart3 className="text-primary w-10 h-10 mb-6" />
            <h3 className="text-2xl font-bold mb-2 font-editorial">Suitability Index</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
              Real-time score of how well a project's technical debt aligns with your current learning path.
            </p>
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-bold">
                <span>COMPATIBILITY</span>
                <span>88%</span>
              </div>
              <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[88%]"></div>
              </div>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="md:col-span-2 bg-secondary text-background p-8 rounded-[2rem] flex items-center justify-between overflow-hidden relative">
            <div className="max-w-xs z-10">
              <h3 className="text-2xl font-bold mb-4 font-editorial">Global Developer Workspace</h3>
              <p className="text-background/80 text-sm leading-relaxed mb-6">
                Connect with curated teams from around the world looking for exactly what you offer.
              </p>
              <button className="bg-background text-secondary px-6 py-2.5 rounded-lg font-bold text-sm">Join the Network</button>
            </div>
            <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-30">
              <img 
                src="https://picsum.photos/seed/team/400/400" 
                alt="team" 
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
