export const CareerTopics = [
  {
    id: 1,

    title: "Job Interview",
    description: "Practice answering real Korean interview questions.",
  },
  {
    id: 2,

    title: "Performance Review",
    description: "Learn how to talk about strengths, weaknesses, and goals.",
  },
  {
    id: 3,

    title: "Team Meeting Interaction",
    description: "Practice sharing opinions professionally in team meetings.",
  },
  {
    id: 4,

    title: "Asking for Help at Work",
    description: "Ask for clarification politely and naturally.",
  },
  {
    id: 5,

    title: "Talking to Your Manager",
    description: "Communicate updates and issues with proper tone.",
  },
];

export const FamilyTopics = [
  {
    id: 1,
    title: "Soft Shields with In-laws",
    description: "Set gentle boundaries—polite but not a pushover.",
  },
  {
    id: 2,
    title: "The “Eat More~” Challenge",
    description: "Respond naturally to over-caring Korean moms.",
  },
  {
    id: 3,
    title: "Saying No to Sweet Elders",
    description: "Decline elder requests politely and guilt-free.",
  },
  {
    id: 4,
    title: "Heart-Talk Without Drama",
    description: "Share real feelings calmly without emotional explosion.",
  },
  {
    id: 5,
    title: "Talking About Your Partner",
    description: "Introduce your relationship to parents confidently.",
  },
];

export const LoveTopics = [
  {
    id: 1,
    title: "Could You Soften Your Tone…?",
    description: "Ask someone to speak gently—without sounding accusatory.",
  },
  {
    id: 2,
    title: "Why Did You Reply So Late?",
    description: "Explain late replies reassuringly, without defensiveness.",
  },
  {
    id: 3,
    title: "I Miss You… But No Pressure",
    description: "Express longing warmly—never clingy.",
  },
  {
    id: 4,
    title: "Clumsy Crush Signals",
    description: "Recognize awkward affection and respond kindly.",
  },
  {
    id: 5,
    title: "The “What Are We?” Talk",
    description: "Define the relationship honestly but gently.",
  },
];
export const BelongingTopics = [
  {
    id: 1,
    title: "Midnight Mom Energy",
    description: "Thank your friend’s mom warmly for late-night food.",
  },
  {
    id: 2,
    title: "Seaside Ajumma Vibes",
    description: "Handle extra kindness + subtle pressure politely.",
  },
  {
    id: 3,
    title: "Banter Mode Unlocked",
    description: "Shift from polite to playful without sounding rude.",
  },
  {
    id: 4,
    title: "First Round Tension",
    description: "Mix casual + respectful tone at group drinks.",
  },
  {
    id: 5,
    title: "Soft-Heart Moment",
    description: "Say 'that hurt' calmly—zero drama.",
  },
];
export const KPopTopics = [
  {
    id: 1,
    title: "Bias Talk IRL",
    description: "Talk about your bias naturally—excited but respectful.",
  },
  {
    id: 2,
    title: "Playlist Recommendation Mode",
    description: "Share songs naturally and explain why you like them.",
  },
  {
    id: 3,
    title: "Dance Challenge Talk",
    description: "Discuss dance practice, trends, and TikTok challenges.",
  },
  {
    id: 4,
    title: "Fan Community Slang 101",
    description: "Use light fan expressions without overdoing it.",
  },
  {
    id: 5,
    title: "Concert Memory Reload",
    description: "Describe concerts vividly with natural Korean expressions.",
  },
];

export const topicsByCategory = {
  Career: CareerTopics,
  Family: FamilyTopics,
  Romance: LoveTopics,
  Belonging: BelongingTopics,
  "K-POP": KPopTopics,
} as const;
