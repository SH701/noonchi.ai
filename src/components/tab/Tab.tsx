"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";

import { useTabStore } from "@/store/tab/useTabStore";
import { SearchBar } from "../common";
import { Users } from "lucide-react";
import RoleplayHistoryTab from "./RoleplayHistoryTab";
import AskHistoryTab from "./AskHistoryTab";

const slideVariants = {
  hidden: { width: 0 },
  visible: { width: "75%" },
};

const fadeVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export default function Tab() {
  const router = useRouter();
  const { data: session } = useSession();
  const { isOpen, closeTab } = useTabStore();

  const handleProfileClick = () => router.push("/profile");
  const handleCoach = () => {
    router.push("/coach");
  };
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/60" onClick={closeTab} />
          <motion.div
            key="tab"
            className="absolute left-0 top-0 z-50 h-full w-[75%] bg-gradient-primary pt-15 "
            variants={slideVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="flex h-full flex-col"
              variants={fadeVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ duration: 0.15 }}
            >
              <div className="px-5">
                <div className="flex flex-col gap-5 mb-5">
                  <SearchBar />
                  <button
                    className="flex gap-2 cursor-pointer"
                    onClick={handleCoach}
                  >
                    <Users />
                    <span className="text-sm pt-1">Live 1:1 Coaching</span>
                  </button>
                </div>
                <RoleplayHistoryTab />
                <AskHistoryTab />
              </div>
              <button
                onClick={handleProfileClick}
                className="flex mt-auto gap-4 bg-gray-700 p-4"
              >
                {session?.user.profileImageUrl ? (
                  <Image
                    src={session?.user.profileImageUrl ?? ""}
                    alt="profile"
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                ) : (
                  <div className="size-12 rounded-full bg-gray-400" />
                )}

                <span className="text-white pt-3">{session?.user.name}</span>
              </button>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
