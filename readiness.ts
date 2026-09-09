/**
 * Readiness score, matching the weighting from the planning conversation:
 * Module Completion 40% + Quiz Scores 30% + Mock Exams 20% + Practical
 * Preparation 10%. Each input is a 0-100 value; the result is 0-100.
 */
export interface ReadinessInputs {
  moduleCompletionPercent: number;
  averageQuizScore: number;
  averageMockExamScore: number;
  practicalPreparationPercent: number;
}

export function calculateReadinessScore(inputs: ReadinessInputs): number {
  const weighted =
    inputs.moduleCompletionPercent * 0.4 +
    inputs.averageQuizScore * 0.3 +
    inputs.averageMockExamScore * 0.2 +
    inputs.practicalPreparationPercent * 0.1;

  return Math.max(0, Math.min(100, Math.round(weighted)));
}

export type ReadinessLevel = "green" | "amber" | "red";

export function readinessLevel(score: number): ReadinessLevel {
  if (score >= 85) return "green";
  if (score >= 70) return "amber";
  return "red";
}

export const READINESS_COLORS: Record<ReadinessLevel, string> = {
  green: "#2BB673",
  amber: "#F2A93B",
  red: "#D9534F",
};
