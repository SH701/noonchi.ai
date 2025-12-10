import { apiFetch } from "@/lib/api/api";
import { User } from "@/types/user.type";

export async function getUser() {
  const data = await apiFetch<User>("/api/users/me");

  return data;
}
