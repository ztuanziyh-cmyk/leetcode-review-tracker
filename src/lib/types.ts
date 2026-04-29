export type Difficulty = "Easy" | "Medium" | "Hard";

export type ProblemStatus = "solved" | "attempted" | "review";

export type SubmissionStatus =
  | "Accepted"
  | "Wrong Answer"
  | "Time Limit Exceeded"
  | "Runtime Error"
  | "Other";

export type Confidence = 1 | 2 | 3 | 4 | 5;

export type MistakeType =
  | "None"
  | "Logic"
  | "Edge Case"
  | "Syntax"
  | "Time Complexity"
  | "Space Complexity"
  | "Data Structure Choice"
  | "Pattern Recognition"
  | "Careless Mistake"
  | "Other";

export type Pattern =
  | "Two Pointers"
  | "Sliding Window"
  | "Binary Search"
  | "DFS"
  | "BFS"
  | "Dynamic Programming"
  | "Greedy"
  | "Backtracking"
  | "Heap"
  | "Graph"
  | "Tree"
  | "Prefix Sum"
  | "Union Find"
  | "Other";

export type UserProfile = {
  username: string;
  displayName?: string;
  ranking?: number;
  totalSolved?: number;
  easySolved?: number;
  mediumSolved?: number;
  hardSolved?: number;
  streakDays?: number;
  lastSyncedAt?: string;
};

export type Problem = {
  id: string;
  title: string;
  slug: string;
  difficulty: Difficulty;
  topics: string[];
  status: ProblemStatus;
  source: "leetcode";
  firstSolvedAt?: string;
  lastSolvedAt?: string;
  acceptanceRate?: number;
  url?: string;
};

export type Submission = {
  id: string;
  problemSlug: string;
  submittedAt: string;
  status: SubmissionStatus;
  language?: string;
  runtimeMs?: number;
  memoryMb?: number;
};

export type ReviewNote = {
  id: string;
  problemSlug: string;
  summary: string;
  confidence: Confidence;
  mistakeType: MistakeType;
  pattern: Pattern;
  keyTakeaway: string;
  nextReviewAt?: string;
  lastReviewedAt?: string;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
};

export type ReviewSession = {
  id: string;
  problemSlug: string;
  reviewedAt: string;
  confidenceAfterReview: Confidence;
  notes?: string;
};

export type DailyReviewItem = {
  id: string;
  date: string;
  problemSlug: string;
  priorityScore: number;
  reasons: string[];
  completed: boolean;
  completedAt?: string;
};

export type ProblemWithReview = Problem & {
  reviewNote?: ReviewNote;
  latestSubmission?: Submission;
};
