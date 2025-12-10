import { apiFetch } from "@/lib/api/api";

interface SignupPayload {
  email: string;
  password: string;
  nickname: string;
  gender: "MALE" | "FEMALE";
  birthDate: string;
}
 interface SignupResponse  {
  accessToken: string;
  refreshToken: string;
};
export async function signup(payload: SignupPayload) {
  const data = await apiFetch<SignupResponse>("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return data;
}
