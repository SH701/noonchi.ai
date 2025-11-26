"use client";

import { useRouter } from "next/navigation";
import { Lock, LogIn } from "lucide-react";

export default function Error() {
  const router = useRouter();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50  text-center">
      <div className="bg-white shadow-lg rounded-2xl p-8 ">
        <div className="flex justify-center mb-4">
          <Lock className="w-14 h-14 text-blue-500" />
        </div>

        <h1 className="text-xl font-semibold text-gray-900 mb-3">
          This feature is coming soon
        </h1>
        <p className="text-sm  text-gray-600 mb-6">
          Sorry for the inconvenience. <br />
          We’re preparing a better experience for you!
        </p>

        <button
          onClick={() => router.push("/main")}
          className="flex items-center justify-center gap-2 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition cursor-pointer"
        >
          <LogIn className="w-5 h-5" />
          Go Main
        </button>
      </div>
    </main>
  );
}
