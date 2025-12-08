"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ActionButton } from "@/components/ui/button";
import Loading from "@/components/loading/loading";
import SignupFormStep2 from "@/components/signup/SignupForm2";
import SignupTemplate from "@/components/signup/SignupTemplate";
import SignupHeader from "@/components/signup/SignupHeader";
import { useAuthStore } from "@/store/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { performSignup } from "@/lib/service/signup";

export default function SignupStep2() {
  const router = useRouter();
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const setRefreshToken = useAuthStore((s) => s.setRefreshToken);
  const setMe = useAuthStore((s) => s.setMe);
  const setRole = useAuthStore((s) => s.setRole);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState<"MALE" | "FEMALE">("MALE");

  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    setEmail(sessionStorage.getItem("signupEmail") || "");
    setPassword(sessionStorage.getItem("signupPassword") || "");
  }, []);

  const canSubmit = name.trim() !== "" && birthDate !== "";

  const handleSignup = async () => {
    if (!canSubmit) return;

    try {
      setLoading(true);

      const { accessToken, refreshToken, role, me } = await performSignup({
        email,
        password,
        nickname: name,
        gender,
        birthDate,
      });

      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      setRole(role);
      setMe(me);

      await queryClient.invalidateQueries({ queryKey: ["userProfile"] });

      const pendingInterviewId = localStorage.getItem("pendingInterviewId");
      if (pendingInterviewId) {
        router.push(`/main/chatroom/${pendingInterviewId}`);
        localStorage.removeItem("pendingInterviewId");
      } else {
        router.push("/main");
      }
    } catch {
      alert("Signup failed");
    } finally {
      setLoading(false);
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
