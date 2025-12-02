import LoginModal from "@/components/modal/LoginModal";
import EndModal from "@/components/result/EndModal";
import { useAuthStore } from "@/store/auth";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type Props = {
  name: string | undefined;
  hidden: boolean;
  setHidden: (value: boolean) => void;
  conversationId: string; // 추가
  onInfoOpen: () => void;
};

export default function ChatroomHeader({
  name,
  hidden,
  setHidden,
  conversationId,
  onInfoOpen,
}: Props) {
  const { role } = useAuthStore();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isEndModalOpen, setIsEndModalOpen] = useState(false);

  const handleExit = () => {
    if (role === "ROLE_GUEST") {
      setIsLoginModalOpen(true);
    } else {
      setIsEndModalOpen(true);
    }
  };

  return (
    <>
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-50">
        <div className="flex items-center justify-between w-full">
          <Link
            href="/main"
            aria-label="Back"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>

          <span
            className="text-lg font-semibold text-gray-900 font-pretendard cursor-pointer"
            onClick={onInfoOpen}
          >
            {name ?? "..."}
          </span>

          <button
            onClick={handleExit}
            aria-label="End conversation"
            className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
          >
            <Image
              src="/etc/exit_to_app.svg"
              alt="exit"
              width={24}
              height={24}
            />
          </button>
        </div>

        {!hidden && (
          <button className="absolute right-3" onClick={() => setHidden(true)}>
            <Image src="/etc/exit2.png" alt="exit" width={84} height={33} />
          </button>
        )}
      </div>
      {isLoginModalOpen && (
        <LoginModal
          onClose={() => setIsLoginModalOpen(false)}
          isOpen={isLoginModalOpen}
        />
      )}
      {isEndModalOpen && (
        <EndModal
          isOpen={isEndModalOpen}
          onClose={() => setIsEndModalOpen(false)}
          conversationId={conversationId}
        />
      )}
    </>
  );
}
