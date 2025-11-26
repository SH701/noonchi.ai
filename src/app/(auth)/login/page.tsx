"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Loading from "@/app/after/loading";
import Image from "next/image";
import { useAuthStore, type Level } from "@/src/store/auth";
import ActionButton from "@/components/atoms/button/ActionButton";

export default function LoginPage() {
  const router = useRouter();

  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const setKoreanLevel = useAuthStore((s) => s.setKoreanLevel);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }
      const { accessToken, refreshToken } = data;
      if (!accessToken || !refreshToken) {
        setError("토큰이 없습니다. 관리자에게 문의하세요.");
        setLoading(false);
        return;
      }
      setAccessToken(accessToken);
      useAuthStore.getState().setRefreshToken(refreshToken);

      const meRes = await fetch("/api/users/me", {
        headers: { Authorization: `Bearer ${data.accessToken}` },
      });

      const me = await meRes.json();

      const hasKoreanLevel =
        me.koreanLevel &&
        ["BEGINNER", "INTERMEDIATE", "ADVANCED"].includes(me.koreanLevel);

      if (hasKoreanLevel) {
        setKoreanLevel(me.koreanLevel as Level);
        router.replace("/main");
      } else {
        router.replace("/after");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong");
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen flex flex-col bg-white px-4">
      <div className="flex justify-center items-center mt-32">
        <Image
          src="/etc/logo_login.svg"
          alt="Logo"
          width={200}
          height={42}
          priority
        />
      </div>

      <div className="flex-1 flex items-start justify-center mt-10">
        <div className="w-full max-w-sm space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="example@gmail.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
          </div>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          <div className="flex items-center justify-center">
            <ActionButton
              onClick={handleLogin}
              disabled={loading || !email || !password}
            >
              Sign in
            </ActionButton>
          </div>

          <p className="text-center text-sm text-gray-500">
            First time here?{" "}
            <Link
              href="/signup"
              className="font-medium text-blue-500 hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
