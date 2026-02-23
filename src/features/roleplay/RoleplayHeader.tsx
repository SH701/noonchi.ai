"use client";

import { MessageCircle, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useTabStore } from "@/store/tab/useTabStore";
import Tab from "../tab/Tab";
import Header from "../../components/common/Header";
import { useConversationEnd } from "@/hooks/mutations";
import { useConversationDetail } from "@/hooks/queries";
import { ExitChatting } from "../../components/modal";
import { HamburgerIcon, HomeIcon, SqurepenIcon } from "@/assets/svgr";

export default function RoleplayHeader() {
  const { toggleTab } = useTabStore();
  const [open, setOpen] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const toggleBtnRef = useRef<HTMLDivElement>(null);
  const askRef = useRef<HTMLSpanElement>(null);
  const roleRef = useRef<HTMLSpanElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const roomId = params?.id ? Number(params.id) : null;

  const isAsk = pathname.startsWith("/main/ask");
  const isChatRoom = pathname.startsWith("/main/roleplay/chatroom/");
  const isReport = !!roomId && pathname.startsWith(`/main/roleplay/chatroom/${roomId}/result`);

  const { data: detailData } = useConversationDetail(roomId ?? 0, {
    enabled: !!roomId,
  });
  const { mutate: conversationEnd } = useConversationEnd(roomId ?? 0);

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

  const getActiveStyles = () => {
    const activeRef = isAsk ? askRef : roleRef;
    if (!activeRef.current) return { width: 40, x: 0 };
    return {
      width: activeRef.current.offsetWidth,
      x: activeRef.current.offsetLeft - 4,
    };
  };

  const handleToggle = () => {
    router.push(isAsk ? "/main" : "/main/ask");
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
      <Header
        leftIcon={<HamburgerIcon onClick={toggleTab} />}
        center={
          <div
            className="relative flex items-center bg-white/30 rounded-full cursor-pointer"
            onClick={handleToggle}
          >
            <motion.div
              className="absolute bg-white rounded-full h-6"
              initial={false}
              animate={getActiveStyles()}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
              style={{ left: 4 }}
            />
            <span
              ref={roleRef}
              className={`relative z-10 px-3 py-1 text-sm font-medium transition-colors ${
                isAsk ? "text-gray-400" : "text-gray-800"
              }`}
            >
              Role playing
            </span>
            <span
              ref={askRef}
              className={`relative z-10 px-3 py-1 text-sm font-medium transition-colors ${
                !isAsk ? "text-gray-400" : "text-gray-800"
              }`}
            >
              Ask
            </span>
          </div>
        }
        rightIcon={
          isReport ? (
            <HomeIcon onClick={() => router.push("/main")} />
          ) : isChatRoom || isAsk ? (
            <div ref={toggleBtnRef}>
              <SqurepenIcon onClick={() => setOpen((prev) => !prev)} />
            </div>
          ) : (
            ""
          )
        }
      />
      <Tab />
      {open && (
        <div
          ref={dropdownRef}
          className="p-3 rounded-xl bg-white flex flex-col gap-1 absolute right-5 top-16 z-50"
        >
          <button className="p-2 flex gap-2" onClick={handleToggle}>
            <Sparkles />
            New Chat
          </button>
          <button
            className="p-2 flex gap-2"
            onClick={!isAsk ? handleEnd : () => setOpen((prev) => !prev)}
          >
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
