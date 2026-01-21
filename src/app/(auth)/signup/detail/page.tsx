"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";

import { useAuthStore } from "@/store/auth/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { performSignup } from "@/lib/service/signup";
import { useUserStore } from "@/store";
import { SignupHeader, SignupTemplate, SignupForm2 } from "@/components/auth";
import { signup2Schema } from "@/types/auth";
import { ApiError } from "@/api/api";

type Step2FormData = z.infer<typeof signup2Schema>;

export default function SignupStep2() {
  const router = useRouter();
  const setTokens = useAuthStore((s) => s.setTokens);
  const setUser = useUserStore((s) => s.setUser);
  const queryClient = useQueryClient();
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<Step2FormData>({
    resolver: zodResolver(signup2Schema),
    mode: "onChange",
    defaultValues: {
      name: "",
      birthdate: "",
      gender: "MALE",
    },
  });

  useEffect(() => {
    setEmail(sessionStorage.getItem("signupEmail") || "");
    setPassword(sessionStorage.getItem("signupPassword") || "");
  }, []);

  const onSubmit = async (data: Step2FormData) => {
    try {
      setLoading(true);

      const { accessToken, refreshToken, user } = await performSignup({
        email,
        password,
        nickname: data.name,
        gender: data.gender,
        birthDate: data.birthdate,
      });

      setTokens(accessToken, refreshToken);
      setUser(user);

      await queryClient.invalidateQueries({ queryKey: ["userProfile"] });

      const pendingInterviewId = localStorage.getItem("pendingInterviewId");
      if (pendingInterviewId) {
        router.push(`/main/chatroom/${pendingInterviewId}`);
        localStorage.removeItem("pendingInterviewId");
      } else {
        router.push("/main");
      }
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
    <SignupTemplate
      header={<SignupHeader title="Create account" />}
      footer={
        <Button
          variant="primary"
          size="lg"
          disabled={!isValid}
          onClick={handleSubmit(onSubmit)}
        >
          Next
        </Button>
      }
    >
      <SignupForm2 control={control} errors={errors} />
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
    </SignupTemplate>
  );
}
