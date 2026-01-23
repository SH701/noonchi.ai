"use client";

import { useModalActions } from "@/store/modal/useModalStore";
import Image from "next/image";
import { Button } from "../ui/button/button";
import SignupContent from "./signup/SignupContent";
import LoginContent from "./login/LoginContent";
export default function PreviewEnd() {
  const { openModal } = useModalActions();
  const loginOpen = () => {
    openModal(<LoginContent />);
  };
  const signupOpen = () => {
    openModal(<SignupContent />);
  };
  return (
    <div className="bg-gradient-primary h-[80vh] flex flex-col items-center justify-center pt-48 rounded-t-[50px] ">
      <Image
        src="/etc/logo.png"
        alt="preview-end"
        width={217}
        height={50}
        priority
        style={{ width: 217, height: 50 }}
      />
      <p className="pt-10 pb-6 text-2xl font-medium text-gray-800">
        Preview Roleplay Ended
      </p>

      <div className="flex flex-col items-center justify-center text-sm text-gray-600 font-medium">
        <span>The Prevoew roleplay has ended.</span>
        <span>To continue the conversation,</span>
        <span>please log in or sign up</span>
      </div>
      <div className="flex flex-col gap-4 mt-auto pb-22">
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
