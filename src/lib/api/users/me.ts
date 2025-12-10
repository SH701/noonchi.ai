import { apiFetch } from "@/lib/api/api";
import { Profile } from "@/types/user";

export async function getMe() {
  const data = await apiFetch<Profile["user"]>("/api/users/me");

  return data;
}
