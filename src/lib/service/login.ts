import { apiMutations } from "../../api/mutations";
import { User } from "@/types/user/user.type";

export type PerformLoginResult = {
  accessToken: string;
  refreshToken: string;
  user: User;
};

export async function performLogin(email: string, password: string) {
  const res = await apiMutations.auth.login(email, password);

  return {
    accessToken: res.accessToken,
    refreshToken: res.refreshToken,
    user: res.user,
  };
}
