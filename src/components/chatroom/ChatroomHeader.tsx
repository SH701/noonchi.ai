import { useConversationDetail } from "@/hooks/conversation/useConversationDetail";
import { Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Unfinished from "../modal/Unfinished";
import Sucess from "../modal/Sucess";
import { useUserProfile } from "@/hooks/user/useUserProfile";
import { useAuthStore } from "@/store/useAuth";

type Props = {
  name: string | undefined;
  hidden: boolean;
  setHidden: (value: boolean) => void;
  conversationId: string;
  onInfoOpen: () => void;
};

export default function ChatroomHeader({
  name,
  hidden,
  setHidden,
  onInfoOpen,
  conversationId,
}: Props) {
  const { id } = useParams<{ id: string }>();
  const { data: conversation } = useConversationDetail(id);
  const { data: user } = useUserProfile();
  const [isUnfinishedOpen, setIsUnfinishedOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  const accessToken = useAuthStore((s) => s.accessToken);
  const router = useRouter();

  const handleExit = async () => {
    if (conversation?.taskAllCompleted === false) {
      setIsUnfinishedOpen(true);
    } else {
      setIsSuccessOpen(true);
    }
    try {
      const res = await fetch(`/api/conversations/${conversationId}/end`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!res.ok) {
        console.error("Failed to end conversation:", res.status);
        return;
      }
      router.push(`/main/chatroom/${conversationId}/result`);
    } catch (error) {
      console.error("Error ending conversation:", error);
    }
  };

  return (
    <>
      <div className="flex flex-col sticky top-0 z-50">
        <div className="bg-white border-b border-gray-200 px-4 py-3">
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
            <button
              className="absolute right-3"
              onClick={() => setHidden(true)}
            >
              <Image src="/etc/exit2.png" alt="exit" width={84} height={33} />
            </button>
          )}
        </div>

        <div className="w-full px-2 py-2.5 bg-gray-700 flex gap-1 justify-between text-white">
          <p className="py-1 px-2 text-xs bg-gray-600 rounded-md">
            Task {conversation?.taskCurrentLevel}
          </p>
          <p className="text-xs">{conversation?.taskCurrentName}</p>
          {conversation?.taskAllCompleted ? (
            <Check className="text-blue-500" />
          ) : (
            <Check className="text-gray-400" />
          )}
        </div>
      </div>
      <Unfinished
        isOpen={isUnfinishedOpen}
        onClose={() => setIsUnfinishedOpen(false)}
      />
      {user?.role === "ROLE_USER" ? null : (
        <Sucess
          isOpen={isSuccessOpen}
          onClose={() => setIsSuccessOpen(false)}
        />
      )}
    </>
  );
}
