import { login } from "../api/auth/login";
import { getMe } from "../api/users/me";

export async function performLogin(email: string, password: string) {
  const { accessToken, refreshToken } = await login(email, password);

  const me = await getMe();

  return { accessToken, refreshToken, me };
}
