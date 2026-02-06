import { User as AppUser } from "@/types/user/user.type";

declare module "next-auth" {
  interface Session {
    accessToken: string;
    refreshToken: string;
    user: AppUser;
  }

  interface User {
    id: string;
    accessToken: string;
    refreshToken: string;
    user: AppUser;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    refreshToken: string;
    user: AppUser;
    accessTokenExpires: number;
    error?: string;
  }
}
