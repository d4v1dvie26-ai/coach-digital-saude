export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          level: number
          xp: number
          current_streak: number
          longest_streak: number
          total_habits_completed: number
          onboarding_completed: boolean
          wellness_goals: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          level?: number
          xp?: number
          current_streak?: number
          longest_streak?: number
          total_habits_completed?: number
          onboarding_completed?: boolean
          wellness_goals?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          level?: number
          xp?: number
          current_streak?: number
          longest_streak?: number
          total_habits_completed?: number
          onboarding_completed?: boolean
          wellness_goals?: Json
          created_at?: string
          updated_at?: string
        }
      }
      mood_entries: {
        Row: {
          id: string
          user_id: string
          mood: string
          energy_level: number
          stress_level: number
          notes: string | null
          ai_analysis: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          mood: string
          energy_level: number
          stress_level: number
          notes?: string | null
          ai_analysis?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          mood?: string
          energy_level?: number
          stress_level?: number
          notes?: string | null
          ai_analysis?: Json | null
          created_at?: string
        }
      }
      habits: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          category: string
          frequency: string
          target_count: number
          icon: string | null
          color: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          category: string
          frequency?: string
          target_count?: number
          icon?: string | null
          color?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          category?: string
          frequency?: string
          target_count?: number
          icon?: string | null
          color?: string | null
          is_active?: boolean
          created_at?: string
        }
      }
      habit_completions: {
        Row: {
          id: string
          habit_id: string
          user_id: string
          completed_at: string
          notes: string | null
        }
        Insert: {
          id?: string
          habit_id: string
          user_id: string
          completed_at?: string
          notes?: string | null
        }
        Update: {
          id?: string
          habit_id?: string
          user_id?: string
          completed_at?: string
          notes?: string | null
        }
      }
      daily_tasks: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          xp_reward: number
          completed: boolean
          completed_at: string | null
          due_date: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          xp_reward?: number
          completed?: boolean
          completed_at?: string | null
          due_date?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          xp_reward?: number
          completed?: boolean
          completed_at?: string | null
          due_date?: string
          created_at?: string
        }
      }
      wellness_trails: {
        Row: {
          id: string
          title: string
          description: string | null
          category: string
          difficulty: string
          duration_days: number
          icon: string | null
          color: string | null
          lessons: Json
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          category: string
          difficulty?: string
          duration_days?: number
          icon?: string | null
          color?: string | null
          lessons?: Json
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          category?: string
          difficulty?: string
          duration_days?: number
          icon?: string | null
          color?: string | null
          lessons?: Json
          created_at?: string
        }
      }
      trail_progress: {
        Row: {
          id: string
          user_id: string
          trail_id: string
          current_lesson: number
          completed: boolean
          started_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          trail_id: string
          current_lesson?: number
          completed?: boolean
          started_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          trail_id?: string
          current_lesson?: number
          completed?: boolean
          started_at?: string
          completed_at?: string | null
        }
      }
      achievements: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          icon: string | null
          xp_earned: number
          earned_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          icon?: string | null
          xp_earned?: number
          earned_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          icon?: string | null
          xp_earned?: number
          earned_at?: string
        }
      }
      chat_messages: {
        Row: {
          id: string
          user_id: string
          role: string
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role: string
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          role?: string
          content?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
