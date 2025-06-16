export interface Session {
  level: string;
  date: string;
  completedExercises: number;
  timestamp: number;
}
export interface ProgressStats {
  currentBatch: string;
  completed: number;
  correct: number;
  accuracy: number;
  history: {
    exerciseId: string;
    isCorrect: boolean;
    timestamp: string;
  }[];
}
export interface Attempt {
  level: string;
  exerciseId: number;
  isCorrect: boolean;
  attemptNumber: number;
  timestamp: number;
}
export interface Message {
  type: 'bot' | 'user';
  text: string;
  isCorrect?: boolean;
}

export interface Exercise {
  question: string;
  type: string;
  expectedAnswer: string;
  hints: string[];
}

export interface ExerciseLevel {
  range: string;
  description: string;
  exercises: Exercise[];
}

export interface RelaxGame {
  word: string;
  scrambled: string;
  hint: string;
  hint2?: boolean;
}

export interface CheatDetection {
  tabSwitches: number;
  startTime: number;
  responseTime: number;
  suspicious: boolean;
}