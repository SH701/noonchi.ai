/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import PersonaSlider from "@/components/bothistory/PersonaSlider";

import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";

import InProgressIcon from "@/components/etc/Inprogress";
import DoneIcon from "@/components/etc/Done";

import {
  useConversations,
  useDeleteConversation,
} from "@/hooks/useConversations";
import { useChatHistoryStore } from "@/store/useChatHistorystore";
import { useAuthStore } from "@/store/auth";

import { Conversation } from "@/types/conversation";
import LoginModal from "@/components/etc/LoginModal";
import PersonaDetailModal from "@/components/persona/PersonaDetail";
import Filter from "@/components/bothistory/Filter";
import Sort from "@/components/bothistory/Sort";
import SearchBar from "@/components/bothistory/SearchBar";
import EmptyState from "@/components/bothistory/EmptyState";
import HistorySection from "@/components/bothistory/HistorySection";

const situationOptions = {
  BOSS: [
    { value: "BOSS1", label: "Apologizing for a mistake at work." },
    { value: "BOSS2", label: "Requesting half-day or annual leave" },
    { value: "BOSS3", label: "Requesting feedback on work" },
  ],
  GF_PARENTS: [
    { value: "GF_PARENTS1", label: "Meeting for the first time" },
    { value: "GF_PARENTS2", label: "Asking for permission" },
    { value: "GF_PARENTS3", label: "Discussing future plans" },
  ],
  CLERK: [
    { value: "CLERK1", label: "Making a reservation" },
    { value: "CLERK2", label: "Asking for information" },
    { value: "CLERK3", label: "Filing a complaint" },
  ],
} as const;

const getSituationLabel = (value?: string) => {
  if (!value) return "";
  for (const key in situationOptions) {
    const found = situationOptions[key as keyof typeof situationOptions].find(
      (opt) => opt.value === value
    );
    if (found) return found.label;
  }
  return value;
};

const getName = (name?: string) => (name && name.trim() ? name : "Unknown");
const getImg = (url?: string) => (typeof url === "string" ? url : "");

export default function ChatBothistoryPage() {
  const router = useRouter();
  const accessToken = useAuthStore((s) => s.accessToken);

  const { keyword, sort, selectedFilter, expanded, toggleExpand } =
    useChatHistoryStore();

  const [openDetail, setOpenDetail] = useState(false);
  const [selectedPersonaId, setSelectedPersonaId] = useState<
    number | string | null
  >(null);

  const {
    data: conversations = [],
    isLoading,
    error,
  } = useConversations(accessToken, selectedFilter);

  const deleteMutation = useDeleteConversation(accessToken);

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
    router.push(`/main/custom/chatroom/${conversationId}`);
  };

  const handleDeleteChat = (conversationId: string | number) => {
    deleteMutation.mutate(conversationId);
  };

  // if (!accessToken) {
  //   return <LoginModal isOpen={true} onClose={() => router.push("/login")} />;
  // }
  return (
    <div className="bg-gray-100 w-full flex flex-col pt-10">
      <div className="flex justify-between items-center space-x-2 relative z-10 px-4">
        <h1 className="text-xl font-bold z-10">Chatbot History</h1>
        <SearchBar />
      </div>
      <div className="mb-4 p-6">
        <PersonaSlider
          onAdd={() => router.push("/main/custom")}
          visibleCount={4}
          itemSize={72}
          className="object-cover"
          onItemClick={(_, it) => {
            if ("isAdd" in it) return;
            setSelectedPersonaId(it.personaId);
            setOpenDetail(true);
          }}
        />
      </div>

      <PersonaDetailModal
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        personaId={selectedPersonaId}
        onDeleted={() => {
          setOpenDetail(false);
        }}
      />

      <div className="mb-6 pl-6 pr-0">
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
                const situationLabel = getSituationLabel(
                  (chat as any)?.situation
                );
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
                              className={`flex items-center gap-0.5 text-xs px-1 py-0.5 rounded-full ${
                                chat.status === "ACTIVE"
                                  ? "bg-blue-100 text-blue-600"
                                  : "bg-green-100 text-green-500"
                              }`}
                            >
                              {chat.status === "ACTIVE" ? (
                                <>
                                  <InProgressIcon className="w-4 h-4" />
                                  <span className="pb-0.5">In progress</span>
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
                            {situationLabel || desc}
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
                      onOpenChat={() => handleOpenChat}
                      onDelete={() => handleDeleteChat}
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
