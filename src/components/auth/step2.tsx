"use client";
export const dynamic = "force-dynamic";

import Loading from "@/app/after/loading";
import { useAuthStore } from "@/store/auth";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import ActionButton from "../atoms/button/ActionButton";
import TextInput from "../atoms/form/TextInput";

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

      const { accessToken, refreshToken } = data;

      setAccessToken(accessToken);
      useAuthStore.getState().setRefreshToken(refreshToken);

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
      <div className="px-6 py-4 bg-white mt-8">
        <h2 className="text-xl font-semibold text-gray-800">
          Enter your details
        </h2>
        <p className="text-sm text-gray-500 mt-2 leading-[140%]">
          Enter it exactly as shown on your ID
        </p>
      </div>

      <div className="flex-1 px-6 py-8 space-y-4">
        <TextInput
          label="Name"
          required
          placeholder="Enter your name"
          value={name}
          onChange={setName}
        />

        <TextInput
          label="Birth date"
          placeholder="YYYY-MM-DD"
          value={birthDate}
          onChange={(v) => {
            let val = v.replace(/\D/g, "");
            if (val.length > 4) val = val.slice(0, 4) + "-" + val.slice(4);
            if (val.length > 7) val = val.slice(0, 7) + "-" + val.slice(7);
            setBirthDate(val);
          }}
        />

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender
          </label>
          <div className="flex space-x-4 ">
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
        <div className="flex justify-center items-center fixed bottom-24">
          <ActionButton disabled={!canSubmit} onClick={handleSignup}>
            Next
          </ActionButton>
        </div>
      </div>
    </div>
  );
}
