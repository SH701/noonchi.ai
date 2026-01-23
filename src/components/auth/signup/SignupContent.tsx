"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  SignupForm1,
  SignupHeader,
  SignupTemplate,
  SignupDetail,
} from "@/components/auth";
import { signupSchema } from "@/types/auth";

type Step1FormData = z.infer<typeof signupSchema>;

export default function SignupContent() {
  const [step, setStep] = useState<1 | 2>(1);
  const [signupData, setSignupData] = useState({ email: "", password: "" });
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});
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
    setSignupData({ email: data.email, password: data.password });
    setStep(2);
  };

  const handleError = (error: string) => {
    setServerErrors({ email: error });
    setStep(1);
  };

  if (step === 2) {
    return (
      <SignupDetail
        email={signupData.email}
        password={signupData.password}
        serverErrors={handleError}
      />
    );
  }

  return (
    <SignupTemplate
      header={<SignupHeader title="Create Account" />}
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
      {serverErrors.email && (
        <p className="text-red-500 text-sm text-center">{serverErrors.email}</p>
      )}
    </SignupTemplate>
  );
}
