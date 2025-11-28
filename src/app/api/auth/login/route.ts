import { NextRequest } from "next/server";
import { proxyJSON } from "@/app/api/_lib/proxy";

export async function POST(req: NextRequest) {
  return proxyJSON(req, "/api/auth/login", {
    method: "POST",
    forwardAuth: false,
    retries: 0, // ← 추가
    timeoutMs: 10000,
  });
}
