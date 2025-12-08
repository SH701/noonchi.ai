"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

import Loading from "@/components/loading/loading";
import { ActionButton } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuth";
import { performLogin } from "@/lib/service/login";

export default function LoginPage() {
  const router = useRouter();

  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const setRefreshToken = useAuthStore((s) => s.setRefreshToken);
  const setMe = useAuthStore((s) => s.setMe);
  const setKoreanLevel = useAuthStore((s) => s.setKoreanLevel);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const { accessToken, refreshToken, me } = await performLogin(
        email,
        password
      );

      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      setMe(me);

      if (me.koreanLevel) {
        setKoreanLevel(me.koreanLevel);
      }

      router.replace("/main");
    } catch {
      setError("Login failed");
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
              disabled={!email || !password || loading}
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
