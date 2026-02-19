"use client";

import { useModalActions } from "@/store/modal/useModalStore";
import Image from "next/image";
import { Button } from "../../components/ui/button/button";
import { LoginContent, SignupContent } from "../auth";

export default function PreviewEnd() {
  const { openModal } = useModalActions();
  const loginOpen = () => {
    openModal(<LoginContent />);
  };
  const signupOpen = () => {
    openModal(<SignupContent />);
  };
  return (
    <div className="bg-gradient-primary min-h-dvh flex flex-col items-center justify-center">
      <div className="mt-auto flex flex-col items-center">
        <Image
          src="/etc/logo.png"
          alt="preview-end"
          width={217}
          height={50}
          priority
          style={{ width: 217, height: 60 }}
        />
        <p className="py-4 text-2xl font-medium text-gray-800">
          Preview Roleplay Ended
        </p>
        <div className="flex flex-col items-center justify-center text-sm text-gray-600 font-medium">
          <span>The Prevoew roleplay has ended.</span>
          <span>To continue the conversation,</span>
          <span>please log in or sign up</span>
        </div>
      </div>
      <div className="flex flex-col gap-4 mt-auto pb-13">
        <Button size="lg" onClick={signupOpen}>
          Create Account
        </Button>
        <Button variant="secondary" size="lg" onClick={loginOpen}>
          Login
        </Button>
      </div>
    </div>
  );
}
