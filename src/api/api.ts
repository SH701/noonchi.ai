import { axios } from "@/api/common";
import { AxiosError } from "axios";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public errors?: Record<string, string>,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiFetch<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  try {
    const res = await axios({
      url,
      method: (options.method as string) || "GET",
      data: options.body ? JSON.parse(options.body as string) : undefined,
      headers: options.headers as Record<string, string>,
    });

    return res.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const status = error.response?.status || 500;
      const errorData = error.response?.data;
      const errorMessage =
        errorData?.message || errorData?.error || `API Error: ${status}`;

      throw new ApiError(errorMessage, status);
    }
    throw error;
  }
}
