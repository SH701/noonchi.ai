export const CareerTopics = [
  {
    id: 1,
    icon: "👨‍💼",
    title: "Job Interview",
    description: "Practice answering real Korean interview questions.",
  },
  {
    id: 2,
    icon: "📊",
    title: "Performance Review",
    description: "Learn how to talk about strengths, weaknesses, and goals.",
  },
  {
    id: 3,
    icon: "💼",
    title: "Team Meeting Interaction",
    description: "Practice sharing opinions professionally in team meetings.",
  },
  {
    id: 4,
    icon: "🆘",
    title: "Asking for Help at Work",
    description: "Ask for clarification politely and naturally.",
  },
  {
    id: 5,
    icon: "📈",
    title: "Talking to Your Manager",
    description: "Communicate updates and issues with proper tone.",
  },
];

export const GreetingTopics = [
  {
    id: 1,
    icon: "👋",
    title: "Basic Greetings",
    description: "Hello, nice to meet you, good morning — practice politely.",
  },
  {
    id: 2,
    icon: "😊",
    title: "Polite Greetings",
    description: "Learn how to greet respectfully depending on the situation.",
  },
  {
    id: 3,
    icon: "🙇",
    title: "Apologizing Politely",
    description: "Practice formal apology phrases used in Korean culture.",
  },
  {
    id: 4,
    icon: "💬",
    title: "Small Talk Starters",
    description: "Learn natural ways to start conversations with strangers.",
  },
  {
    id: 5,
    icon: "🎉",
    title: "Congratulatory Expressions",
    description: "Say congratulations politely in various contexts.",
  },
];

export const KPopTopics = [
  {
    id: 1,
    icon: "🎤",
    title: "Talking About Your Bias",
    description: "Learn how to express excitement naturally and respectfully.",
  },
  {
    id: 2,
    icon: "🎶",
    title: "Song Recommendations",
    description: "Practice sharing songs you like and describing why.",
  },
  {
    id: 3,
    icon: "🕺",
    title: "Dance Challenge Talk",
    description: "Talk about dance practices, trends, and TikTok challenges.",
  },
  {
    id: 4,
    icon: "💜",
    title: "Fan Community Slang",
    description: "Understand and use light Korean fan expressions.",
  },
  {
    id: 5,
    icon: "📸",
    title: "Concert Experiences",
    description: "Explain your concert memories with natural expressions.",
  },
];

export const topicsByCategory = {
  Career: CareerTopics,
  Greeting: GreetingTopics,
  KPOP: KPopTopics,
} as const;
