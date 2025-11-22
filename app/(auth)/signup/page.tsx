"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";

export default function SignupStep1() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [agree, setAgree] = useState(false);

  const canNext = email.includes("@") && pw.length >= 8 && pw === pw2 && agree;

  const goNext = () => {
    if (!canNext) return;
    sessionStorage.setItem("signupEmail", email);
    sessionStorage.setItem("signupPassword", pw);
    router.push("/signup/detail");
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="px-6 pt-4 pb-10 bg-white flex items-center justify-between relative mt-10">
        <button
          onClick={() => router.back()}
          className="text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </button>

        <h1 className="absolute left-1/2 transform -translate-x-1/2 text-xl font-semibold text-gray-800">
          Create account
        </h1>
      </div>

      <div className="flex-1 px-6 py-8 space-y-8 pb-32">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            placeholder="example@gmail.com"
            className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
          />
          <input
            type="password"
            placeholder="Re-enter your password"
            className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            value={pw2}
            onChange={(e) => setPw2(e.target.value)}
          />
          <p className="text-sm text-blue-600">
            8–16 characters, include letters & numbers
          </p>
        </div>

        <label className="flex items-start space-x-3">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
          />
          <span className="text-sm text-gray-700 leading-relaxed">
            Agree with{" "}
            <a href="#" className="text-black underline">
              Terms of use
            </a>{" "}
            and our{" "}
            <a href="#" className="text-black underline">
              privacy policy
            </a>
          </span>
        </label>
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-white">
        <button
          disabled={!canNext}
          onClick={goNext}
          className={`w-full h-[92px] py-4 font-semibold text-lg ${
            canNext
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-blue-200 text-blue-50 cursor-not-allowed"
          }`}
          style={{
            paddingBottom: "calc(env(safe-area-inset-bottom) + 16px)",
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}
