import { User } from "@/types/user.type";
import { signup } from "../api/auth/signup";
import { getUser } from "../api/users/me";

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
  const res = await signup(payload);

  const user = await getUser();

  return {
    accessToken: res.accessToken,
    refreshToken: res.refreshToken,
    user: user,
  };
}
