"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Loading from "@/app/after/loading";
import Image from "next/image";
import { useAuthStore, type Level } from "@/store/useAuth";
import { ActionButton } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();

  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const setKoreanLevel = useAuthStore((s) => s.setKoreanLevel);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const setMe = useAuthStore((s) => s.setMe);
  const handleLogin = async () => {
    setLoading(true);
    setError("");

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
      setAccessToken(accessToken);
      useAuthStore.getState().setRefreshToken(refreshToken);
      const meRes = await fetch("/api/users/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const me = await meRes.json();
      setMe(me);
      if (me.koreanLevel) {
        setKoreanLevel(me.koreanLevel as Level);
      }
      router.replace("/main");
    } catch (err) {
      setError("Something went wrong");
    } finally {
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
