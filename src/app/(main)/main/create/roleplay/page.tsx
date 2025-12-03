"use client";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const runtime = "nodejs";

import RolePlay from "@/components/createchatroom/Roleplay";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RolePlay />
    </Suspense>
  );
}
