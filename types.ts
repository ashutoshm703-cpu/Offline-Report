
export enum Status {
  Correct = 'Correct',
  Incorrect = 'Incorrect',
  Unattempted = 'Unattempted'
}

export enum SubjectStatus {
  Strength = 'Strength',
  NeedsAttention = 'Needs Attention',
  Neutral = 'Neutral'
}

export interface QuestionDetail {
  id: number;
  result: Status;
  marks: number;
  timeSpent: string;
  avgPeerTime: string;
  chapter?: string; // Added chapter field
}

export interface ChapterStat {
  name: string;
  total: number;
  correct: number;
  incorrect: number;
  unattempted: number;
}

export interface ChapterBuckets {
  strong: ChapterStat[];
  good: ChapterStat[];
  improve: ChapterStat[];
}

export interface QuestionBehavior {
  fastIncorrect: number; // Count
  fastIncorrectAvgTime: string; // New
  slowIncorrect: number; // Count
  slowIncorrectAvgTime: string; // New
  unattemptedTimeWasted: string; // New: Replaces count with time string
  insight: string;
}

export interface SubjectData {
  name: string;
  status: SubjectStatus;
  score: number;
  topperScore: number;
  averageScore: number; // New
  subjectAir: number; // New
  percentile: number; // New
  totalMarks: number;
  accuracy: number; // Percentage
  batchRank: number;
  totalBatchStudents: number;
  timeSpent: string;
  timeBreakdown: {
      correct: string;
      incorrect: string;
      unattempted: string;
  };
  summaryInsight: string;
  chapters: ChapterBuckets;
  questionBehavior?: QuestionBehavior; // Optional, usually for weak subjects
  questions: QuestionDetail[];
}

export interface DifficultyLevel {
  level: 'Easy' | 'Medium' | 'Hard';
  total: number;
  correct: number;
  accuracy: number;
}

export interface TestResultData {
  isOffline?: boolean; // Added for Offline Test Support
  meta: {
    testName: string;
    date: string;
  };
  snapshot: {
    score: number;
    totalScore: number;
    rank: number;
    totalStudents: number;
    percentile: number;
    accuracy: number;
    insight: string;
  };
  competition: {
    air: number;
    stateRank: number;
    cityRank: number;
    batchRank: number;
    insight: string;
  };
  difficulty: {
    breakdown: DifficultyLevel[];
    insight: string;
  };
  usage: {
    total: number;
    correct: number;
    incorrect: number;
    unattempted: number;
    insight: string;
  };
  time: {
    correctTimePercent: number; 
    incorrectTimePercent: number;
    unattemptedTimePercent: number;
    totalUsed: string;
    allowed: string;
    avgTimePerQ: string;
    insight: string;
    breakdown: {
        correct: string;
        incorrect: string;
        unattempted: string;
    };
    avgBreakdown: {
        correct: string;
        incorrect: string;
    };
  };
  subjects: SubjectData[];
  benchmarking: {
    lowest: number;
    highest: number;
    average: number; // New
    user: number;
  };
  finalSummary: string[];
}
