export type Feedback = {
  feedbackId: number;
  conversationId: number;
  politenessScore: number;
  naturalnessScore: number;
  pronunciationScore: number;
  summary: string;
  goodPoints: string;
  improvementPoints: string;
  improvementExamples: string;
  overallEvaluation: string;
};
