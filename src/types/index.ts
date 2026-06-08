export interface UserProfile {
  name: string;
  age: string;
  weeksPregnant: number;
  dueDate: string;
  healthConditions: string;
  dueDateSet?: boolean;
}

export interface Reminder {
  id: string;
  title: string;
  time: string;
  completed: boolean;
  iconType?: 'doctor' | 'vitamins' | 'general';
}

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: number;
}

export type BabySizeArtKey = 'banana' | 'watermelon' | 'mango' | 'coconut' | 'yam' | 'pregnant';

export interface PregnancyMilestone {
  week: number;
  fruit_comparison: string;
  length_inch: number;
  length_cm: number;
  weight_oz: number;
  weight_grams: number;
}

export interface WeekInfo {
  week: number;
  trimester: 'first' | 'second' | 'third';
  babySize: string;
  tips: string[];
  development: string;
}
