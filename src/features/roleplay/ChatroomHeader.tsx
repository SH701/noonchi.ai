"use client";

import { MessageCircle, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/common/Header";
import { useConversationEnd } from "@/hooks/mutations";
import { useConversationDetail } from "@/hooks/queries";
import { ExitChatting } from "../../components/modal";
import { HamburgerIcon, SqurepenIcon } from "@/assets/svgr";

interface ChatroomHeaderProps {
  roomId: number;
  title: string;
}

export default function ChatroomHeader({ roomId, title }: ChatroomHeaderProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const toggleBtnRef = useRef<HTMLDivElement>(null);
  const { data: detailData } = useConversationDetail(roomId);
  const { mutate: conversationEnd } = useConversationEnd(roomId);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        dropdownRef.current?.contains(target) ||
        toggleBtnRef.current?.contains(target)
      )
        return;
      setOpen(false);
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [open]);

  const handleNewChat = () => {
    router.push("/main");
    setOpen(false);
  };

  const handleEnd = () => {
    if (detailData?.canGetReport) {
      conversationEnd();
      router.push(`/main/roleplay/chatroom/${roomId}/result`);
    } else {
      setShowExitModal(true);
    }
    setOpen(false);
  };

  return (
    <>
      <div className="sticky top-0 ">
        <Header
          leftIcon={<HamburgerIcon />}
          center={title}
          rightIcon={
            <div ref={toggleBtnRef}>
              <SqurepenIcon onClick={() => setOpen((prev) => !prev)} />
            </div>
          }
        />
      </div>
      {open && (
        <div
          ref={dropdownRef}
          className="p-3 rounded-xl bg-white flex flex-col gap-1 absolute right-5 top-16 z-50"
        >
          <button className="p-2 flex gap-2" onClick={handleNewChat}>
            <Sparkles />
            New Chat
          </button>
          <button className="p-2 flex gap-2" onClick={handleEnd}>
            <MessageCircle />
            Get Reports
          </button>
        </div>
      )}
      {showExitModal && (
        <ExitChatting
          onClose={() => setShowExitModal(false)}
          isOpen={showExitModal}
        />
      )}
    </>
  );
}
