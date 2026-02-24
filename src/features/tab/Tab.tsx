"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";

import { useTabStore } from "@/store/tab/useTabStore";
import { SearchBar } from "../../components/common";
import RoleplayHistoryTab from "./RoleplayHistoryTab";
import AskHistoryTab from "./AskHistoryTab";
import { PeopleIcon } from "@/assets/svgr";

const slideVariants = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1 },
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
          <div
            className="fixed inset-0 z-9998 bg-black/60 flex items-center justify-center"
            onClick={closeTab}
          />
          <motion.div
            key="tab"
            className="fixed left-1/2 top-0 z-9999 h-full w-70 -translate-x-2/3 origin-left bg-gradient-primary pt-15"
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
              <div className="flex flex-col flex-1 px-5 min-h-0">
                <div className="flex flex-col gap-5 mb-5 shrink-0">
                  {" "}
                  <SearchBar />
                  <button
                    className="flex gap-2 cursor-pointer"
                    onClick={handleCoach}
                  >
                    <PeopleIcon />
                    <span className="text-sm pt-1">Live 1:1 Coaching</span>
                  </button>
                </div>

                <div className="flex-1  min-h-0  custom-scrollbar">
                  <RoleplayHistoryTab />
                  <AskHistoryTab />
                </div>
              </div>

              <button
                onClick={handleProfileClick}
                className="flex gap-4 bg-white p-4 w-70 z-9999"
              >
                {session?.user.profileImageUrl ? (
                  <Image
                    src={session?.user.profileImageUrl ?? ""}
                    alt="profile"
                    width={48}
                    height={48}
                    className="rounded-full shrink-0"
                  />
                ) : (
                  <div className="size-12 rounded-full bg-gray-400 shrink-0" />
                )}
                <span className=" pt-3">{session?.user.name}</span>
              </button>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
