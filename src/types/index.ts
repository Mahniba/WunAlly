export interface UserProfile {
  name: string;
  age: string;
  weeksPregnant: number;
  dueDate: string;
  healthConditions: string;
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

export interface WeekInfo {
  week: number;
  trimester: 'first' | 'second' | 'third';
  babySize: string;
  tips: string[];
  development: string;
}
