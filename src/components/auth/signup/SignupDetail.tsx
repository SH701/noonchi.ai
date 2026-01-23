"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button/button";

import { useQueryClient } from "@tanstack/react-query";
import { performSignup } from "@/lib/service/signup";

import { SignupHeader, SignupTemplate, SignupForm2 } from "@/components/auth";
import { signup2Schema } from "@/types/auth";
import { ApiError } from "@/api/api";
import { useUserStore } from "@/store/user/useUsersStore";
import { signIn } from "next-auth/react";

type Step2FormData = z.infer<typeof signup2Schema>;

interface SignupDetailProps {
  email: string;
  password: string;
  serverErrors: (error: string) => void;
}

export default function SignupDetail({
  email,
  password,
  serverErrors,
}: SignupDetailProps) {
  const router = useRouter();
  const setUser = useUserStore((s) => s.setUser);
  const queryClient = useQueryClient();

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
    },
  });

  const onSubmit = async (data: Step2FormData) => {
    try {
      const { user } = await performSignup({
        email,
        password,
        nickname: data.name,
        birthDate: data.birthdate,
      });

      await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

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
        serverErrors(err.message);
      }
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
          Get Started
        </Button>
      }
    >
      <SignupForm2 control={control} errors={errors} />
    </SignupTemplate>
  );
}
