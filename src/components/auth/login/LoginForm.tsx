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
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextInput
              label="email"
              type="email"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        {errors.email && (
          <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <TextInput
              label="password"
              type="password"
              value={field.value}
              onChange={field.onChange}
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
