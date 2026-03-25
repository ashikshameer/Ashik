import React from 'react';
import { Wand2 } from 'lucide-react';

export const Testimonial: React.FC = () => {
  return (
    <section className="py-24 px-6 lg:px-12 max-w-5xl mx-auto text-center">
      <div className="inline-block p-1 rounded-2xl bg-gradient-to-r from-primary to-secondary mb-12">
        <div className="bg-white rounded-xl p-12 shadow-2xl">
          <Wand2 className="text-primary w-12 h-12 mx-auto mb-6" />
          <h2 className="font-brand text-3xl font-bold mb-6">
            "SkillMap found me a project I didn't know I was ready for. Two months later, I'm a core maintainer."
          </h2>
          <div className="flex flex-col items-center">
            <img 
              src="https://picsum.photos/seed/alex/100/100" 
              alt="Testimonial" 
              className="w-16 h-16 rounded-full object-cover mb-4 border-4 border-surface-container"
              referrerPolicy="no-referrer"
            />
            <div className="font-bold text-on-surface">Alex Rivera</div>
            <div className="text-sm text-on-surface-variant">Senior Engineer @ TechFlow</div>
          </div>
        </div>
      </div>
    </section>
  );
};
