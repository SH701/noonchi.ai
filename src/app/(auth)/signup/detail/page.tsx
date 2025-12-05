"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { ActionButton } from "@/components/ui/button";
import Loading from "@/components/loading/loading";
import { useAuthStore } from "@/store/useAuth";
import SignupFormStep2 from "@/components/signup/SignupForm2";
import SignupTemplate from "@/components/signup/SignupTemplate";
import SignupHeader from "@/components/signup/SignupHeader";

export default function SignupStep2() {
  const router = useRouter();
  const { accessToken } = useAuthStore();
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState<"MALE" | "FEMALE">("MALE");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setEmail(sessionStorage.getItem("signupEmail") || "");
    setPassword(sessionStorage.getItem("signupPassword") || "");
  }, []);

  const canSubmit = name.trim() !== "" && birthDate !== "";

  const handleSignup = async () => {
    if (!canSubmit) return;

    const requestBody = {
      email,
      password,
      nickname: name,
      gender,
      birthDate,
    };

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(requestBody),
    });

    const responseText = await res.text();

    if (!res.ok) {
      alert(`회원가입 실패: ${res.status}\n${responseText}`);
      return;
    }

    const data = JSON.parse(responseText);

    setAccessToken(data.accessToken);
    useAuthStore.getState().setRefreshToken(data.refreshToken);
    useAuthStore.getState().setRole("ROLE_USER");

    setLoading(true);
    const pendingInterviewId = localStorage.getItem("pendingInterviewId");

    if (pendingInterviewId) {
      setTimeout(() => {
        router.push(`/main/chatroom/${pendingInterviewId}`);
        localStorage.removeItem("pendingInterviewId");
      }, 1500);
    } else {
      setTimeout(() => router.push("/main"), 1500);
    }
  };

  if (loading) return <Loading />;

  return (
    <SignupTemplate
      header={<SignupHeader title="Create account" />}
      footer={
        <ActionButton disabled={!canSubmit} onClick={handleSignup}>
          Next
        </ActionButton>
      }
    >
      <SignupFormStep2
        name={name}
        setName={setName}
        birthDate={birthDate}
        setBirthDate={setBirthDate}
        gender={gender}
        setGender={setGender}
      />
    </SignupTemplate>
  );
}
