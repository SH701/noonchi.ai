import { apiFetch } from "@/lib/api/api";

export async function getMe() {
  const res = await apiFetch("/api/users/me");

  if (!res.ok) {
    throw new Error("Failed to fetch user");
  }

  return res.json();
}
