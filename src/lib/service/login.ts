import { login } from "../api/auth/login";

import { User } from "@/types/user.type";

export type PerformLoginResult = {
  accessToken: string;
  refreshToken: string;
  user: User;
};

export async function performLogin(email: string, password: string) {
  const res = await login(email, password);

  return {
    accessToken: res.accessToken,
    refreshToken: res.refreshToken,
    user: res.user,
  };
}
