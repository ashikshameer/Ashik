import React from 'react';
import * as Icons from 'lucide-react';
import { motion } from 'motion/react';
import { type Project } from '../types';
import { cn } from '../lib/utils';

const InterviewQuestion: React.FC<{ q: { question: string; answer: string; category: string } }> = ({ q }) => {
  const [showAnswer, setShowAnswer] = React.useState(false);
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">{q.category}</span>
        <button 
          onClick={() => setShowAnswer(!showAnswer)}
          className="text-[10px] font-bold hover:underline"
        >
          {showAnswer ? "Hide Answer" : "Reveal Answer"}
        </button>
      </div>
      <p className="text-sm font-medium">Q: {q.question}</p>
      {showAnswer && (
        <div className="bg-background/5 p-3 rounded-lg text-xs text-background/60 italic animate-in fade-in slide-in-from-top-2 duration-300">
          A: {q.answer}
        </div>
      )}
    </div>
  );
};

export const ProjectCard: React.FC<{ 
  project: Project; 
  isBestFit?: boolean; 
  rank?: number;
  skillMatchPercentage?: number;
}> = ({ project, isBestFit, rank, skillMatchPercentage }) => {
  const Icon = (Icons as any)[project.domainIcon] || Icons.Code;

  return (
    <motion.article 
      whileHover={{ y: -5, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        "bg-white rounded-[2rem] p-8 whisper-shadow relative transition-all duration-300",
        isBestFit ? "border-4 border-primary" : "border-l-4",
        !isBestFit && rank && rank <= 3 ? "border-l-primary/40" : 
        !isBestFit && project.accentColor === 'secondary' ? "border-l-secondary" : 
        !isBestFit && project.accentColor === 'red-500' ? "border-l-red-500" : ""
      )}
    >
      {isBestFit && (
        <div className="absolute -top-5 left-10 bg-primary text-background px-4 py-1.5 rounded-full flex items-center gap-2 font-bold text-sm shadow-lg">
          <Icons.Trophy className="w-4 h-4 fill-background" />
          BEST FIT
        </div>
      )}
      
      {!isBestFit && rank && rank <= 3 && (
        <div className="absolute -top-3 left-10 bg-surface-container-high text-primary px-3 py-1 rounded-full flex items-center gap-2 font-bold text-[10px] tracking-widest uppercase border border-primary/20">
          <Icons.Star className="w-3 h-3 fill-primary" />
          Top Match #{rank}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-10">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Icon className={cn(
                  "p-2 rounded-lg w-10 h-10",
                  project.accentColor === 'primary' ? "text-primary bg-primary/10" :
                  project.accentColor === 'secondary' ? "text-secondary bg-secondary/10" : "text-red-500 bg-red-500/10"
                )} />
                <span className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase",
                  project.accentColor === 'primary' ? "text-primary bg-primary/10" :
                  project.accentColor === 'secondary' ? "text-secondary bg-secondary/10" : "text-red-500 bg-red-500/10"
                )}>
                  {project.domain}
                </span>
              </div>
              <h3 className="font-brand text-3xl font-bold mb-1">{project.title}</h3>
              
              {skillMatchPercentage !== undefined && (
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-1.5 w-24 bg-surface-container rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary" 
                      style={{ width: `${skillMatchPercentage}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                    {skillMatchPercentage}% Skill Match
                  </span>
                </div>
              )}

              <p className="text-on-surface/60 font-medium leading-relaxed">{project.description}</p>
              
              <div className="flex flex-wrap gap-2 mt-4">
                {project.requiredSkills?.map(skill => (
                  <span key={skill} className="px-2 py-1 bg-surface-container-low text-on-surface/60 rounded-md text-[10px] font-bold border border-outline-variant/10 uppercase tracking-wider">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-right">
              <div className={cn(
                "text-5xl font-editorial font-black",
                isBestFit ? "text-primary" : "text-on-surface/40"
              )}>
                {project.matchScore}%
              </div>
              <div className="text-[10px] font-black uppercase tracking-tighter text-on-surface/40">SIMILARITY SCORE</div>
            </div>
          </div>

          {isBestFit && (
            <div className="mt-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-surface-container-low rounded-2xl">
                <div>
                  <p className="text-xs font-black text-tertiary mb-4 tracking-widest uppercase">Skill Gaps</p>
                  <ul className="space-y-2">
                    {project.skillGap.map(gap => (
                      <li key={gap} className="flex items-center gap-2 text-sm font-semibold">
                        <Icons.XCircle className="w-4 h-4 text-primary fill-primary/20" />
                        {gap}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-black text-primary mb-4 tracking-widest uppercase">Learning Path</p>
                  <ul className="space-y-2">
                    {project.recommendations.map(rec => (
                      <li key={rec} className="flex items-center gap-2 text-sm font-semibold text-on-surface/60">
                        <Icons.BookOpen className="w-4 h-4 text-tertiary fill-tertiary/20" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col justify-center items-center border-l border-outline-variant/20 pl-6">
                  <p className="text-xs font-black text-on-surface/40 mb-4 tracking-widest uppercase">Project Synergy</p>
                  <div className="relative w-20 h-20">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-outline-variant/20"
                      />
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={2 * Math.PI * 36}
                        strokeDashoffset={2 * Math.PI * 36 * (1 - project.matchScore / 100)}
                        className="text-primary"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-sm font-black">
                      {project.matchScore}%
                    </div>
                  </div>
                </div>
              </div>

              {project.roadmap && (
                <div className="bg-surface-container-low p-6 rounded-2xl">
                  <h4 className="text-xs font-black uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
                    <Icons.Map className="w-4 h-4" />
                    Interactive Learning Roadmap
                  </h4>
                  <div className="space-y-4">
                    {project.roadmap.map((step, i) => (
                      <div key={i} className="flex gap-4 relative">
                        {i !== project.roadmap!.length - 1 && (
                          <div className="absolute left-2.5 top-6 bottom-0 w-0.5 bg-outline-variant/30" />
                        )}
                        <div className={cn(
                          "w-5 h-5 rounded-full flex items-center justify-center z-10 mt-1",
                          step.status === 'completed' ? "bg-green-500" :
                          step.status === 'in-progress' ? "bg-primary animate-pulse" : "bg-outline-variant"
                        )}>
                          {step.status === 'completed' && <Icons.Check className="w-3 h-3 text-background" />}
                        </div>
                        <div>
                          <p className="text-sm font-bold">{step.title}</p>
                          <p className="text-xs text-on-surface/60">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {project.interviewQuestions && (
                <div className="bg-on-surface text-background p-6 rounded-2xl glass">
                  <h4 className="text-xs font-black uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
                    <Icons.MessageSquare className="w-4 h-4" />
                    AI Interview Simulator
                  </h4>
                  <div className="space-y-6">
                    {project.interviewQuestions.map((q, i) => (
                      <InterviewQuestion key={i} q={q} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {isBestFit ? (
          <div className="lg:w-80 flex flex-col justify-between border-l border-outline-variant/20 pl-0 lg:pl-10">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-brand font-bold text-lg">AI Reasoning</h4>
                <span className={cn(
                  "px-2 py-0.5 rounded text-[10px] font-black uppercase",
                  project.confidence === 'High' ? "bg-green-100 text-green-700" :
                  project.confidence === 'Medium' ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
                )}>
                  {project.confidence} Confidence
                </span>
              </div>
              <div className="bg-surface-container-low/50 p-4 rounded-xl relative overflow-hidden mb-4">
                <p className="text-sm italic leading-relaxed text-on-surface/80">
                  "{project.reasoning}"
                </p>
              </div>
              <div className="pt-4 border-t border-outline-variant/10 space-y-3">
                <div className="flex justify-between items-center">
                  <h5 className="text-[10px] font-black uppercase tracking-widest text-on-surface/40">Exp. Match</h5>
                  <span className="text-xs font-bold text-tertiary">{project.experienceEvaluation}</span>
                </div>
                <div className="flex justify-between items-center">
                  <h5 className="text-[10px] font-black uppercase tracking-widest text-on-surface/40">Domain Alignment</h5>
                  <span className="text-xs font-bold text-primary">{project.domainAlignment}</span>
                </div>
                {project.budgetPerHour && (
                  <div className="flex justify-between items-center">
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-on-surface/40">Budget</h5>
                    <span className="text-xs font-bold text-green-600">${project.budgetPerHour}/hr</span>
                  </div>
                )}
                {project.remoteOk !== undefined && (
                  <div className="flex justify-between items-center">
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-on-surface/40">Remote OK</h5>
                    <span className="text-xs font-bold text-on-surface/60">{project.remoteOk ? "Yes" : "No"}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-8 flex flex-col gap-4">
              <div className="flex justify-between items-center bg-surface-container p-3 rounded-lg">
                <span className="text-xs font-bold text-on-surface/60">Difficulty</span>
                <span className="bg-primary text-background px-3 py-1 rounded-full text-[10px] font-black uppercase">{project.difficulty}</span>
              </div>
              <div className="flex justify-between items-center bg-surface-container p-3 rounded-lg">
                <span className="text-xs font-bold text-on-surface/60">Complexity</span>
                <span className="text-sm font-bold">{project.complexity || "Standard"}</span>
              </div>
              <div className="flex justify-between items-center bg-surface-container p-3 rounded-lg">
                <span className="text-xs font-bold text-on-surface/60">Est. Time</span>
                <span className="text-sm font-bold">{project.estTime}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:w-80 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-[10px] font-black text-on-surface/40 mb-1">LEVEL</p>
                <span className="text-xs font-bold">{project.difficulty}</span>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-black text-on-surface/40 mb-1">TIME</p>
                <span className="text-xs font-bold">{project.estTime}</span>
              </div>
            </div>
            <button className="bg-surface-container-high p-3 rounded-full hover:bg-primary hover:text-background transition-all">
              <Icons.ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </motion.article>
  );
};
