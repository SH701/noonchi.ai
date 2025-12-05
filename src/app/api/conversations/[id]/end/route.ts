// app/api/conversations/[id]/end/route.ts
import { NextRequest, NextResponse } from "next/server";

const API = process.env.NEXT_PUBLIC_API_URL;

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // ✅ Promise 타입
) {
  const { id } = await params; // ✅ await 필수!

  console.log("Received id:", id); // 디버깅용

  const token = req.headers.get("authorization");
  if (!token) {
    return NextResponse.json(
      { error: "Authorization token is missing" },
      { status: 401 }
    );
  }

  try {
    console.log("Calling upstream:", `${API}/api/conversations/${id}/end`);

    const upstream = await fetch(`${API}/api/conversations/${id}/end`, {
      method: "PUT",
      headers: { authorization: token },
      cache: "no-store",
    });

    const text = await upstream.text().catch(() => "");

    return new NextResponse(text || null, {
      status: upstream.status,
      headers: {
        "content-type":
          upstream.headers.get("content-type") ?? (text ? "text/plain" : ""),
      },
    });
  } catch (e) {
    console.error("Error in PUT /api/conversations/[id]/end:", e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
