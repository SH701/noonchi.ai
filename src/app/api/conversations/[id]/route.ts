import { NextRequest } from "next/server";
import { proxyJSON } from "../../_lib/proxy";

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = await context.params; // ★ 반드시 await
  return proxyJSON(req, `/api/conversations/${id}`, {
    method: "GET",
    forwardAuth: true,
    forwardCookies: false,
  });
}

export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = await context.params; // ★ 반드시 await
  return proxyJSON(req, `/api/conversations/${id}`, {
    method: "DELETE",
    forwardAuth: true,
  });
}
