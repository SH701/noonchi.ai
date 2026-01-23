"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";

import { LoginAction, LoginForm } from "@/components/auth";
import { loginSchema } from "@/types/auth";
import { useModalActions } from "@/store/modal/useModalStore";

type LoginData = z.infer<typeof loginSchema>;

export default function LoginContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});
  const { closeModal } = useModalActions();
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginData) => {
    setServerErrors({});
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setServerErrors({
          general: "Email or password incorrect!",
        });
        setLoading(false);
        return;
      }

      closeModal();
      router.replace("/main");
    } catch {
      setServerErrors({ general: "Login Error!" });
      setLoading(false);
    }
  };

  return (
    <div className=" flex flex-col  px-4 ">
      <div className="flex-1 flex items-center justify-center  ">
        <div className="w-full max-w-sm space-y-6">
          <p className=" mt-14 my-10 text-center text-2xl font-semibold ">
            Welcome back
          </p>
          <LoginForm control={control} errors={errors} />
          <LoginAction
            loading={loading}
            handleLogin={handleSubmit(onSubmit)}
            isValid={isValid}
          />
          {serverErrors.email && (
            <p className="text-red-500 text-sm text-center">
              {serverErrors.email}
            </p>
          )}
          {serverErrors.password && (
            <p className="text-red-500 text-sm text-center">
              {serverErrors.password}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
