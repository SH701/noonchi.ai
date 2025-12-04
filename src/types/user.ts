export type Level = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
export type Interest =
  | "💬 Daily"
  | "💼 Business"
  | "✈️ Travel"
  | "🎬 K-Drama"
  | "🎵 K-Pop"
  | "🙇‍♂️ Etiquette"
  | "🔥 Internet Slang"
  | "🥘 Food"
  | "🍜 Ordering"
  | "💄 Beauty"
  | "👁️‍🗨️ Gathering";

export type Role = "ROLE_GUEST" | "ROLE_USER";

export type Profile = {
  id: number;
  email: string;
  nickname: string;
  gender: string;
  birthDate: string;
  role: string;
  provider: string;
  koreanLevel: string;
  sentenceCount: number;
  profileImageUrl: string;
  interests: string[];
  creditPoint: number;
};
export interface User {
  id: string;
  email: string;
  password: string;
  koreanLevel: Level;
  profileImageUrl: string;
  interests: Interest[];
  role: Role;
}
