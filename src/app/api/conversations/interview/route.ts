import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const auth = req.headers.get("authorization");
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = auth.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const body = await req.json();
    const {
      companyName,
      jobTitle,
      jobPosting,
      interviewStyle,
      files = [],
    } = body;

    if (!companyName || !jobTitle || !interviewStyle || !jobPosting) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const conversationId = Math.floor(Math.random() * 1000000000);

    const personaId = Math.floor(Math.random() * 100000);

    return NextResponse.json(
      {
        conversationId,
        personaId,
        companyName,
        jobTitle,
        interviewStyle,
        files,
      },
      { status: 201 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Internal Server Error" },
      { status: 500 }
    );
  }
}
