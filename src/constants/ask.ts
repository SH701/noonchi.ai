export type Step = "askTarget" | "closeness" | "situation" | "chat";

export const STEPS: Step[] = ["askTarget", "closeness", "situation", "chat"];

export const CLOSENESS_OPTIONS = [
  { label: "Casual", value: "casual" },
  { label: "Friendly", value: "friendly" },
  { label: "Professional", value: "professional" },
  { label: "Formal", value: "formal" },
] as const;

export const STEP_QUESTIONS: Record<string, string> = {
  askTarget: "Who is this for?",
  closeness: "How close are you with them?",
  situation: "What do you want to say?",
};