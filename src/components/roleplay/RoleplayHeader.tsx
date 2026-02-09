"use client";

import { Menu, MessageCircle, Sparkles, SquarePen } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTabStore } from "@/store/tab/useTabStore";
import Tab from "../tab/Tab";
import Header from "../common/Header";
import { useConversationEnd } from "@/hooks/mutations";

export default function RoleplayHeader() {
  const { toggleTab, closeTab } = useTabStore();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const askRef = useRef<HTMLSpanElement>(null);
  const roleRef = useRef<HTMLSpanElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const [, forceUpdate] = useState(0);
  const isRoleplay = pathname.startsWith("/main/roleplay");
  const { mutate: conversationEnd } = useConversationEnd();

  const roomId = pathname.split("/").pop();

  useEffect(() => {
    requestAnimationFrame(() => {
      forceUpdate((n) => n + 1);
    });
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, closeTab]);

  const getActiveStyles = () => {
    const activeRef = isRoleplay ? roleRef : askRef;
    if (!activeRef.current) return { width: 40, x: 0 };
    return {
      width: activeRef.current.offsetWidth,
      x: activeRef.current.offsetLeft - 4,
    };
  };

  const handleToggle = () => {
    if (!isRoleplay) {
      router.push("/main/roleplay");
    } else {
      router.push("/main/ask");
    }
  };
  const handleExit = () => {
    setOpen(!open);
  };
  const handleEnd = () => {
    try {
      conversationEnd(Number(roomId));

      router.push(`/main/roleplay/chatroom/${roomId}/result`);
    } catch (error) {
      console.error("처리 중 오류 발생:", error);
    }
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
          isRoleplay ? "text-gray-800" : "text-gray-400"
        }`}
      >
        Role playing
      </span>
      <span
        ref={askRef}
        className={`relative z-10 px-3 py-1 text-sm font-medium transition-colors ${
          !isRoleplay ? "text-gray-800" : "text-gray-400"
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
        rightIcon={isRoleplay ? <SquarePen onClick={handleExit} /> : undefined}
      />
      <Tab />
      {open && (
        <div
          ref={dropdownRef}
          className="p-3 rounded-xl bg-white flex flex-col gap-1 absolute right-5 top-16 z-50"
        >
          <button className="p-2 flex gap-2">
            <Sparkles />
            New Chat
          </button>
          <button className="p-2 flex gap-2" onClick={handleEnd}>
            <MessageCircle />
            Get Reports
          </button>
        </div>
      )}
    </>
  );
}
