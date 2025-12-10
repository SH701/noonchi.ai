import { useAuthStore } from "@/store/useAuth";

export async function apiFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const token = useAuthStore.getState().accessToken;

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    if (res.status === 401) {
      useAuthStore.getState().logout();
    }
    const text = await res.text();
    throw new Error(text || `API Error: ${res.status}`);
  }
  try {
    return res.json();
  } catch {
    return {} as T;
  }
}
