"use client";

import { Menu, SquarePen } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function Header() {
  const [open, setOpen] = useState(false);

  const askRef = useRef<HTMLSpanElement>(null);
  const roleRef = useRef<HTMLSpanElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const [, forceUpdate] = useState(0);
  const isRoleplay = pathname.startsWith("/main/roleplay");

  useEffect(() => {
    requestAnimationFrame(() => {
      forceUpdate((n) => n + 1);
    });
  }, [pathname]);

  const handleOpen = () => {
    setOpen((prev) => !prev);
  };

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
  return (
    <div className="w-full py-8   flex justify-between cursor-pointer">
      <Menu onClick={handleOpen} />
      {open && <div>1</div>}

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
          ref={askRef}
          className={`relative z-10 px-3 py-1 text-sm font-medium transition-colors ${
            !isRoleplay ? "text-gray-800" : "text-gray-400"
          }`}
        >
          Ask
        </span>
        <span
          ref={roleRef}
          className={`relative z-10 px-3 py-1 text-sm font-medium transition-colors ${
            isRoleplay ? "text-gray-800" : "text-gray-400"
          }`}
        >
          Role playing
        </span>
      </div>
      <SquarePen />
    </div>
  );
}
