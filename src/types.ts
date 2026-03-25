export interface Project {
  id: string;
  title: string;
  description: string;
  matchScore: number;
  domain: string;
  domainIcon: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Expert';
  estTime: string;
  skillGap: string[];
  reasoning: string;
  recommendations: string[];
  confidence: "High" | "Medium" | "Low";
  experienceEvaluation: "Beginner" | "Intermediate" | "Expert";
  domainAlignment: "Strong" | "Partial" | "Weak";
  accentColor: string;
  requiredSkills?: string[];
  projectType?: string;
  seniorityRequired?: string;
  minYearsExperience?: number;
  complexity?: string;
  budgetPerHour?: number;
  remoteOk?: boolean;
  roadmap?: {
    title: string;
    description: string;
    status: 'pending' | 'in-progress' | 'completed';
  }[];
  interviewQuestions?: {
    question: string;
    answer: string;
    category: string;
  }[];
}

export interface Developer {
  id: string;
  name: string;
  initials: string;
  status: 'Ready' | 'AI Processing' | 'Error';
  education: string;
  experience: string;
  skills: string[];
  domainPreference: string;
  pastProjects?: string[];
  avatar?: string;
  role?: string;
  level?: string;
  location?: string;
  workPreference?: string;
  hourlyRate?: number;
  availability?: string;
}
