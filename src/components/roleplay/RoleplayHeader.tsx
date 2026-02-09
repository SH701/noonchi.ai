"use client";

import { Menu, MessageCircle, Sparkles, SquarePen } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTabStore } from "@/store/tab/useTabStore";
import Tab from "../tab/Tab";
import Header from "../common/Header";
import { useConversationEnd } from "@/hooks/mutations";
import { useConversationDetail } from "@/hooks/queries";
import { ExitChatting } from "../modal";

export default function RoleplayHeader() {
  const { toggleTab } = useTabStore();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const toggleBtnRef = useRef<HTMLDivElement>(null);
  const askRef = useRef<HTMLSpanElement>(null);
  const roleRef = useRef<HTMLSpanElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const [, forceUpdate] = useState(0);
  const isAsk = pathname.startsWith("/main/ask");

  const isChatRoom = pathname.startsWith("/main/roleplay/chatroom/");

  const paths = pathname.split("/");
  const roomIdStr = paths.find((p) => /^\d+$/.test(p));
  const roomId = roomIdStr ? Number(roomIdStr) : null;
  const isValidRoom = isChatRoom && roomId && !isNaN(Number(roomId));
  const { data: detailData } = useConversationDetail(Number(roomId), {
    // 이 옵션이 없으면 조건과 상관없이 무한 호출됩니다!
    enabled: !!isValidRoom,
  });
  const { mutate: conversationEnd } = useConversationEnd(Number(roomId));
  const canGetReport = detailData?.canGetReport;
  const [showExitModal, setShowExitModal] = useState(false);
  useEffect(() => {
    requestAnimationFrame(() => {
      forceUpdate((n) => n + 1);
    });
  }, [pathname]);

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
    if (isAsk) {
      router.push("/main");
    } else {
      router.push("/main/ask");
    }
  };
  const handleOpen = () => {
    setOpen((prev) => !prev);
  };
  const handleEnd = () => {
    if (canGetReport === true) {
      try {
        conversationEnd();
        router.push(`/main/roleplay/chatroom/${roomId}/result`);
      } catch (error) {
        console.error("처리 중 오류 발생:", error);
      }
    } else {
      setShowExitModal(true);
    }
    setOpen(false);
  };
  const handleAsk = () => {
    router.push("/main/ask");
  };
  const handleRoleplay = () => {
    router.push("/main");
  };
  const ToggleSwitch = (
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
  );

  return (
    <>
      <Header
        leftIcon={<Menu onClick={toggleTab} />}
        center={ToggleSwitch}
        rightIcon={
          isChatRoom || isAsk ? (
            <div ref={toggleBtnRef}>
              <SquarePen onClick={handleOpen} />
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
          <button
            className="p-2 flex gap-2"
            onClick={isAsk ? handleAsk : handleRoleplay}
          >
            <Sparkles />
            New Chat
          </button>
          <button
            className="p-2 flex gap-2"
            onClick={!isAsk ? handleEnd : handleOpen}
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
