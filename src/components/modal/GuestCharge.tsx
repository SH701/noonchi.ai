"use client";

import { Info, Check, X } from "lucide-react";
import Modal from "../ui/modal/Modal";
import { Button } from "../ui/button";
import { ModalProps } from "@/types/etc";
import { useRouter } from "next/navigation";

export default function GuestCharge({ isOpen, onClose }: ModalProps) {
  const router = useRouter();
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="w-90 bg-white rounded-3xl p-6 relative items-center flex flex-col"
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="flex justify-center mb-5">
        <Info className="w-16 h-16 text-blue-600" />
      </div>

      <h2 className="text-xl font-semibold  text-gray-900 mb-2">
        You&apos;ve used up all credits
      </h2>

      <p className=" text-gray-600 text-sm mb-7 font-semibold text-center">
        Log in or sign up to save your progress and
        <br />
        get more Noonchi credits.
      </p>

      <div className="space-y-2 mb-6 w-full">
        <div className="flex items-start gap-1">
          <Check className="w-5 h-5 text-blue-600" />
          <p className="text-sm text-gray-700 text-left">
            Your past interviews and missions are now saved.
          </p>
        </div>

        <div className="flex items-start gap-1">
          <Check className="w-5 h-5 text-blue-600" />
          <div className="text-sm text-gray-700 text-left">
            <p>1 interview + full report = 100 credits</p>
            <p>1 topic + feedback = 30 credits</p>
          </div>
        </div>
      </div>

      <Button
        variant="primary"
        size="md"
        onClick={() => router.push("/signup")}
      >
        Sign Up
      </Button>
      <Button variant="primary" size="md" onClick={() => router.push("/login")}>
        Log in
      </Button>
    </Modal>
  );
}
