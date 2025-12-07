// Types para o Web App de Bem-Estar e Alta Performance

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  onboardingCompleted: boolean;
  createdAt: Date;
  level: number;
  xp: number;
  streak: number;
}

export interface OnboardingData {
  goals: string[];
  challenges: string[];
  sleepHours: number;
  exerciseFrequency: string;
  stressLevel: number;
  focusAreas: string[];
  preferredTime: string;
}

export interface MoodEntry {
  id: string;
  userId: string;
  date: Date;
  mood: 'excellent' | 'good' | 'neutral' | 'bad' | 'terrible';
  energy: number; // 1-10
  stress: number; // 1-10
  notes?: string;
  emotions: string[];
  aiAnalysis?: string;
  aiRecommendations?: string[];
}

export interface Habit {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: 'health' | 'mindfulness' | 'productivity' | 'social' | 'learning';
  frequency: 'daily' | 'weekly' | 'custom';
  targetDays: number[];
  streak: number;
  completedDates: Date[];
  aiAdaptations?: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  xpReward: number;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  dueDate?: Date;
  completed: boolean;
  aiGenerated: boolean;
  xpReward: number;
}

export interface Trail {
  id: string;
  title: string;
  description: string;
  category: 'anxiety' | 'focus' | 'sleep' | 'self-esteem' | 'self-care' | 'discipline';
  duration: string;
  lessons: TrailLesson[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  xpReward: number;
  icon: string;
}

export interface TrailLesson {
  id: string;
  title: string;
  content: string;
  type: 'video' | 'audio' | 'text' | 'exercise';
  duration: number;
  completed: boolean;
}

export interface BreathingExercise {
  id: string;
  name: string;
  description: string;
  pattern: {
    inhale: number;
    hold: number;
    exhale: number;
    holdAfter: number;
  };
  duration: number;
  benefits: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  mood?: string;
}

export interface WellnessPlan {
  id: string;
  userId: string;
  generatedAt: Date;
  goals: string[];
  dailyRoutine: {
    morning: string[];
    afternoon: string[];
    evening: string[];
  };
  habits: string[];
  trails: string[];
  aiInsights: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpRequired: number;
  unlocked: boolean;
  unlockedAt?: Date;
}

export interface DashboardStats {
  currentMood: string;
  energyLevel: number;
  weeklyProgress: number;
  habitsCompleted: number;
  totalHabits: number;
  currentStreak: number;
  level: number;
  xp: number;
  nextLevelXp: number;
}
