"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

import Loading from "@/components/loading/loading";
import { Button } from "@/components/ui/button";

import { performLogin } from "@/lib/service/login";
import { useUserStore, useAuthStore } from "@/store";

export default function LoginPage() {
  const router = useRouter();

  const setTokens = useAuthStore((s) => s.setTokens);
  const setUser = useUserStore((s) => s.setUser);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const { accessToken, refreshToken, user } = await performLogin(
        email,
        password
      );

      setTokens(accessToken, refreshToken);

      setUser(user);

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
            <Button
              variant="primary"
              onClick={handleLogin}
              disabled={!email || !password || loading}
              size="lg"
            >
              Sign in
            </Button>
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
