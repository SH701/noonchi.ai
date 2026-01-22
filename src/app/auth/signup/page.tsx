"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { SignupForm1, SignupHeader, SignupTemplate } from "@/components/auth";
import { signupSchema } from "@/types/auth";

type Step1FormData = z.infer<typeof signupSchema>;

export default function SignupStep1() {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<Step1FormData>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      confirmpassword: "",
      agree: false,
    },
  });

  const onSubmit = (data: Step1FormData) => {
    sessionStorage.setItem("signupEmail", data.email);
    sessionStorage.setItem("signupPassword", data.password);
    router.push("/auth/signup/detail");
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
      <SignupForm1 control={control} errors={errors} />
    </SignupTemplate>
  );
}
