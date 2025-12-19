import { User } from "@/types/user/user.type";
import { apiMutations } from "../../api/mutations";
import { apiClient } from "../../api/client";

export type PerformSignResult = {
  accessToken: string;
  refreshToken: string;
  user: User;
};

export async function performSignup(payload: {
  email: string;
  password: string;
  nickname: string;
  gender: "MALE" | "FEMALE";
  birthDate: string;
}): Promise<PerformSignResult> {
  const res = await apiMutations.auth.signup(payload);

  const user = await apiClient.users.getMe();

  return {
    accessToken: res.accessToken,
    refreshToken: res.refreshToken,
    user: user,
  };
}
