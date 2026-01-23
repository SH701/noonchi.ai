"use client";

import { useQueryClient } from "@tanstack/react-query";
import { InternalAxiosRequestConfig } from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";

import { axios } from "@/api/common";

interface Props {
  children: React.ReactNode;
}

export default function ClientProvider({ children }: Props) {
  const { data: session, status } = useSession();
  const queryClient = useQueryClient();
  const prevStatus = useRef<string | null>(null);

  useEffect(() => {
    const reqInterceptor = axios.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const accessToken = session?.accessToken;

        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    return () => {
      axios.interceptors.request.eject(reqInterceptor);
    };
  }, [session]);

  useEffect(() => {
    // (새로고침 시 비인증 상태로 캐싱된 데이터 리패칭)
    if (
      prevStatus.current === "loading" &&
      status === "authenticated" &&
      session?.accessToken
    ) {
      queryClient.invalidateQueries();
    }

    // 로그아웃 시 캐시 삭제 (리패칭 불필요)
    if (
      prevStatus.current === "authenticated" &&
      status === "unauthenticated"
    ) {
      queryClient.clear();
    }

    // 로그인 시 리패칭
    if (
      prevStatus.current === "unauthenticated" &&
      status === "authenticated" &&
      session?.accessToken
    ) {
      queryClient.invalidateQueries();
    }

    prevStatus.current = status;
  }, [status, queryClient, session]);

  return <>{children}</>;
}
