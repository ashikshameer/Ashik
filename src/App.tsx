import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { BentoGrid } from './components/BentoGrid';
import { Testimonial } from './components/Testimonial';
import { Footer } from './components/Footer';
import { Sidebar } from './components/Sidebar';
import { ProjectCard } from './components/ProjectCard';
import { PROJECTS as INITIAL_PROJECTS, DEVELOPERS } from './constants';
import { GraduationCap, Briefcase, AlertTriangle, Cloud, Grid, Shield, BarChart3, Filter, Sparkles, Loader2, Settings, PlusCircle, Download, MapPin, DollarSign, ChevronLeft, ChevronRight, Moon, Sun, BrainCircuit, Target, Users, Trophy } from 'lucide-react';
import { getSkillRecommendations, type AIRecord } from './services/aiService';
import { type Project, type Developer } from './types';
import { generatePDFReport } from './lib/pdfGenerator';
import { RadarChart } from './components/RadarChart';
import { cn } from './lib/utils';
import { GradualBlur } from './components/GradualBlur';
import Iridescence from './components/Iridescence';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [view, setView] = useState<'landing' | 'dashboard'>('landing');
  const [darkMode, setDarkMode] = useState(false);
  const [developers, setDevelopers] = useState<Developer[]>(DEVELOPERS);
  const [selectedDevId, setSelectedDevId] = useState<string>(DEVELOPERS[0].id);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<AIRecord | null>(null);
  const [teamSynergy, setTeamSynergy] = useState<{ name: string; role: string; reason: string }[]>([]);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [sandboxSkills, setSandboxSkills] = useState<string[]>([]);
  
  // Filter states
  const [domainFilter, setDomainFilter] = useState('All');
  const [skillFilter, setSkillFilter] = useState('');
  const [complexityFilter, setComplexityFilter] = useState('All');
  
  // Form State
  const [profile, setProfile] = useState({
    name: DEVELOPERS[0].name,
    education: DEVELOPERS[0].education,
    skills: DEVELOPERS[0].skills.join(", "),
    experience: DEVELOPERS[0].experience,
    domainPreference: DEVELOPERS[0].domainPreference,
    pastProjects: DEVELOPERS[0].pastProjects?.join(", ") || ""
  });

  const selectedDev = developers.find(d => d.id === selectedDevId) || developers[0];

  const calculateSkillMatch = (projectSkills: string[] | undefined) => {
    if (!projectSkills || projectSkills.length === 0) return 0;
    const devSkills = [...selectedDev.skills, ...sandboxSkills].map(s => s.toLowerCase());
    const matched = projectSkills.filter(ps => 
      devSkills.some(ds => ds.includes(ps.toLowerCase()) || ps.toLowerCase().includes(ds))
    );
    return Math.round((matched.length / projectSkills.length) * 100);
  };

  const uniqueDomains = ['All', ...new Set(INITIAL_PROJECTS.map(p => p.domain))];
  const uniqueComplexities = ['All', 'Beginner', 'Intermediate', 'Expert'];

  const filteredProjects = projects.filter(p => {
    const matchesDomain = domainFilter === 'All' || p.domain === domainFilter;
    const matchesComplexity = complexityFilter === 'All' || p.difficulty === complexityFilter;
    const matchesSkill = skillFilter === '' || 
      p.requiredSkills?.some(s => s.toLowerCase().includes(skillFilter.toLowerCase())) ||
      p.title.toLowerCase().includes(skillFilter.toLowerCase()) ||
      p.description.toLowerCase().includes(skillFilter.toLowerCase());
    return matchesDomain && matchesComplexity && matchesSkill;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Sync form with selected dev
  useEffect(() => {
    if (!isCreatingNew) {
      setProfile({
        name: selectedDev.name,
        education: selectedDev.education,
        skills: selectedDev.skills.join(", "),
        experience: selectedDev.experience,
        domainPreference: selectedDev.domainPreference,
        pastProjects: selectedDev.pastProjects?.join(", ") || ""
      });
      setAiResult(null);
      setProjects(INITIAL_PROJECTS);
    }
  }, [selectedDevId, isCreatingNew, selectedDev]);

  const handleAddNewProfile = () => {
    setIsCreatingNew(true);
    setShowProfileForm(true);
    setProfile({
      name: "",
      education: "",
      skills: "",
      experience: "Beginner (0-1 year)",
      domainPreference: "",
      pastProjects: ""
    });
    setAiResult(null);
  };

  const handleSaveProfile = () => {
    if (!profile.name.trim()) {
      alert("Please enter a name for the new profile.");
      return;
    }

    const newId = (developers.length + 1).toString();
    const newDev: Developer = {
      id: newId,
      name: profile.name,
      initials: profile.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2),
      status: 'Ready',
      education: profile.education,
      skills: profile.skills.split(",").map(s => s.trim()).filter(Boolean),
      experience: profile.experience,
      domainPreference: profile.domainPreference,
      pastProjects: profile.pastProjects.split(",").map(s => s.trim()).filter(Boolean)
    };

    setDevelopers([...developers, newDev]);
    setSelectedDevId(newId);
    setIsCreatingNew(false);
  };

  const handleRunAI = async () => {
    setIsAnalyzing(true);
    try {
      // Create a virtual developer from the form data
      const virtualDev: Developer = {
        ...selectedDev,
        name: profile.name,
        education: profile.education,
        skills: [...profile.skills.split(",").map(s => s.trim()), ...sandboxSkills],
        experience: profile.experience,
        domainPreference: profile.domainPreference,
        pastProjects: profile.pastProjects.split(",").map(s => s.trim())
      };

      const result = await getSkillRecommendations(virtualDev, INITIAL_PROJECTS);
      setAiResult(result);

      // Generate some dynamic team synergy based on the best fit project
      const bestProject = INITIAL_PROJECTS.find(p => p.id === result.bestFitProjectId);
      if (bestProject) {
        const missingSkills = result.recommendations.find(r => r.projectId === bestProject.id)?.skillGap || [];
        
        // Find developers who have these missing skills
        const collaborators = DEVELOPERS
          .filter(d => d.id !== selectedDevId) // Don't suggest self
          .map(d => {
            const matchingSkills = d.skills.filter(s => 
              missingSkills.some(ms => ms.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(ms.toLowerCase()))
            );
            return {
              name: d.name,
              role: d.role || d.experience,
              reason: matchingSkills.length > 0 
                ? `Expert in ${matchingSkills.slice(0, 2).join(", ")} which covers your skill gaps.`
                : `Strong ${d.role} profile to support project execution.`,
              score: matchingSkills.length
            };
          })
          .sort((a, b) => b.score - a.score)
          .slice(0, 3);

        setTeamSynergy(collaborators);
      }
      
      // Update projects with AI scores and data
      const updatedProjects = INITIAL_PROJECTS.map(p => {
        const rec = result.recommendations.find(r => r.projectId === p.id);
        if (rec) {
          return {
            ...p,
            matchScore: rec.matchScore,
            skillGap: rec.skillGap,
            reasoning: rec.reasoning,
            recommendations: rec.recommendations,
            confidence: rec.confidence,
            experienceEvaluation: rec.experienceEvaluation,
            domainAlignment: rec.domainAlignment,
            roadmap: rec.roadmap,
            interviewQuestions: rec.interviewQuestions
          };
        }
        return p;
      }).sort((a, b) => b.matchScore - a.matchScore);
      
      setProjects(updatedProjects as Project[]);
    } catch (error) {
      console.error("AI Analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDownloadPDF = () => {
    generatePDFReport('dashboard-report', `SkillMap_Report_${selectedDev.name.replace(/\s+/g, '_')}.pdf`);
  };

  const handlePrevDev = () => {
    const currentIndex = developers.findIndex(d => d.id === selectedDevId);
    const prevIndex = (currentIndex - 1 + developers.length) % developers.length;
    setSelectedDevId(developers[prevIndex].id);
    setIsCreatingNew(false);
  };

  const handleNextDev = () => {
    const currentIndex = developers.findIndex(d => d.id === selectedDevId);
    const nextIndex = (currentIndex + 1) % developers.length;
    setSelectedDevId(developers[nextIndex].id);
    setIsCreatingNew(false);
  };

  const getRadarData = () => {
    const baseSkills = [
      { axis: "AI/ML", key: ["ai", "ml", "machine learning", "deep learning", "neural", "vision", "nlp", "llm"] },
      { axis: "Backend", key: ["backend", "node", "python", "java", "go", "api", "fastapi", "django", "server"] },
      { axis: "Frontend", key: ["frontend", "react", "vue", "angular", "css", "html", "javascript", "typescript", "ui", "ux"] },
      { axis: "DevOps", key: ["devops", "docker", "kubernetes", "aws", "azure", "gcp", "ci/cd", "terraform", "cloud"] },
      { axis: "Data", key: ["data", "sql", "postgresql", "mongodb", "spark", "hadoop", "etl", "snowflake", "analytics"] }
    ];

    const userSkills = profile.skills.toLowerCase() + " " + sandboxSkills.join(" ").toLowerCase();
    
    const userValues = baseSkills.map(skill => {
      const hasSkill = skill.key.some(k => userSkills.includes(k));
      let value = hasSkill ? 85 : 40;
      
      // Boost based on experience
      if (profile.experience.includes('Expert')) value += 10;
      if (profile.experience.includes('Intermediate')) value += 5;
      
      return { axis: skill.axis, value: Math.min(value, 100) };
    });

    const targetValues = baseSkills.map(skill => {
      if (!aiResult) return { axis: skill.axis, value: 70 };
      
      const bestProject = projects[0];
      const isDomainMatch = bestProject.domain.toLowerCase().includes(skill.axis.toLowerCase()) || 
                           bestProject.title.toLowerCase().includes(skill.axis.toLowerCase());
      
      let value = isDomainMatch ? 95 : 65;
      
      // Adjust based on skill gap
      const isGap = bestProject.skillGap.some(gap => skill.key.some(k => gap.toLowerCase().includes(k)));
      if (isGap) value = 90; // Target is high if it's a gap
      
      return { axis: skill.axis, value };
    });

    return [userValues, targetValues];
  };

  if (view === 'landing') {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="fixed inset-0 -z-10">
          <Iridescence 
            color={darkMode ? [0.1, 0.1, 0.1] : [0.95, 0.95, 0.95]} 
            mouseReact={true} 
            amplitude={0.1}
            speed={0.5}
          />
        </div>
        <Navbar 
          onDashboardClick={() => setView('dashboard')} 
          onHomeClick={() => setView('landing')} 
        />
        <main className="pt-24">
          <Hero />
          <BentoGrid />
          <Testimonial />
          <Footer />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background/30 relative overflow-hidden">
      <div className="fixed inset-0 -z-10">
        <Iridescence 
          color={darkMode ? [0.1, 0.1, 0.1] : [0.98, 0.98, 0.98]} 
          mouseReact={true} 
          amplitude={0.05}
          speed={0.3}
        />
      </div>
      <Navbar 
        onDashboardClick={() => setView('dashboard')} 
        onHomeClick={() => setView('landing')} 
      />
      <div className="flex pt-24">
        <Sidebar 
          developers={developers}
          selectedDevId={selectedDevId} 
          onSelectDev={(id) => {
            setIsCreatingNew(false);
            setSelectedDevId(id);
          }} 
          onAddNew={handleAddNewProfile}
        />
        <main id="dashboard-report" className="ml-[272px] flex-1 p-12 max-w-7xl">
          <header className="mb-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="max-w-2xl">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-primary font-bold text-xs uppercase tracking-[0.2em] block">Candidate Intelligence</span>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={handlePrevDev}
                      className="p-1 hover:bg-surface-container rounded-full transition-colors text-on-surface/40 hover:text-primary"
                      title="Previous Candidate"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={handleNextDev}
                      className="p-1 hover:bg-surface-container rounded-full transition-colors text-on-surface/40 hover:text-primary"
                      title="Next Candidate"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <h1 className="font-brand text-6xl font-extrabold text-on-surface tracking-tight mb-4">{selectedDev.name}</h1>
                <div className="flex flex-wrap items-center gap-4 text-on-surface/60 font-medium">
                  <span className="flex items-center gap-1">
                    <GraduationCap className="w-4 h-4" /> {selectedDev.education}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-outline-variant"></span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4" /> {selectedDev.role || selectedDev.experience}
                  </span>
                  {selectedDev.location && (
                    <>
                      <span className="h-1 w-1 rounded-full bg-outline-variant"></span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" /> {selectedDev.location}
                      </span>
                    </>
                  )}
                  {selectedDev.hourlyRate && (
                    <>
                      <span className="h-1 w-1 rounded-full bg-outline-variant"></span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" /> ${selectedDev.hourlyRate}/hr
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setDarkMode(!darkMode)}
                  className="bg-surface-container-high p-3 rounded-xl font-bold text-on-surface hover:bg-surface-container transition-all"
                  title="Toggle Dark Mode"
                >
                  {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                {isCreatingNew ? (
                  <button 
                    onClick={handleSaveProfile}
                    className="bg-tertiary text-background px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-tertiary/20"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Save New Profile
                  </button>
                ) : (
                  <button 
                    onClick={() => setShowProfileForm(!showProfileForm)}
                    className="bg-surface-container-high px-6 py-3 rounded-xl font-bold text-on-surface hover:bg-surface-container transition-all flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    {showProfileForm ? "Hide Profile" : "Edit Profile"}
                  </button>
                )}
                <button 
                  onClick={handleDownloadPDF}
                  className="bg-surface-container-high px-6 py-3 rounded-xl font-bold text-on-surface hover:bg-surface-container transition-all flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export PDF
                </button>
                <button 
                  onClick={handleRunAI}
                  disabled={isAnalyzing}
                  className="bg-primary text-background px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-primary/20"
                >
                  {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  {isAnalyzing ? "Processing Dataset..." : "Train & Recommend"}
                </button>
              </div>
            </div>
          </header>

          {showProfileForm && (
            <section className="mb-12 bg-surface p-8 rounded-[2rem] border border-outline-variant/20 whisper-shadow animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="font-brand font-bold text-xl mb-6 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" />
                <GradualBlur text="User Attribute Collection" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-on-surface/40">Candidate Name</label>
                  <input 
                    type="text" 
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    className="w-full p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 focus:outline-none focus:border-primary transition-all"
                    placeholder="e.g. John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-on-surface/40">Educational Qualification</label>
                  <input 
                    type="text" 
                    value={profile.education}
                    onChange={(e) => setProfile({...profile, education: e.target.value})}
                    className="w-full p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 focus:outline-none focus:border-primary transition-all"
                    placeholder="e.g. B.Sc. Computer Science, High School Diploma, bteach"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-on-surface/40">Years of Experience</label>
                  <select 
                    value={profile.experience}
                    onChange={(e) => setProfile({...profile, experience: e.target.value})}
                    className="w-full p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 focus:outline-none focus:border-primary transition-all"
                  >
                    <option>Beginner (0-1 year)</option>
                    <option>Intermediate (2-4 years)</option>
                    <option>Expert (5+ years)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-on-surface/40">Technical Skills & Interests (Comma separated)</label>
                  <input 
                    type="text" 
                    value={profile.skills}
                    onChange={(e) => setProfile({...profile, skills: e.target.value})}
                    className="w-full p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 focus:outline-none focus:border-primary transition-all"
                    placeholder="e.g. Python, web development, data analysis"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-on-surface/40">Domain Preference</label>
                  <input 
                    type="text" 
                    value={profile.domainPreference}
                    onChange={(e) => setProfile({...profile, domainPreference: e.target.value})}
                    className="w-full p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 focus:outline-none focus:border-primary transition-all"
                    placeholder="e.g. AI/ML, cybersecurity, web, mobile, cloud"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-on-surface/40">Past Projects or Work History (if any)</label>
                  <textarea 
                    value={profile.pastProjects}
                    onChange={(e) => setProfile({...profile, pastProjects: e.target.value})}
                    className="w-full p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 focus:outline-none focus:border-primary transition-all h-24"
                    placeholder="e.g. Scalable recommendation engine, Real-time data pipeline..."
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <div className="text-xs font-black uppercase tracking-widest text-on-surface/40 flex items-center gap-2">
                    <BrainCircuit className="w-4 h-4 text-primary" />
                    <GradualBlur text='"What If" Skill Sandbox (Add skills to test fit)' />
                  </div>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      id="sandbox-input"
                      className="flex-1 p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 focus:outline-none focus:border-primary transition-all"
                      placeholder="e.g. Rust, GraphQL, Kubernetes"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const input = e.currentTarget;
                          if (input.value.trim()) {
                            setSandboxSkills([...sandboxSkills, input.value.trim()]);
                            input.value = '';
                          }
                        }
                      }}
                    />
                    <button 
                      onClick={() => {
                        const input = document.getElementById('sandbox-input') as HTMLInputElement;
                        if (input.value.trim()) {
                          setSandboxSkills([...sandboxSkills, input.value.trim()]);
                          input.value = '';
                        }
                      }}
                      className="bg-primary text-background px-4 py-2 rounded-xl font-bold"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {sandboxSkills.map(skill => (
                      <span key={skill} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2">
                        {skill}
                        <button onClick={() => setSandboxSkills(sandboxSkills.filter(s => s !== skill))} className="hover:text-red-500">×</button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          <section className="mb-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-surface-container-low p-8 rounded-[2rem] relative overflow-hidden border border-primary/10">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <RadarChart 
                  data={getRadarData()}
                  width={200}
                  height={200}
                />
              </div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="text-yellow-500 fill-yellow-500 w-5 h-5" />
                    <div className="font-brand font-bold text-xl">
                      <GradualBlur text={aiResult ? "AI Recommendation Report" : "Awaiting Analysis"} />
                    </div>
                  </div>
                  {aiResult && (
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      Best Fit: {projects[0].title}
                    </span>
                  )}
                </div>
                
                <p className="text-on-surface/80 max-w-xl mb-6 font-medium leading-relaxed">
                  {aiResult 
                    ? aiResult.bestFitJustification 
                    : "Fill out your profile and click 'Train & Recommend' to generate a personalized project suitability report using our hybrid content-based filtering model."
                  }
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-3">
                      {(aiResult ? projects[0].skillGap : []).map((gap) => (
                        <SkillTag key={gap} icon={<Cloud className="w-4 h-4" />} label={gap} />
                      ))}
                    </div>
                    {aiResult && (
                      <div className="pt-4 border-t border-outline-variant/10">
                        <p className="text-xs text-on-surface/40 uppercase font-bold tracking-widest mb-2">Learning Recommendations</p>
                        <div className="flex flex-col gap-2">
                          {projects[0].recommendations.map(rec => (
                            <div key={rec} className="flex items-center gap-2 text-sm font-semibold text-on-surface/80">
                              <Sparkles className="w-3 h-3 text-primary" />
                              {rec}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {aiResult && (
                    <div className="bg-surface p-6 rounded-2xl shadow-sm border border-outline-variant/10">
                      <h4 className="text-xs font-black uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Skill Fit Analysis
                      </h4>
                      <RadarChart 
                        data={getRadarData()}
                        width={180}
                        height={180}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-on-surface text-background p-8 rounded-[2rem] flex flex-col justify-between glass">
              <div>
                <div className="font-brand font-bold text-xl mb-4 flex items-center gap-2">
                  <Grid className="w-5 h-5 text-primary" />
                  <GradualBlur text="Model Rationale" />
                </div>
                <p className="text-sm text-background/70 leading-relaxed mb-6">
                  Our system utilizes a <strong>Content-Based Filtering</strong> approach powered by Large Language Model embeddings. 
                </p>
                <div className="space-y-6">
                  <div className="bg-background/5 p-4 rounded-xl border border-background/10">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-2 flex items-center gap-2">
                      <Users className="w-3 h-3" />
                      Team Synergy Builder
                    </h4>
                    <div className="space-y-3">
                      {teamSynergy.length > 0 ? (
                        teamSynergy.map((member, i) => (
                          <div key={i} className="border-l-2 border-primary/30 pl-3">
                            <p className="text-[10px] font-bold text-background">{member.name} • <span className="text-primary/80">{member.role}</span></p>
                            <p className="text-[8px] text-background/40 italic">{member.reason}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-background/60 italic">
                          Run analysis to see recommended collaborators for your best-fit projects.
                        </p>
                      )}
                    </div>
                  </div>
                  <ul className="text-xs space-y-3 text-background/60">
                    <li className="flex gap-2">
                      <span className="text-primary">●</span>
                      <span><strong>Preprocessing:</strong> Tokenization and semantic encoding of user attributes.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">●</span>
                      <span><strong>Matching:</strong> Vector similarity analysis between user profile and project requirements.</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="pt-6 mt-6 border-t border-background/10">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest">Hybrid Model v2.4</span>
                </div>
              </div>
            </div>
          </section>

          <div className="flex items-center justify-between mb-8">
            <GradualBlur text="Strategic Project Matches" className="font-brand font-bold text-3xl" />
            <div className="flex items-center gap-2 text-primary font-bold text-sm cursor-pointer">
              <span>{aiResult ? "Ranked by Real-time AI" : "Ranked by AI Suitability"}</span>
              <Filter className="w-4 h-4" />
            </div>
          </div>

          {aiResult && (
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <GradualBlur text="Top 3 Strategic Alignments" className="font-brand font-bold text-2xl" />
                  <p className="text-on-surface/60 text-sm">The most compatible projects based on your current skill vector.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {projects.slice(0, 3).map((project, idx) => (
                  <div 
                    key={project.id} 
                    className={cn(
                      "p-6 rounded-[2rem] border transition-all duration-500 hover:-translate-y-1 cursor-pointer",
                      idx === 0 ? "bg-primary text-background border-primary shadow-xl shadow-primary/20" : "bg-surface border-outline-variant/20 whisper-shadow"
                    )}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className={cn(
                        "text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg",
                        idx === 0 ? "bg-background/20 text-background" : "bg-primary/10 text-primary"
                      )}>
                        Match #{idx + 1}
                      </span>
                      <span className="text-2xl font-editorial font-black">{project.matchScore}%</span>
                    </div>
                    <h4 className="font-brand font-bold text-lg mb-2 line-clamp-1">{project.title}</h4>
                    <div className="flex items-center gap-2 mb-3">
                      <span className={cn(
                        "text-[10px] font-black uppercase tracking-widest",
                        idx === 0 ? "text-background/60" : "text-primary/60"
                      )}>
                        {calculateSkillMatch(project.requiredSkills)}% Skill Match
                      </span>
                    </div>
                    <p className={cn(
                      "text-xs mb-4 line-clamp-3 leading-relaxed",
                      idx === 0 ? "text-background/80" : "text-on-surface/60"
                    )}>
                      {project.reasoning}
                    </p>
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "h-1.5 flex-1 rounded-full overflow-hidden",
                        idx === 0 ? "bg-background/20" : "bg-surface-container"
                      )}>
                        <div 
                          className={cn("h-full", idx === 0 ? "bg-background" : "bg-primary")} 
                          style={{ width: `${project.matchScore}%` }} 
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className="mb-12 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/10">
              <p className="text-[10px] font-black uppercase tracking-widest text-on-surface/40 mb-1">Market Trend</p>
              <div className="flex items-center justify-between">
                <span className="font-bold">{aiResult ? (projects[0].domain) : 'GenAI / LLMs'}</span>
                <span className="text-green-500 text-xs font-bold">+{aiResult ? (Math.floor(Math.random() * 20) + 30) : 42}%</span>
              </div>
            </div>
            <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/10">
              <p className="text-[10px] font-black uppercase tracking-widest text-on-surface/40 mb-1">Top Skill Gap</p>
              <div className="flex items-center justify-between">
                <span className="font-bold">{aiResult ? (projects[0].skillGap[0] || 'N/A') : 'Python / FastAPI'}</span>
                <span className="text-primary text-xs font-bold">High Demand</span>
              </div>
            </div>
            <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/10">
              <p className="text-[10px] font-black uppercase tracking-widest text-on-surface/40 mb-1">Avg. Project Budget</p>
              <div className="flex items-center justify-between">
                <span className="font-bold">${aiResult ? projects[0].budgetPerHour : 55} / hr</span>
                <span className="text-on-surface/40 text-xs font-bold">Global</span>
              </div>
            </div>
            <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/10">
              <p className="text-[10px] font-black uppercase tracking-widest text-on-surface/40 mb-1">Match Rate</p>
              <div className="flex items-center justify-between">
                <span className="font-bold">{aiResult ? Math.floor(projects[0].matchScore) : 78}%</span>
                <span className="text-secondary text-xs font-bold">Optimal</span>
              </div>
            </div>
          </div>

          {aiResult && (
            <section className="mb-12 bg-surface p-8 rounded-[2rem] border border-outline-variant/20 whisper-shadow">
              <div className="font-brand font-bold text-2xl mb-8 flex items-center gap-2">
                <BrainCircuit className="w-6 h-6 text-primary" />
                <GradualBlur text="Strategic Skill Gap Analysis" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects[0].skillGap.map((gap, i) => (
                  <div key={gap} className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/10 hover:border-primary/30 transition-all">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {i + 1}
                      </div>
                      <h4 className="font-bold text-lg">{gap}</h4>
                    </div>
                    <p className="text-sm text-on-surface/60 mb-4">
                      {projects[0].recommendations[i] || `Essential for ${projects[0].title}. Focus on practical implementation.`}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-outline-variant/10">
                      <span className="text-[10px] font-black uppercase tracking-widest text-on-surface/40">Priority</span>
                      <span className="text-xs font-bold text-primary">High</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className="flex flex-col md:flex-row gap-4 mb-8 p-6 bg-surface rounded-[2rem] whisper-shadow border border-outline-variant/10">
            <div className="flex-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-on-surface/40 mb-2 block">Search Skills or Projects</label>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface/40" />
                <input 
                  type="text" 
                  placeholder="e.g. Python, SQL, Cloud..."
                  className="w-full pl-10 pr-4 py-2 bg-surface-container-low rounded-xl border border-outline-variant/10 focus:border-primary/30 outline-none text-sm font-medium"
                  value={skillFilter}
                  onChange={(e) => setSkillFilter(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <label className="text-[10px] font-black uppercase tracking-widest text-on-surface/40 mb-2 block">Domain</label>
              <select 
                className="w-full px-4 py-2 bg-surface-container-low rounded-xl border border-outline-variant/10 focus:border-primary/30 outline-none text-sm font-medium"
                value={domainFilter}
                onChange={(e) => setDomainFilter(e.target.value)}
              >
                {uniqueDomains.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="w-full md:w-48">
              <label className="text-[10px] font-black uppercase tracking-widest text-on-surface/40 mb-2 block">Complexity</label>
              <select 
                className="w-full px-4 py-2 bg-surface-container-low rounded-xl border border-outline-variant/10 focus:border-primary/30 outline-none text-sm font-medium"
                value={complexityFilter}
                onChange={(e) => setComplexityFilter(e.target.value)}
              >
                {uniqueComplexities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="grid gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project, idx) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                  >
                    <ProjectCard 
                      project={project} 
                      isBestFit={idx === 0 && !skillFilter && domainFilter === 'All' && complexityFilter === 'All'} 
                      rank={idx + 1}
                      skillMatchPercentage={calculateSkillMatch(project.requiredSkills)}
                    />
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20 bg-surface rounded-[2rem] whisper-shadow border border-dashed border-outline-variant/30"
                >
                  <AlertTriangle className="w-12 h-12 text-on-surface/20 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-on-surface/60">No projects match your filters</h3>
                  <p className="text-on-surface/40 mt-2">Try adjusting your search criteria or domain selection.</p>
                  <button 
                    onClick={() => {
                      setDomainFilter('All');
                      setSkillFilter('');
                      setComplexityFilter('All');
                    }}
                    className="mt-6 text-primary font-bold hover:underline"
                  >
                    Clear all filters
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}

const SkillTag: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
  <span className="bg-yellow-500/10 text-yellow-800 px-4 py-2 rounded-full text-sm font-bold border border-yellow-500/20 flex items-center gap-2">
    {icon}
    {label}
  </span>
);
