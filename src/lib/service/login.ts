import { login } from "../api/auth/login";

import type { Profile } from "@/types/user";

export type PerformLoginResult = {
  accessToken: string;
  refreshToken: string;
  user: Profile["user"];
};

export async function performLogin(email: string, password: string) {
  const res = await login(email, password);

  return {
    accessToken: res.accessToken,
    refreshToken: res.refreshToken,
    me: res.user,
  };
}
