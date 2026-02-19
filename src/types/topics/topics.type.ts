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

export interface TopicRes {
  topicId: 0;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  isFavorite: boolean;
}
export interface PagedTopicRes {
  content: TopicRes[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface TopicScenario {
  scenarioId: number;
  myRole: string;
  aiRole: string;
  detail: string;
}
