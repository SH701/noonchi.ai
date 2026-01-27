export type CategoryType =
  | "Popular"
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
export interface Topics {
  id: number;
  topic: string;
  img: string;
  title: string;
  description: string;
  aiRole: string;
  myRole: string;
}
