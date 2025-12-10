"use client";

import { Conversation } from "@/types/conversation";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";

interface Props {
  chat: Conversation;
  isOpen: boolean;
  onToggle: () => void;
  onOpenChat: () => void;
  onDeleteChat: () => void;
}

export default function ConversationRow({ chat, isOpen, onToggle }: Props) {
  return (
    <div className="border-b border-gray-300">
      <div
        className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center font-semibold">
            <p className="text-xl">{chat.aiPersona?.name?.[0] ?? "?"}</p>
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base truncate">
                {chat.aiPersona?.name ?? "Unknown"}
              </h3>

              <span
                className={`
                  flex items-center gap-1 text-xs px-2 py-0.5 rounded-full
                  ${
                    chat.status === "ACTIVE"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-green-100 text-green-600"
                  }
                `}
              >
                {chat.status === "ACTIVE" ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    Inprogress
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    Done
                  </>
                )}
              </span>
            </div>

            <p className="text-xs text-gray-500 truncate">
              {chat.aiPersona?.description ?? ""}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end text-right text-gray-500">
          <span className="text-xs">
            {new Date(chat.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>

          <span>
            {isOpen ? (
              <ChevronUpIcon className="size-4 text-black" />
            ) : (
              <ChevronDownIcon className="size-4 text-black" />
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
