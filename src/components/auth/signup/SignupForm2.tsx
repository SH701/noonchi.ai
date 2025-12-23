"use client";

import { TextInput } from "@/components/ui/form";
import GenderToggle from "./GenderToggle";
import { Controller, Control, FieldErrors } from "react-hook-form";

interface SignupForm2Data {
  name: string;
  birthdate: string;
  gender: "MALE" | "FEMALE";
}

export default function SignupForm2({
  control,
  errors,
}: {
  control: Control<SignupForm2Data>;
  errors: FieldErrors<SignupForm2Data>;
}) {
  return (
    <div className="space-y-4">
      <div>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextInput
              label="Name"
              required
              placeholder="Enter your name"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>
      <div>
        <Controller
          name="birthdate"
          control={control}
          render={({ field }) => (
            <TextInput
              label="Birth date"
              placeholder="YYYY-MM-DD"
              value={field.value}
              onChange={(v) => {
                let val = v.replace(/\D/g, "");
                if (val.length > 4) val = val.slice(0, 4) + "-" + val.slice(4);
                if (val.length > 7) val = val.slice(0, 7) + "-" + val.slice(7);
                if (val.length > 10) val = val.slice(0, 10);
                field.onChange(val);
              }}
            />
          )}
        />
        {errors.birthdate && (
          <p className="text-red-500 text-sm mt-1">
            {errors.birthdate?.message}
          </p>
        )}
      </div>
      <div>
        <Controller
          name="gender"
          control={control}
          render={({ field }) => (
            <GenderToggle gender={field.value} setGender={field.onChange} />
          )}
        />
        {errors.gender && (
          <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>
        )}
      </div>
    </div>
  );
}
