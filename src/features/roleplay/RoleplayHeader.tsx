"use client";

import { MessageCircle, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
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
  const isValidRoom = isChatRoom && roomId && !isNaN(roomId);
  const { data: detailData } = useConversationDetail(roomId ?? 0, {
    enabled: !!isValidRoom,
  });
  const { mutate: conversationEnd } = useConversationEnd(roomId ?? 0);
  const canGetReport = detailData?.canGetReport;
  const [showExitModal, setShowExitModal] = useState(false);
  const isReport = pathname.startsWith(
    `/main/roleplay/chatroom/${roomId}/result`,
  );
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
      conversationEnd();
      router.push(`/main/roleplay/chatroom/${roomId}/result`);
    } else {
      setShowExitModal(true);
    }
    setOpen(false);
  };
  const handleHome = () => {
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
        leftIcon={<HamburgerIcon onClick={toggleTab} />}
        center={ToggleSwitch}
        rightIcon={
          isReport ? (
            <HomeIcon onClick={handleHome} />
          ) : isChatRoom || isAsk ? (
            <div ref={toggleBtnRef}>
              <SqurepenIcon onClick={handleOpen} />
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
