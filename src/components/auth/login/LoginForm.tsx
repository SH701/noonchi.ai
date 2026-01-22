"use client";

import { TextInput } from "@/components/ui/form";
import { Controller, FieldErrors, Control } from "react-hook-form";

interface LoginData {
  email: string;
  password: string;
}

export default function LoginForm({
  control,
  errors,
}: {
  control: Control<LoginData>;
  errors: FieldErrors<LoginData>;
}) {
  return (
    <>
      <div>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextInput
              label="Email"
              type="email"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              placeholder="example@naver.com"
            />
          )}
        />
        {errors.email && (
          <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <TextInput
              label="Password"
              type="password"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              placeholder="••••••••"
            />
          )}
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>
    </>
  );
}
