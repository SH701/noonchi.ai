"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import ActionButton from "@/components/atoms/button/ActionButton";
import TextInput from "@/components/atoms/form/TextInput";

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
      <div className="flex-1 px-6 py-8 space-y-4 pb-32">
        <TextInput
          label="Email"
          type="email"
          placeholder="example@gmail.com"
          value={email}
          onChange={setEmail}
        />
        <TextInput
          label="Password"
          type="password"
          placeholder="••••••••"
          value={pw}
          onChange={setPw}
        />
        <TextInput
          label="Re-enter password"
          type="password"
          placeholder="••••••••"
          value={pw2}
          onChange={setPw2}
        />
        <p className="text-sm text-blue-600">
          8–16 characters, include letters & numbers
        </p>
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
        <div className="flex justify-center items-center fixed bottom-24">
          <ActionButton disabled={!canNext} onClick={goNext}>
            Next
          </ActionButton>
        </div>
      </div>
    </div>
  );
}
