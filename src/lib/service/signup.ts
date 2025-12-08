import { signup } from "../api/auth/signup";
import { getMe } from "../api/users/me";

export async function performSignup(payload: {
  email: string;
  password: string;
  nickname: string;
  gender: "MALE" | "FEMALE";
  birthDate: string;
}) {
  const signupResult = await signup(payload);

  const { accessToken, refreshToken, role } = signupResult;

  const me = await getMe();

  return { accessToken, refreshToken, role, me };
}
