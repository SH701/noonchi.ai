export const TOPIC_ENUMS = {
  Popular: {
    1: "after_work_escape_mode",
  },
  Career: {
    1: "after_work_escape_mode",
  },
  Family: {
    1: "could_you_soften_your_tone",
  },
  Belonging: {
    1: "midnight_mom_energy",
  },
  "K-POP": {
    1: "bias_talk_irl",
  },
} as const;

export type TopicEnumValue = (typeof TOPIC_ENUMS)[keyof typeof TOPIC_ENUMS][1];

export interface RoleplayApiRequest {
  conversationTopic: TopicEnumValue;
  details: string;
}
