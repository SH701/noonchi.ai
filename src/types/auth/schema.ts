import { z } from "zod";

export const signupSchema = z
  .object({
    email: z
      .string()
      .min(1, "Please enter your email address")
      .email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .refine((val) => !val.includes(" "), {
        message: "Password cannot contain spaces",
      })
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)/,
        "Password must include at least one letter and one number"
      ),
    confirmpassword: z
      .string()
      .min(8, "Password must be at least 8 characters long"),
    agree: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms",
    }),
  })
  .refine((data) => data.password === data.confirmpassword, {
    message: "Passwords do not match",
    path: ["confirmpassword"],
  });
export const signup2Schema = z.object({
  name: z
    .string()
    .min(1, "Please enter a nickname")
    .max(16, "Nickname can be up to 16 characters long")
    .regex(
      /^[A-Za-z0-9가-힣]+$/,
      "Nickname can only contain letters, numbers, and Korean characters"
    ),
  birthdate: z
    .string()
    .min(1, "Please enter your birth date")
    .refine(
      (val) => {
        const year = parseInt(val.split("-")[0]);
        return !isNaN(year) && year >= 1900;
      },
      {
        message: "Birth year must be 1900 or later",
      }
    ),
  gender: z.enum(["MALE", "FEMALE"], {
    message: "Please select a gender",
  }),
});
