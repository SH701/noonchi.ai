/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import {
  useConversations,
  useDeleteConversation,
} from "@/hooks/conversation/useConversations";
import { useChatHistoryStore } from "@/store/useChatHistorystore";

import { Conversation } from "@/types/conversation";

import {
  EmptyState,
  Filter,
  HistorySection,
  SearchBar,
  Sort,
} from "@/components/bothistory";
import { InprogressIcon, DoneIcon } from "@/components/ui/icon";
import { useQueryClient } from "@tanstack/react-query";

const getName = (name?: string) => (name && name.trim() ? name : "Unknown");
const getImg = (url?: string) => (typeof url === "string" ? url : "");

export default function ChatBothistoryPage() {
  const router = useRouter();

  const { keyword, sort, selectedFilter, expanded, toggleExpand } =
    useChatHistoryStore();
  const queryClient = useQueryClient();
  const {
    data: conversations = [],
    isLoading,
    error,
  } = useConversations(selectedFilter);

  const deleteMutation = useDeleteConversation();

  const filteredConversations = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) return conversations;

    return conversations.filter((c) =>
      (c.aiPersona?.name ?? "").toLowerCase().includes(q)
    );
  }, [keyword, conversations]);

  const sortedHistory = useMemo(() => {
    const base = [...filteredConversations];
    return base.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sort === "asc" ? dateA - dateB : dateB - dateA;
    });
  }, [filteredConversations, sort]);

  const handleOpenChat = (conversationId: string | number) => {
    router.push(`/main/chatroom/${conversationId}`);
  };

  const handleDeleteChat = (conversationId: string | number) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      deleteMutation.mutate(conversationId, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["conversations", "history", selectedFilter],
          });
        },
        onError: (error) => {
          console.error("❌ Delete error:", error);
        },
      });
    }
  };

  return (
    <div className="bg-gray-100 w-full flex flex-col pt-12">
      <div className="flex justify-between items-center space-x-2 relative z-10 px-4">
        <h1 className="text-xl font-bold z-10">Chatbot History</h1>
        <SearchBar />
      </div>

      <div className="my-6 pl-6">
        <div className="flex items-center justify-between">
          <Filter />
          <Sort />
        </div>
      </div>

      <div className="flex-1 pb-24 bg-white pt-2 border-t border-gray-400">
        <div className="space-y-2">
          {isLoading ? (
            <div className="flex items-center justify-center h-full py-30">
              <p>Loading...</p>
            </div>
          ) : (
            <>
              {error && (
                <p className="text-red-500">
                  {(error as Error).message ?? "Error"}
                </p>
              )}

              {conversations.length === 0 && !isLoading && !error && (
                <EmptyState type="no-history" />
              )}

              {conversations.length > 0 &&
                filteredConversations.length === 0 && (
                  <div className="flex flex-col items-center justify-center mt-10">
                    <p className="text-gray-400">No search results.</p>
                  </div>
                )}

              {sortedHistory.map((chat: Conversation) => {
                const name = getName(chat?.aiPersona?.name);
                const desc = chat?.aiPersona?.description ?? "";
                const img = getImg(chat?.aiPersona?.profileImageUrl);

                const isOpen = expanded[chat.conversationId];

                return (
                  <div
                    key={chat.conversationId}
                    className="border-b border-gray-400"
                  >
                    <div
                      className="flex items-center justify-between p-3 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => toggleExpand(chat.conversationId)}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative">
                          {img ? (
                            <Image
                              src={img}
                              width={48}
                              height={48}
                              alt={name}
                              className="w-12 h-12 rounded-full bg-gray-200 object-cover"
                              unoptimized
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center shadow-sm">
                              <span className="text-gray-600 font-semibold text-sm">
                                {name?.[0] ?? "?"}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-black text-base truncate">
                              {name}
                            </h3>
                            <span
                              className={`flex items-center  gap-0.5 text-xs px-1 py-0.5 rounded-full ${
                                chat.status === "ACTIVE"
                                  ? "bg-blue-100 text-blue-600"
                                  : "bg-green-100 text-green-500"
                              }`}
                            >
                              {chat.status === "ACTIVE" ? (
                                <>
                                  <InprogressIcon className="w-4 h-4" />
                                  <span className="pb-0.5">Inprogress</span>
                                </>
                              ) : (
                                <>
                                  <DoneIcon className="w-4 h-4" />
                                  <span className="pb-0.5">Done</span>
                                </>
                              )}
                            </span>
                          </div>
                          <p className="text-[13px] text-gray-600 truncate">
                            {desc}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-black flex-col">
                        <span className="flex text-xs gap-1 text-gray-400">
                          <span>
                            {new Date(chat.createdAt).toLocaleDateString(
                              "en-US",
                              { month: "short" }
                            )}
                          </span>
                          <span>
                            {new Date(chat.createdAt).toLocaleDateString(
                              "en-US",
                              { day: "numeric" }
                            )}
                          </span>
                        </span>
                        <span>
                          {isOpen ? (
                            <ChevronUpIcon className="size-4 " />
                          ) : (
                            <ChevronDownIcon className="size-4" />
                          )}
                        </span>
                      </div>
                    </div>

                    <HistorySection
                      isOpen={isOpen}
                      status={chat.status as "ACTIVE" | "ENDED"}
                      conversationId={chat.conversationId}
                      onOpenChat={() => handleOpenChat(chat.conversationId)}
                      onDelete={() => handleDeleteChat(chat.conversationId)}
                    />
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
