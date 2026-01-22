export interface User {
  id: number;
  email: string;
  password: string;
  nickname: string;
  birthDate: string;
  role: string;
  provider: string;
  koreanLevel: string;
  sentenceCount: number;
  profileImageUrl?: string;
  creditPoint: number;
  interests: string[];
}
