
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
  chapter?: string;
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
  fastIncorrect: number;
  fastIncorrectAvgTime: string;
  slowIncorrect: number;
  slowIncorrectAvgTime: string;
  unattemptedTimeWasted: string;
  insight: string;
}

export interface RankInfo {
  rank: number;
  total: number;
}

export interface SubjectRanks {
  air: RankInfo;
  state: RankInfo;
  section: RankInfo;
  batch: RankInfo;
  program: RankInfo;
  course: RankInfo;
}

export interface SubjectData {
  name: string;
  status: SubjectStatus;
  score: number;
  topperScore: number;
  averageScore: number;
  percentile: number;
  totalMarks: number;
  accuracy: number;
  ranks: SubjectRanks; // New structured rank data
  timeSpent: string;
  timeBreakdown: {
      correct: string;
      incorrect: string;
      unattempted: string;
  };
  summaryInsight: string;
  chapters: ChapterBuckets;
  questionBehavior?: QuestionBehavior;
  questions: QuestionDetail[];
}

export interface DifficultyLevel {
  level: 'Easy' | 'Medium' | 'Hard';
  total: number;
  correct: number;
  accuracy: number;
}

export interface TestResultData {
  isOffline?: boolean;
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
    average: number;
    user: number;
  };
  finalSummary: string[];
}
