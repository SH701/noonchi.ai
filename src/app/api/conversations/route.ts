import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const headers = new Headers({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  });

  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) {
    return NextResponse.json(
      { message: "Not authenticated" },
      { status: 401, headers }
    );
  }

  const token = auth.split(" ")[1];
  const url = new URL(req.url);

  try {
    const upstream = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/conversations${url.search}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    // JSON 가능/불가능 모두 처리
    const text = await upstream.text();
    const isJson = text.startsWith("{") || text.startsWith("[");
    return new NextResponse(isJson ? text : null, {
      status: upstream.status,
      headers: {
        ...headers,
        ...(isJson ? { "content-type": "application/json" } : {}),
      },
    });
  } catch (err) {
    console.error("Upstream fetch failed:", err);
    return NextResponse.json(
      { message: "Backend unavailable" },
      { status: 500, headers }
    );
  }
}
