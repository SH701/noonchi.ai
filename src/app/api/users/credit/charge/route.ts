// app/api/language/tts/route.ts
import { NextRequest } from "next/server";
import { proxyJSON } from "@/app/api/_lib/proxy";

export async function POST(req: NextRequest) {
  return proxyJSON(req, `/api/users/credit/charge`, {
    method: "POST",
    forwardAuth: true,
    forwardCookies: false,
    extraHeaders: { Accept: "*/*" },
  });
}
