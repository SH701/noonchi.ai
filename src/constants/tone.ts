export const TONE_OPTIONS = [
  { value: "casual", label: "Casual", description: "(Friends, Siblings)" },
  { value: "friendly", label: "Friendly", description: "(Close colleagues)" },
  {
    value: "professional",
    label: "Professional",
    description: "(Clients, Professors)",
  },
  {
    value: "formal",
    label: "Formal",
    description: "(High-level executives, Public)",
  },
];
export type InterviewStyle = (typeof TONE_OPTIONS)[number]["value"];