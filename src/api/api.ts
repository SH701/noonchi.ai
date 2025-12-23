import { useAuthStore } from "@/store/auth/useAuth";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

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
      useAuthStore.getState().clearTokens();
    }

    let errorMessage = `API Error: ${res.status}`;
    let errorCode: string | undefined;

    try {
      const errorData = await res.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
      errorCode = errorData.code;
    } catch {
      const text = await res.text();
      if (text) errorMessage = text;
    }

    throw new ApiError(errorMessage, res.status, errorCode);
  }

  try {
    return res.json();
  } catch {
    return {} as T;
  }
}
