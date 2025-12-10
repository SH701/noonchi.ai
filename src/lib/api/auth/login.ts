import { apiFetch } from "@/lib/api/api";
import type { Profile } from "@/types/user";

export async function login(email: string, password: string) {
  return apiFetch<Profile>(`/api/auth/login`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}
