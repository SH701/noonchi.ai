import { User } from "../user/user.type";

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
  level: number;
}
