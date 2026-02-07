"use client";

import { AnimatePresence, motion } from "framer-motion";

type InfoProps = {
  isOpen: boolean;
  onClose: () => void;
  companyName: string;
  jobTitle: string;
  interviewStyle: string;
};

export default function ChatRoomInfo({
  isOpen,
  onClose,
  companyName,
  jobTitle,
  interviewStyle,
}: InfoProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/60 z-50"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 z-50 shadow-xl max-w-125 mx-auto"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{
              type: "spring",
              damping: 25,
            }}
          >
            <div className="w-full flex justify-center mb-4">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Interview Info
            </h3>

            <div className="space-y-3 text-gray-700">
              <div>
                <p className="text-sm text-gray-500">Company</p>
                <p className="text-base font-medium">{companyName}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Job Title</p>
                <p className="text-base font-medium">{jobTitle}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Interview Style</p>
                <p className="text-base font-medium">{interviewStyle}</p>
              </div>
            </div>

            <button
              className="mt-6 w-full py-3 rounded-lg bg-gray-900 text-white font-semibold"
              onClick={onClose}
            >
              Close
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
