export interface User {
  id: number;
  name: string;
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

export interface MeRes{
  user: User;
}
export interface UpdateProfileReq {
  nickname?: string;
  birthDate?: string;
  koreanLevel?: string;
  profileImageUrl?: string;
  interests?: string[];
}
