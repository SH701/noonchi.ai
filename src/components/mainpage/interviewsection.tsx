import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/store/uiStore";

export default function InterviewSection() {
  const sliders = [
    { id: 1, img: "/etc/interview.png" },
    { id: 2, img: "/etc/interview.png" },
    { id: 3, img: "/etc/interview.png" },
  ];

  const setBottomSheetOpen = useUIStore((s) => s.setBottomSheetOpen);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const router = useRouter();

  const handleImageClick = () => {
    const next = !isBottomSheetOpen;
    setIsBottomSheetOpen(next);
    setBottomSheetOpen(next);
  };

  const sharedTransition = {
    type: "spring" as const,
    damping: 25,
    stiffness: 220,
  };

  return (
    <>
      <motion.div
        className="flex flex-col items-center pt-6 pb-4 relative"
        animate={{
          opacity: isBottomSheetOpen ? 0 : 1,
        }}
        transition={sharedTransition}
      >
        <div className="relative w-full flex items-center justify-center overflow-hidden">
          <div className="flex gap-4 px-4 justify-center">
            {sliders.map((s, index) => {
              const isCenter = index === 1;

              if (isCenter) {
                return (
                  <motion.div
                    key={s.id}
                    layoutId="interview-card"
                    onClick={handleImageClick}
                    className="
                      relative w-[288px] h-86 rounded-xl overflow-hidden shadow-lg 
                      cursor-pointer
                    "
                  >
                    <Image
                      src={s.img}
                      alt="사진"
                      fill
                      className="object-cover"
                    />

                    <div className="absolute top-4 left-4 bg-black/20 px-2 py-1 rounded-md text-sm text-white">
                      Career
                    </div>
                    <div className="absolute top-4 right-4 bg-black/20 px-2 py-1 rounded-md text-sm text-white">
                      Best
                    </div>
                    <div className="absolute bottom-13 right-4">
                      <Image
                        src="/etc/Chat.png"
                        alt="사진"
                        width={32}
                        height={32}
                      />
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-[10px] font-semibold text-blue-400">
                        60 Credit
                      </p>
                      <h3 className="text-white text-xl font-semibold pb-2">
                        Interview Coach
                      </h3>
                      <p className="text-gray-300 text-xs">
                        Real Korean interview questions <br /> from your resume.
                      </p>
                    </div>
                  </motion.div>
                );
              }

              return (
                <div
                  key={s.id}
                  className="
                    relative w-[288px] h-86 rounded-xl overflow-hidden shadow-lg 
                    opacity-40
                  "
                >
                  <Image src={s.img} alt="사진" fill className="object-cover" />
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isBottomSheetOpen && (
          <motion.div
            className="fixed inset-0 z-30 bg-white flex flex-col items-center will-change-transform will-change-opacity"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={sharedTransition}
            onClick={handleImageClick}
          >
            <motion.div
              layoutId="interview-card"
              className="relative w-full h-[60vh] md:max-w-93.75"
              transition={sharedTransition}
            >
              <Image
                src={sliders[1].img}
                alt="Interview Coach"
                fill
                className="object-cover"
              />
              <div className="absolute top-4 left-4 bg-black/50 px-3 py-1.5 rounded-lg text-sm text-white">
                Career
              </div>
              <div className="absolute top-4 right-4 bg-black/50 px-3 py-1.5 rounded-lg text-sm text-white">
                Best
              </div>
              <div className="absolute bottom-8 left-6 right-6">
                <p className="text-sm font-semibold text-blue-400 mb-2">
                  60 Credit
                </p>
                <h3 className="text-white text-3xl font-bold mb-3">
                  Interview Coach
                </h3>
                <p className="text-gray-200 text-sm">
                  Real Korean interview questions from your resume.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isBottomSheetOpen && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={sharedTransition}
            className="fixed bottom-0 left-0 right-0 bg-white z-40 p-6 min-h-[10vh] pb-24 rounded-t-3xl"
          >
            <div className="flex-1 overflow-y-auto px-6">
              <div className="mb-6 flex flex-col items-center justify-center">
                <p className="text-blue-600 text-sm font-medium mb-2">
                  Credits Used
                </p>
                <div className="flex items-end gap-1 text-blue-600 font-semibold mb-2">
                  <p className="text-3xl leading-none">100</p>
                  <p className="text-2xl leading-none">credit</p>
                </div>
                <div className="flex items-center bg-gray-100 rounded-4xl px-2.5 py-1.5 gap-2 mb-5">
                  <Image
                    src="/credits/crediticon.png"
                    width={20}
                    height={20}
                    alt="크레딧"
                  />
                  <p className="text-gray-600 font-semibold">Chat</p>
                  <p className="text-blue-600 font-semibold">60</p>
                  <p className="text-gray-600 font-semibold">+ Report</p>
                  <p className="text-blue-600 font-semibold">40</p>
                </div>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => router.push("/main/create/interview")}
                >
                  Start Chatting
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
