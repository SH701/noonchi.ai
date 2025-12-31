"use client";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useConversations, useDeleteConversation } from "@/hooks/queries";
import { useChatHistoryStore } from "@/store/useChatHistorystore";

import {
  HistorySection,
  ConversationRow,
  EmptyState,
  Filter,
  SearchBar,
  Sort,
} from "@/components/bothistory";

import { useQueryClient } from "@tanstack/react-query";

export default function ChatBothistoryPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { keyword, sort, selectedFilter, expanded, toggleExpand } =
    useChatHistoryStore();

  const {
    data: conversations = [],
    isLoading,
    error,
  } = useConversations(selectedFilter);

  const deleteMutation = useDeleteConversation();

  const handleOpenChat = useCallback(
    (id: string | number) => router.push(`/main/chatroom/${id}`),
    [router]
  );

  const handleDeleteChat = useCallback(
    (id: string | number) => {
      if (!confirm("정말 삭제하시겠습니까?")) return;

      deleteMutation.mutate(id, {
        onSuccess: () => {
          queryClient.refetchQueries({
            queryKey: ["conversations", "history", selectedFilter],
          });
        },
        onError: (error) => console.error("❌ Delete error:", error),
      });
    },
    [deleteMutation, queryClient, selectedFilter]
  );

  const handleToggle = useCallback(
    (id: string | number) => toggleExpand(id),
    [toggleExpand]
  );

  const processedData = useMemo(() => {
    let list = [...conversations];

    if (keyword.trim()) {
      const q = keyword.trim().toLowerCase();
      list = list.filter((c) =>
        (c.aiPersona?.name ?? "").toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();
      return sort === "asc" ? timeA - timeB : timeB - timeA;
    });

    return list;
  }, [keyword, sort, conversations]);

  return (
    <div className="bg-gray-100 w-full flex flex-col pt-12">
      <header className="flex justify-between items-center px-4">
        <h1 className="text-xl font-bold">Chatbot History</h1>
        <SearchBar />
      </header>

      <section className="my-6 pl-6">
        <div className="flex items-center justify-between">
          <Filter />
          <Sort />
        </div>
      </section>
      <main className="flex-1 pb-24 bg-white pt-2 border-t border-gray-400 space-y-2">
        {isLoading ? (
          <div className="flex items-center justify-center py-30">
            <p>Loading...</p>
          </div>
        ) : error ? (
          <p className="text-red-500">{(error as Error).message}</p>
        ) : conversations.length === 0 ? (
          <EmptyState type="no-history" />
        ) : processedData.length === 0 ? (
          <EmptyState type="no-results" />
        ) : (
          processedData.map((chat) => {
            const isOpen = expanded[chat.conversationId];

            return (
              <div key={chat.conversationId}>
                <ConversationRow
                  chat={chat}
                  isOpen={isOpen}
                  onToggle={() => handleToggle(chat.conversationId)}
                />

                <HistorySection
                  isOpen={isOpen}
                  status={chat.status as "ACTIVE" | "ENDED"}
                  conversationId={chat.conversationId}
                  onOpenChat={() => handleOpenChat(chat.conversationId)}
                  onDelete={() => handleDeleteChat(chat.conversationId)}
                />
              </div>
            );
          })
        )}
      </main>
    </div>
  );
}
