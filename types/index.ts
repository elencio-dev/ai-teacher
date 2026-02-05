export interface UserProfile {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  goal: 'conversation' | 'business' | 'travel' | 'academic';
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Exercise {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  userAnswer?: number;
}

export interface VocabularyItem {
  word: string;
  pronunciation: string;
  translation: string;
  example: string;
}

export interface Stats {
  conversations: number;
  exercises: number;
  correctAnswers: number;
  totalAnswers: number;
}
