import { apiFetch } from "@/lib/api/api";

interface SignupPayload {
  email: string;
  password: string;
  nickname: string;
  gender: "MALE" | "FEMALE";
  birthDate: string;
}

export async function signup(payload: SignupPayload) {
  const res = await apiFetch("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }

  return res.json();
}
