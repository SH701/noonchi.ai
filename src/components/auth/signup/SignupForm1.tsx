"use client";

import { Checkbox, TextInput } from "@/components/ui/form";
import { Controller, Control, FieldErrors } from "react-hook-form";

type SignupForm1Data = {
  email: string;
  password: string;
  confirmpassword: string;
  agree: boolean;
};

export default function SignupForm1({
  control,
  errors,
}: {
  control: Control<SignupForm1Data>;
  errors: FieldErrors<SignupForm1Data>;
}) {
  return (
    <div className="space-y-4">
      <div>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextInput
              label="Email"
              type="email"
              placeholder="example@gmail.com"
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
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <TextInput
              label="Password"
              type="password"
              placeholder="••••••••"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        {errors.password && (
          <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
        )}
      </div>

      <div>
        <Controller
          name="confirmpassword"
          control={control}
          render={({ field }) => (
            <TextInput
              label="Re-enter password"
              type="password"
              placeholder="••••••••"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        {errors.confirmpassword && (
          <p className="text-sm text-red-500 mt-1">{errors.confirmpassword.message}</p>
        )}
      </div>

      <p className="text-sm text-gray-500 leading-[140%]">
        8–16 characters, include letters & numbers
      </p>

      <div>
        <Controller
          name="agree"
          control={control}
          render={({ field }) => (
            <label className="flex items-start space-x-3">
              <Checkbox checked={field.value} onChange={field.onChange} />
              <span className="text-sm text-gray-700 leading-relaxed">
                Agree with{" "}
                <a href="#" className="text-black underline">
                  Terms of use
                </a>{" "}
                and{" "}
                <a href="#" className="text-black underline">
                  privacy policy
                </a>
              </span>
            </label>
          )}
        />
        {errors.agree && (
          <p className="text-sm text-red-500 mt-1">{errors.agree.message}</p>
        )}
      </div>
    </div>
  );
}
