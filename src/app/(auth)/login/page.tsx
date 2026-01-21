"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { performLogin } from "@/lib/service/login";
import { useUserStore, useAuthStore } from "@/store";
import { LoginAction, LoginForm, LoginHeader } from "@/components/auth";

import { loginSchema } from "@/types/auth";
import { ApiError } from "@/api/api";

type LoginData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();

  const setTokens = useAuthStore((s) => s.setTokens);
  const setUser = useUserStore((s) => s.setUser);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginData) => {
    setError("");
    setLoading(true);

    try {
      const { accessToken, refreshToken, user } = await performLogin(
        data.email,
        data.password,
      );

      setTokens(accessToken, refreshToken);
      setUser(user);

      router.replace("/main");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred. Please try again");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white px-4">
      <LoginHeader />

      <div className="flex-1 flex items-start justify-center mt-10">
        <div className="w-full max-w-sm space-y-6">
          <LoginForm control={control} errors={errors} />
          <LoginAction
            loading={loading}
            handleLogin={handleSubmit(onSubmit)}
            isValid={isValid}
          />
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </div>
      </div>
    </div>
  );
}
