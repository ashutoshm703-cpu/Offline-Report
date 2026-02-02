
import { TestResultData, Status, SubjectStatus } from './types';

export const TEST_DATA: TestResultData = {
  isOffline: true, // Enabled Offline Mode
  meta: {
    testName: "Full Mock Test 12",
    date: "Oct 24, 2024"
  },
  snapshot: {
    score: 520,
    totalScore: 720,
    rank: 56,
    totalStudents: 800,
    percentile: 93,
    accuracy: 78,
    insight: "Accuracy is the primary factor limiting rank improvement."
  },
  competition: {
    air: 1240,
    stateRank: 85,
    cityRank: 12,
    batchRank: 5,
    insight: "You perform strongly within your batch and city; national rank is impacted by accuracy."
  },
  difficulty: {
    breakdown: [
      { level: 'Easy', total: 60, correct: 50, accuracy: 83 },
      { level: 'Medium', total: 80, correct: 55, accuracy: 68 },
      { level: 'Hard', total: 40, correct: 25, accuracy: 62 }
    ],
    insight: "You lost 40 marks on Easy/Medium questions. Prioritize accuracy on easier questions over attempting hard ones."
  },
  usage: {
    total: 180,
    correct: 130,
    incorrect: 35,
    unattempted: 15,
    insight: "High attempt rate with lower-than-peer accuracy."
  },
  time: {
    correctTimePercent: 55,
    incorrectTimePercent: 38,
    unattemptedTimePercent: 7,
    totalUsed: "2h 45m",
    allowed: "3h 00m",
    avgTimePerQ: "55s",
    insight: "You spent 1h+ on incorrect answers (avg 1m 50s/q). Learning to skip faster will save ~20 mins.",
    breakdown: {
        correct: "1h 31m",
        incorrect: "1h 04m",
        unattempted: "10m"
    },
    avgBreakdown: {
        correct: "42s",
        incorrect: "1m 50s"
    }
  },
  subjects: [
    {
      name: "Biology",
      status: SubjectStatus.NeedsAttention,
      score: 280,
      topperScore: 340,
      averageScore: 210,
      percentile: 78,
      totalMarks: 360,
      accuracy: 72,
      ranks: {
        air: { rank: 840, total: 15000 },
        state: { rank: 120, total: 2000 },
        course: { rank: 450, total: 5000 },
        program: { rank: 210, total: 1200 },
        section: { rank: 12, total: 60 },
        batch: { rank: 42, total: 120 }
      },
      timeSpent: "55m",
      timeBreakdown: {
        correct: "35m",
        incorrect: "18m",
        unattempted: "2m"
      },
      summaryInsight: "Errors persist despite time investment.",
      chapters: {
        strong: [
            { name: "Human Physiology", total: 15, correct: 14, incorrect: 1, unattempted: 0 },
            { name: "Plant Kingdom", total: 10, correct: 9, incorrect: 1, unattempted: 0 }
        ],
        good: [
            { name: "Genetics", total: 12, correct: 8, incorrect: 3, unattempted: 1 },
            { name: "Cell Biology", total: 8, correct: 6, incorrect: 2, unattempted: 0 }
        ],
        improve: [
            { name: "Ecology", total: 10, correct: 4, incorrect: 6, unattempted: 0 },
            { name: "Biotech", total: 8, correct: 3, incorrect: 4, unattempted: 1 },
            { name: "Reproduction", total: 12, correct: 5, incorrect: 5, unattempted: 2 },
            { name: "Animal Kingdom", total: 8, correct: 3, incorrect: 4, unattempted: 1 },
            { name: "Morphology", total: 9, correct: 4, incorrect: 5, unattempted: 0 },
            { name: "Cell Cycle", total: 7, correct: 2, incorrect: 4, unattempted: 1 }
        ]
      },
      questionBehavior: {
        fastIncorrect: 8,
        fastIncorrectAvgTime: "12s",
        slowIncorrect: 4,
        slowIncorrectAvgTime: "2m 10s",
        unattemptedTimeWasted: "2m",
        insight: "8 errors were made in under 15s each (rushed). Conversely, 2m was spent on questions left unattempted."
      },
      questions: [
        { id: 1, result: Status.Correct, marks: 4, timeSpent: "30s", avgPeerTime: "45s", chapter: "Human Physiology", type: "Single Correct MCQ" },
        { id: 2, result: Status.Incorrect, marks: -1, timeSpent: "12s", avgPeerTime: "40s", chapter: "Ecology", type: "Single Correct MCQ" },
        { id: 3, result: Status.Correct, marks: 4, timeSpent: "55s", avgPeerTime: "50s", chapter: "Genetics", type: "Numerical Value" },
        { id: 4, result: Status.Incorrect, marks: -1, timeSpent: "15s", avgPeerTime: "60s", chapter: "Biotech", type: "Single Correct MCQ" },
        { id: 5, result: Status.Unattempted, marks: 0, timeSpent: "5s", avgPeerTime: "70s", chapter: "Reproduction", type: "Numerical Value" },
      ]
    },
    {
      name: "Physics",
      status: SubjectStatus.NeedsAttention,
      score: 110,
      topperScore: 165,
      averageScore: 85,
      percentile: 65,
      totalMarks: 180,
      accuracy: 65,
      ranks: {
        air: { rank: 450, total: 15000 },
        state: { rank: 80, total: 2000 },
        course: { rank: 200, total: 5000 },
        program: { rank: 95, total: 1200 },
        section: { rank: 8, total: 60 },
        batch: { rank: 30, total: 120 }
      },
      timeSpent: "1h 10m",
      timeBreakdown: {
        correct: "25m",
        incorrect: "40m",
        unattempted: "5m"
      },
      summaryInsight: "Calculation errors in high-weightage topics.",
      chapters: {
        strong: [
            { name: "Kinematics", total: 8, correct: 7, incorrect: 1, unattempted: 0 }
        ],
        good: [
            { name: "Optics", total: 12, correct: 8, incorrect: 2, unattempted: 2 },
            { name: "Modern Physics", total: 10, correct: 6, incorrect: 3, unattempted: 1 }
        ],
        improve: [
            { name: "Rotation", total: 8, correct: 2, incorrect: 4, unattempted: 2 },
            { name: "Thermodynamics", total: 10, correct: 3, incorrect: 5, unattempted: 2 },
            { name: "Electrostatics", total: 9, correct: 3, incorrect: 4, unattempted: 2 }
        ]
      },
      questionBehavior: {
        fastIncorrect: 5,
        fastIncorrectAvgTime: "45s",
        slowIncorrect: 10,
        slowIncorrectAvgTime: "3m 30s",
        unattemptedTimeWasted: "5m",
        insight: "Critical Issue: 40 mins spent on incorrect answers. 10 questions took >3m each resulting in negative marks."
      },
      questions: [
        { id: 46, result: Status.Correct, marks: 4, timeSpent: "2m", avgPeerTime: "1.5m", chapter: "Kinematics", type: "Numerical Value" },
        { id: 47, result: Status.Incorrect, marks: -1, timeSpent: "4m", avgPeerTime: "2m", chapter: "Rotation", type: "Single Correct MCQ" },
        { id: 48, result: Status.Unattempted, marks: 0, timeSpent: "0s", avgPeerTime: "1m", chapter: "Thermodynamics", type: "Numerical Value" },
      ]
    },
    {
      name: "Chemistry",
      status: SubjectStatus.Strength,
      score: 130,
      topperScore: 150,
      averageScore: 90,
      percentile: 92,
      totalMarks: 180,
      accuracy: 92,
      ranks: {
        air: { rank: 120, total: 15000 },
        state: { rank: 15, total: 2000 },
        course: { rank: 40, total: 5000 },
        program: { rank: 18, total: 1200 },
        section: { rank: 1, total: 60 },
        batch: { rank: 3, total: 120 }
      },
      timeSpent: "40m",
      timeBreakdown: {
        correct: "31m",
        incorrect: "6m",
        unattempted: "3m"
      },
      summaryInsight: "Consistent performance with high speed.",
      chapters: {
        strong: [
            { name: "Organic Chemistry", total: 15, correct: 14, incorrect: 1, unattempted: 0 },
            { name: "Coordination Compounds", total: 10, correct: 9, incorrect: 1, unattempted: 0 }
        ],
        good: [
            { name: "Solutions", total: 8, correct: 6, incorrect: 1, unattempted: 1 },
            { name: "Electrochemistry", total: 8, correct: 6, incorrect: 2, unattempted: 0 }
        ],
        improve: [
            { name: "P-Block Elements", total: 10, correct: 5, incorrect: 4, unattempted: 1 }
        ]
      },
      questionBehavior: {
        fastIncorrect: 2,
        fastIncorrectAvgTime: "20s",
        slowIncorrect: 1,
        slowIncorrectAvgTime: "2m",
        unattemptedTimeWasted: "3m",
        insight: "Very efficient. The 3m spent on unattempted questions could have been used to review the P-Block error."
      },
      questions: [
        { id: 91, result: Status.Correct, marks: 4, timeSpent: "45s", avgPeerTime: "1m", chapter: "Organic Chemistry", type: "Single Correct MCQ" },
        { id: 92, result: Status.Correct, marks: 4, timeSpent: "30s", avgPeerTime: "45s", chapter: "Solutions", type: "Numerical Value" },
      ]
    }
  ],
  benchmarking: {
    lowest: 120,
    highest: 695,
    average: 380,
    user: 520
  },
  finalSummary: [
    "Accuracy is the main lever for next growth phase.",
    "Biology offers the highest improvement opportunity based on weightage.",
    "Chemistry is a stable strength; maintain current revision rhythm."
  ]
};