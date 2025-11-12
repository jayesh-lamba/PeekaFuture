// All the custom type definitions for the application.

export interface User {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

export enum DashboardTab {
  StreamGuidance = 'stream-guidance',
  AcademicNavigator = 'academic-navigator',
  Competition = 'competition',
  CollegeInsights = 'college-insights',
  Entrepreneurship = 'entrepreneurship',
  FutureTrends = 'future-trends',
  Artists = 'artists',
}

export interface SurveyAnswers {
  [key: string]: string;
}

export type RecommendedStream = 'Science' | 'Commerce' | 'Arts / Humanities' | 'Unknown';

export interface GuidanceResult {
  text: string;
  recommendedStream: RecommendedStream;
  recommendedCareer: string;
}

export interface CareerStream {
  id: string;
  name: string;
  avg_salary: number;
}

export interface College {
  id: string;
  name: string;
  location: string;
  city: string;
  ownership: 'Government' | 'Private';
  nirfRanking: number;
  ranking: number;
  fees: number;
  avg_package: number;
  courses: string[];
  stream: RecommendedStream | 'Science' | 'Commerce' | 'Arts / Humanities';
  image_url: string;
  avgRating: number;
  ratingCount: number;
}

export interface StreamData {
  id: string;
  title: string;
  description: string;
  subjects: string[];
  careers: string[];
}

export interface Competition {
  name: string;
  category: string;
  description: string;
  eligibility: string;
  link: string;
}

export interface RoadmapSection {
  title: string;
  description: string;
  items: string[];
}

export interface RoadmapResource {
  title: string;
  type: string;
  link: string;
}

export interface Roadmap {
  grade11: {
    coreSubjects: RoadmapSection;
    skillDevelopment: RoadmapSection;
  };
  grade12: {
    coreSubjects: RoadmapSection;
    examFocus: RoadmapSection;
  };
  extracurriculars: RoadmapSection;
  resources: {
    title: string;
    description: string;
    items: RoadmapResource[];
  };
}

export interface ArtistRoadmap {
    introduction: string;
    foundation: RoadmapSection;
    specialization: RoadmapSection;
    portfolio: RoadmapSection;
    networking: RoadmapSection;
    resources: {
        title: string;
        description: string;
        items: RoadmapResource[];
    };
}


export interface DayInLifeSimulation {
    careerTitle: string;
    storyTitle: string;
    introduction: string;
    segments: {
        timeOfDay: string;
        title: string;
        description: string;
    }[];
    conclusion: string;
}

export interface CollegeSearchFilters {
    stream?: RecommendedStream;
    cities?: string[];
    ownership?: 'Government' | 'Private';
    maxFees?: number;
    minAvgPackage?: number;
    minRating?: number;
    courses?: string[];
    collegeNamesToFilter?: string[];
}

export interface EntrepreneurshipOpportunity {
    sector: string;
    profitMargin: number;
    examples: string[];
    keySkills: string[];
    marketTrend: 'Growing' | 'Stable' | 'Emerging';
}

export interface EntrepreneurshipData {
    id: string;
    degree: string;
    description: string;
    opportunities: EntrepreneurshipOpportunity[];
}

export interface SurveyQuestion {
    id: string;
    text: string;
    options: string[];
    explanation: string;
}

export interface StartupIdea {
    businessName: string;
    pitch: string;
    targetAudience: string;
    keyFeatures: string[];
    monetizationStrategy: string;
    investmentLevel: 'Low' | 'Medium' | 'High';
}

export interface BusinessPlan {
    businessName: string;
    executiveSummary: string;
    problemStatement: string;
    solution: string;
    targetMarket: string;
    marketingStrategy: string[];
    swotAnalysis: {
        strengths: string[];
        weaknesses: string[];
        opportunities: string[];
        threats: string[];
    };
    financialProjections: {
        revenueStreams: string[];
        keyCostDrivers: string[];
        firstYearProfitOutlook: string;
    };
}

export interface GroundingSource {
    web: {
        uri: string;
        title: string;
    }
}

export interface TrendAnalysis {
    content: string;
    sources: GroundingSource[];
}

export interface ArtGrant {
    name: string;
    type: 'Scholarship' | 'Grant' | 'Residency';
    description: string;
    eligibility: string;
    award: string;
    link: string;
}

export interface SkillGuideResource {
  title: string;
  type: 'Course' | 'Tutorial' | 'Book' | 'Documentation';
  link: string;
  description: string;
}

export interface SkillGuide {
  skillName: string;
  introduction: string;
  keyConcepts: string[];
  freeResources: SkillGuideResource[];
  nextSteps: string[];
}