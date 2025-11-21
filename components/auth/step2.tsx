"use client";
export const dynamic = "force-dynamic";

import Loading from "@/app/after/loading";
import { useAuthStore } from "@/app/store/auth";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function SignupStep2() {
  const router = useRouter();

  const setAccessToken = useAuthStore((s) => s.setAccessToken);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState<"MALE" | "FEMALE">("MALE");
  const [, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const canSubmit = name.trim() !== "" && birthDate !== "";

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("signupEmail") || "";
    const storedPassword = sessionStorage.getItem("signupPassword") || "";
    setEmail(storedEmail);
    setPassword(storedPassword);
  }, []);

  const parseJsonSafe = async (res: Response) => {
    const ct = res.headers.get("content-type") || "";
    return ct.includes("application/json") ? res.json() : {};
  };

  const handleSignup = async () => {
    if (!canSubmit) return;
    setError(null);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          nickname: name,
          gender,
          birthDate,
        }),
      });

      const data = await parseJsonSafe(res);

      if (!res.ok) {
        setError(data?.message || "Signup failed");
        return;
      }

      const token = data?.accessToken;
      if (!token) {
        setError("토큰이 없습니다. 관리자에게 문의하세요.");
        return;
      }

      setAccessToken(token);
      localStorage.setItem("accessToken", token);

      setLoading(true);
      setTimeout(() => {
        router.push("/after");
      }, 1500);
    } catch {
      setError("Something went wrong");
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="flex flex-col min-h-screen bg-white max-w-[375px] mx-auto">
      {/* Header */}
      <div className="px-6 py-4 bg-white mt-8">
        <h2 className="text-xl font-semibold text-gray-800">
          Enter your details
        </h2>
        <p className="text-sm text-gray-500 mt-2 leading-[140%]">
          Enter it exactly as shown on your ID
        </p>
      </div>

      <div className="flex-1 px-6 py-8 space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Name
          </label>
          <input
            type="text"
            placeholder="Enter your name"
            className="w-full px-4 py-3 border rounded-xl bg-gray-50"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Birth date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Birth date
          </label>
          <input
            type="text"
            placeholder="YYYY-MM-DD"
            pattern="\d{4}-\d{2}-\d{2}"
            className="w-full px-4 py-3 border rounded-xl bg-gray-50"
            value={birthDate}
            onChange={(e) => {
              let v = e.target.value.replace(/\D/g, "");
              if (v.length > 4) v = v.slice(0, 4) + "-" + v.slice(4);
              if (v.length > 7) v = v.slice(0, 7) + "-" + v.slice(7);
              setBirthDate(v);
            }}
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender
          </label>
          <div className="flex space-x-4">
            {(["MALE", "FEMALE"] as const).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGender(g)}
                className={`flex-1 py-3 rounded-xl border ${
                  gender === g
                    ? "bg-blue-50 text-blue-600 border-blue-600"
                    : "bg-white text-gray-700 border-gray-200"
                }`}
              >
                {g === "MALE" ? "Male" : "Female"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white">
        <button
          disabled={!canSubmit}
          onClick={handleSignup}
          className={`w-full h-[92px] text-lg font-semibold ${
            canSubmit
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-[#BFDBFE] text-[#EFF6FF] cursor-not-allowed"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
