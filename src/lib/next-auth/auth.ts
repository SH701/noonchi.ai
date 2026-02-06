import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import z from "zod";
import { AuthResponse } from "@/types/auth";
import { User } from "@/types/user";

async function refreshAccessToken(refreshToken: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      },
    );

    if (!res.ok) {
      throw new Error("Failed to refresh token");
    }

    const data: AuthResponse = await res.json();
    return {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      user: data.user,
    };
  } catch (error) {
    console.error("Refresh token error:", error);
    return null;
  }
}

// TODO: 프로덕션에서는 60 * 60 * 1000 (1시간)으로 변경
const ACCESS_TOKEN_EXPIRES = 60 * 1000; // 테스트용 1분

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = z
          .object({ email: z.string().email(), password: z.string().min(1) })
          .safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        const { email, password } = parsed.data;

        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, password }),
            },
          );

          if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            console.log("Login error response:", errorData);
            return null;
          }

          const data: AuthResponse = await res.json();

          return {
            id: String(data.user.id),
            email: data.user.email,
            name: data.user.nickname,
            image: data.user.profileImageUrl,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            user: data.user,
          };
        } catch (e) {
          console.error("Login error:", e);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // 최초 로그인 시 토큰 저장
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.user = user.user;
        token.accessTokenExpires = Date.now() + ACCESS_TOKEN_EXPIRES;
      }

      // 토큰이 아직 유효하면 그대로 반환
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }

      // 토큰 만료 시 갱신 시도
      if (token.refreshToken && typeof token.refreshToken === "string") {
        const refreshed = await refreshAccessToken(token.refreshToken);
        if (refreshed) {
          token.accessToken = refreshed.accessToken;
          token.refreshToken = refreshed.refreshToken;
          token.user = refreshed.user;
          token.accessTokenExpires = Date.now() + ACCESS_TOKEN_EXPIRES;
        } else {
          token.error = "RefreshTokenError";
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;
      if (token.user) {
        const u = token.user as User;
        (session.user as User).id = u.id;
        session.user.email = u.email;
        session.user.nickname = u.nickname;
        session.user.birthDate = u.birthDate;
        session.user.role = u.role;
        session.user.provider = u.provider;
        session.user.koreanLevel = u.koreanLevel;
        session.user.sentenceCount = u.sentenceCount;
        session.user.profileImageUrl = u.profileImageUrl;
        session.user.creditPoint = u.creditPoint;
        session.user.interests = u.interests;
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
});
