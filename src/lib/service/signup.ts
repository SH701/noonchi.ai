import { Profile } from "@/types/user";
import { signup } from "../api/auth/signup";
import { getMe } from "../api/users/me";

export type PerformSignResult = {
  accessToken: string;
  refreshToken: string;
  user: Profile["user"];
};

export async function performSignup(payload: {
  email: string;
  password: string;
  nickname: string;
  gender: "MALE" | "FEMALE";
  birthDate: string;
}): Promise<PerformSignResult> {
  const res = await signup(payload);

  const me = await getMe();

  return {
    accessToken: res.accessToken,
    refreshToken: res.refreshToken,
    user: me,
  };
}
