import { apiFetch } from "@/lib/api/api";
import { AuthResponse } from "@/types/auth";

export async function login(email: string, password: string) {
  return apiFetch<AuthResponse>(`/api/auth/login`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}
