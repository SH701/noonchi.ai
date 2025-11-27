import { AnimatePresence, motion } from "framer-motion";
import FeedbackSection from "@/components/bothistory/Feedbacksections";

interface SectionProps {
  isOpen: boolean;
  status: "ACTIVE" | "ENDED";
  conversationId: string | number;
  onOpenChat: () => void;
  onDelete: () => void;
}

export default function HistorySection({
  isOpen,
  status,
  conversationId,
  onOpenChat,
  onDelete,
}: SectionProps) {
  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          {status === "ACTIVE" ? (
            <div className="px-3 flex gap-2 items-center justify-center bg-[#F3F4F6] h-[83px]">
              <button
                onClick={onOpenChat}
                className="w-25 h-9 py-2 bg-blue-600 text-white rounded-xl cursor-pointer"
              >
                <p className="text-xs">Open Chat</p>
              </button>
              <button
                onClick={onDelete}
                className="w-25 h-9 py-2 bg-gray-300 text-gray-700 rounded-xl cursor-pointer"
              >
                <p className="text-xs">Delete</p>
              </button>
            </div>
          ) : (
            <FeedbackSection id={conversationId} />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
