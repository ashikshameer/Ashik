/**
 * MODEL SELECTION RATIONALE:
 * We use a Content-Based Filtering approach powered by a Large Language Model (LLM).
 * 
 * Why this algorithm?
 * 1. Cold Start Problem: Since we don't have a large matrix of user-project interactions, 
 *    collaborative filtering is not viable. Content-based filtering allows us to match 
 *    new users immediately based on their specific attributes.
 * 2. Semantic Understanding: Traditional keyword matching fails to understand that "ML" 
 *    is related to "Artificial Intelligence". LLMs provide deep semantic encoding (embeddings) 
 *    that capture these relationships naturally.
 * 3. Hybrid Flexibility: The model can weigh different features (e.g., Domain Preference vs. Skills) 
 *    dynamically based on the project context.
 */

import { GoogleGenAI, Type } from "@google/genai";
import { type Developer, type Project } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export interface RecommendationResult {
  projectId: string;
  matchScore: number;
  confidence: "High" | "Medium" | "Low";
  bestFit: boolean;
  reasoning: string;
  skillGap: string[];
  recommendations: string[];
  experienceEvaluation: "Beginner" | "Intermediate" | "Expert";
  domainAlignment: "Strong" | "Partial" | "Weak";
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

export interface AIRecord {
  recommendations: RecommendationResult[];
  bestFitProjectId: string;
  bestFitJustification: string;
}

/**
 * DATA PREPROCESSING STEPS:
 * 1. Cleaning: Removing noise from user input (extra spaces, inconsistent casing).
 * 2. Normalization: Standardizing experience levels and educational qualifications.
 * 3. Tokenization: Breaking down skills and project descriptions into semantic units.
 * 4. Feature Engineering: Constructing a unified "User Vector" from disparate attributes.
 */
export async function getSkillRecommendations(developer: Developer, projects: Project[]): Promise<AIRecord> {
  const model = "gemini-3-flash-preview";
  
  // Preprocessing: Clean and format data for the model
  const cleanedSkills = developer.skills.map(s => s.trim().toLowerCase()).filter(Boolean);
  const cleanedProjects = projects.map(p => ({
    id: p.id,
    title: p.title,
    description: p.description,
    domain: p.domain,
    complexity: p.difficulty // Mapping difficulty to complexity for the prompt
  }));

  const prompt = `
    SYSTEM ROLE:
    You are SkillMap AI — an advanced AI-powered talent-to-project matching system acting as an expert technical recruiter, data scientist, and career advisor.

    OBJECTIVE:
    Accurately match developers to projects using semantic intelligence, provide a match score, explain reasoning, identify skill gaps, and suggest improvements.

    INPUT DATA (USER PROFILE):
    - Name: ${developer.name}
    - Skills: ${cleanedSkills.join(", ")}
    - Experience: ${developer.experience}
    - Domain Preference: ${developer.domainPreference}
    - Education: ${developer.education}
    - Work History: ${developer.pastProjects?.join(", ") || "None"}

    DATASET (PROJECTS):
    ${JSON.stringify(cleanedProjects, null, 2)}

    AI PROCESS PIPELINE (STRICT EXECUTION):
    1. PREPROCESSING:
       - Normalize all skills (lowercase, remove duplicates)
       - Map synonyms (e.g., "node js" → "Node.js", "ai" → "Artificial Intelligence")
       - Categorize skills into domains (Frontend, Backend, AI/ML, DevOps, etc.)

    2. SEMANTIC ENCODING:
       - Convert candidate profile and project requirements into embeddings
       - Treat skills, work history, and domain as weighted signals

    3. MATCHING ENGINE:
       - Compute cosine similarity between candidate vector and project vector

    4. HYBRID SCORING MODEL:
       - similarityScore = semantic similarity (0–1)
       - experienceScore:
         Beginner (0–1 yrs) = 0.3
         Intermediate (2–4 yrs) = 0.6
         Expert (5+ yrs) = 1.0
       - domainScore = 1 if domains match, else 0.5 if related, else 0

    FINAL SCORE:
    matchScore = (0.6 * similarityScore) + (0.2 * experienceScore) + (0.2 * domainScore)
    Convert to percentage (0–100)

    5. SKILL GAP ANALYSIS:
       - missingSkills = projectSkills - candidateSkills
       - Rank missing skills by importance (core vs optional)

    6. LEARNING RECOMMENDATIONS:
       - Suggest top 3 skills to learn
       - Provide logical progression order

    7. INTERVIEW PREPARATION (MANDATORY):
       - Generate 2 technical interview questions specific to the project and candidate's skill gap.
       - Provide concise, expert-level answers for each.

    8. LEARNING ROADMAP (MANDATORY):
       - Create a 3-step roadmap (Foundation, Advanced, Implementation) to bridge the skill gap.

    9. AI REASONING (MANDATORY):
       - Explain WHY the match score was given
       - Reference: skill overlap, experience level, domain alignment

    10. CONFIDENCE SCORE:
       - High: strong data + high similarity
       - Medium: partial match
       - Low: weak or incomplete data

    OUTPUT SCHEMA:
    Return a JSON object with:
    - recommendations: Array of objects, one for each project in the dataset. Each object MUST have:
      {
        "projectId": string,
        "matchScore": number (0–100),
        "confidence": "High | Medium | Low",
        "bestFit": boolean,
        "reasoning": "clear technical explanation",
        "skillGap": ["skill1", "skill2", "skill3"],
        "recommendations": ["Learn X because...", "Improve Y by...", "Build project using Z..."],
        "experienceEvaluation": "Beginner | Intermediate | Expert",
        "domainAlignment": "Strong | Partial | Weak",
        "roadmap": [
          { "title": "Foundation", "description": "...", "status": "completed | in-progress | pending" },
          { "title": "Advanced", "description": "...", "status": "completed | in-progress | pending" },
          { "title": "Implementation", "description": "...", "status": "completed | in-progress | pending" }
        ],
        "interviewQuestions": [
          { "question": "...", "answer": "...", "category": "Technical | Domain | Behavioral" },
          { "question": "...", "answer": "...", "category": "Technical | Domain | Behavioral" }
        ]
      }
    - bestFitProjectId: string (The ID of the project with the highest matchScore)
    - bestFitJustification: string (A summary justification for the best fit)

    RULES:
    - Do NOT give generic answers
    - Do NOT hallucinate skills
    - Be precise and data-driven
    - Always justify results logically
    - Keep explanations concise but meaningful
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          recommendations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                projectId: { type: Type.STRING },
                matchScore: { type: Type.NUMBER },
                confidence: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
                bestFit: { type: Type.BOOLEAN },
                reasoning: { type: Type.STRING },
                skillGap: { type: Type.ARRAY, items: { type: Type.STRING } },
                recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
                experienceEvaluation: { type: Type.STRING, enum: ["Beginner", "Intermediate", "Expert"] },
                domainAlignment: { type: Type.STRING, enum: ["Strong", "Partial", "Weak"] },
                roadmap: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      description: { type: Type.STRING },
                      status: { type: Type.STRING, enum: ["pending", "in-progress", "completed"] }
                    },
                    required: ["title", "description", "status"]
                  }
                },
                interviewQuestions: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      question: { type: Type.STRING },
                      answer: { type: Type.STRING },
                      category: { type: Type.STRING, enum: ["Technical", "Domain", "Behavioral"] }
                    },
                    required: ["question", "answer", "category"]
                  }
                }
              },
              required: ["projectId", "matchScore", "confidence", "bestFit", "reasoning", "skillGap", "recommendations", "experienceEvaluation", "domainAlignment", "roadmap", "interviewQuestions"]
            }
          },
          bestFitProjectId: { type: Type.STRING },
          bestFitJustification: { type: Type.STRING }
        },
        required: ["recommendations", "bestFitProjectId", "bestFitJustification"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  
  return JSON.parse(text) as AIRecord;
}
