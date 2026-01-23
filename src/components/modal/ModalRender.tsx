"use client";

import { useModalStore } from "@/store/modal/useModalStore";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

export default function ModalRender() {
  const { isOpen, content } = useModalStore();
  const { closeModal } = useModalStore((s) => s.actions);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60"
            onClick={closeModal}
          />

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 300,
            }}
            className="absolute bottom-0 w-full md:max-w-93.75 bg-white rounded-t-[50px] "
          >
            <X
              className="absolute top-4 right-8 text-gray-500 cursor-pointer"
              onClick={closeModal}
            />

            {content}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
