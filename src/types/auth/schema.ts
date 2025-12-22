import { z } from "zod";

export const signupSchema = z.object({
  email: z
    .string()
    .nonempty("Please enter your email address")
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

  nickname: z
    .string()
    .min(1, "Please enter a nickname")
    .max(16, "Nickname can be up to 16 characters long")
    .regex(
      /^[A-Za-z0-9가-힣]+$/,
      "Nickname can only contain letters, numbers, and Korean characters"
    ),
});
