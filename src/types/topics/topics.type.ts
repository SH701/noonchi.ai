export type CategoryType =
  | "Favorites"
  | "Career"
  | "Family"
  | "Belonging"
  | "K-POP";

export interface Topic {
  id: number | string;
  label: CategoryType;
}

export interface TopicProps {
  topics: Topic[];
  active: CategoryType;
  onSelect: (key: CategoryType) => void;
}

export interface TopicRes {
  topicId: 0;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  isFavorite: boolean;
}
export interface TopicScenario {
  scenarioId: number;
  myRole: string;
  aiRole: string;
  detail: string;
}
