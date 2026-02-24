import { User } from "../user";

export interface AuthRes {
  accessToken: string;
  refreshToken: string;
  user: User;
  level: number;
}
export interface SignupReq {
  email: string;
  password: string;
  nickname: string;
  gender: "NONE";
  birthDate: string;
  profileImageUrl?: string;
}

export interface LoginReq {
  email: string;
  password: string;
}
