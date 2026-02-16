"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  usePreviewRemove,
  usePreviewSend,
  usePreviewStart,
} from "@/hooks/mutations/";
import { ChatInput, ChatLoading, Header } from "../common";
import { Earth, Info, Megaphone, Menu, RotateCcw, Volume2 } from "lucide-react";

import { useRouter } from "next/navigation";
import { usePreviewHint } from "@/hooks/queries/usePreviewHint";
import { PreviewModal } from "../modal";

interface AiMessage {
  content: string;
  hiddenMeaning: string;
  isRevealed: boolean;
}

export default function PreviewChat() {
  const { data, mutate, isPending } = usePreviewStart();
  const { data: hintData } = usePreviewHint(data?.session_id);
  const [message, setMessage] = useState("");
  const [userMessages, setUserMessages] = useState<string[]>([]);
  const [aiResponses, setAiResponses] = useState<AiMessage[]>([]);
  const [firstHiddenMessage, setFirstHiddenMessage] = useState(false);
  const [showHintPanel, setShowHintPanel] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const router = useRouter();

  const handleChunk = useCallback((chunk: string) => {
    setAiResponses((prev) => {
      const newResponses = [...prev];
      if (newResponses.length > 0) {
        newResponses[newResponses.length - 1].content = chunk;
      }
      return newResponses;
    });
  }, []);

  const { mutate: sendMessage } = usePreviewSend(handleChunk);
  const { mutate: removePreview } = usePreviewRemove();
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    mutate();
  }, [mutate]);

  const handleSend = () => {
    if (!data?.session_id || !message.trim()) return;

    setUserMessages((prev) => [...prev, message]);

    setAiResponses((prev) => [
      ...prev,
      { content: "", hiddenMeaning: "", isRevealed: false },
    ]);

    sendMessage(
      { sessionId: data.session_id, userMessage: message },
      {
        onSuccess: (res) => {
          setAiResponses((prev) => {
            const newResponses = [...prev];
            newResponses[newResponses.length - 1].hiddenMeaning =
              res.ai_hidden_meaning;
            return newResponses;
          });
          if (res.is_preview_ended) {
            removePreview(data.session_id);
            setShowPreviewModal(true);
          }
        },
        onError: (error) => {
          if (error.message.includes("429")) {
            removePreview(data.session_id);
            router.push("/preview/end");
          }
        },
      },
    );
    setMessage("");
  };

  const toggleReveal = (idx: number) => {
    setAiResponses((prev) =>
      prev.map((msg, i) =>
        i === idx ? { ...msg, isRevealed: !msg.isRevealed } : msg,
      ),
    );
  };
  const handleMoveAuth = () => {
    router.push("/preview/end");
  };
  const handleHiddenMessage = () => {
    setFirstHiddenMessage((prev) => !prev);
  };
  return (
    <div className="min-h-screen px-5 pb-30">
      <Header
        leftIcon={<Menu />}
        center="RolePlay Preview"
        rightIcon="Skip"
        className="text-gray-600 font-medium"
        onRightClick={handleMoveAuth}
      />

      {isPending ? (
        <ChatLoading />
      ) : (
        <>
          <div className="border-y border-white px-5 py-3 flex gap-4 bg-white/50 -mx-5 mb-4">
            <Megaphone className="text-gray-600 shrink-0" />
            <span className="text-sm font-medium text-gray-600">
              {data?.scenario.description}
            </span>
          </div>
          {/* 첫 AI 메세지  */}
          <div className="flex gap-2 mb-1">
            <div className="size-8 rounded-full shrink-0 bg-gray-300 flex items-center justify-center">
              <span>{data?.ai_name[0]}</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-gray-600">
                {data?.ai_name}
              </span>
              <div className="flex flex-col gap-2 rounded-tr-xl rounded-b-xl p-4 border border-gray-300 bg-white mb-8">
                <div>
                  <p className="text-sm whitespace-pre-wrap my-1">
                    {data?.ai_message}
                  </p>
                </div>
                <div className="pt-2.5 border-t border-gray-200 flex justify-between">
                  <div className="flex gap-2">
                    <Volume2 />
                    <Earth />
                  </div>
                  <button
                    onClick={handleHiddenMessage}
                    className="border-gradient-primary rounded-full px-2 py-1"
                  >
                    👀{" "}
                    <span className="text-gradient-primary text-xs font-semibold">
                      Really mean
                    </span>
                  </button>
                </div>
                {firstHiddenMessage && <span>{data?.ai_hidden_meaning}</span>}
              </div>
            </div>
          </div>

          {/* 대화 히스토리 */}
          {userMessages.map((userMsg, idx) => (
            <div key={idx} className="justify-end">
              <div className="flex justify-end mb-8 flex-col items-end gap-2">
                <span>{data?.my_name}</span>
                <div className="flex flex-col gap-2 rounded-tl-xl rounded-b-xl p-4 border border-gray-300 bg-white w-61">
                  <p className="text-sm whitespace-pre-wrap my-1">{userMsg}</p>
                  <div className="pt-2.5 border-t border-gray-200 flex justify-between">
                    <button className="flex rounded-full border border-blue-500 px-2 py-1 gap-1 text-blue-500">
                      <Info />
                      <span className=" text-sm pt-1">View feedback</span>
                    </button>
                    <RotateCcw size={20} />
                  </div>
                </div>
              </div>

              {/* AI 메세지*/}
              {aiResponses[idx] && (
                <div className="flex gap-2 mb-1">
                  <div className="size-8 rounded-full shrink-0 bg-gray-300" />
                  <div className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-gray-600">
                      {data?.ai_name}
                    </span>
                    <div className="flex flex-col gap-2 rounded-tr-xl rounded-b-xl p-4 border border-gray-300 bg-white mb-8">
                      <p className="text-sm  my-1">
                        {aiResponses[idx].content || "..."}
                      </p>
                      <div className="flex justify-between pt-3 border-t border-gray-200">
                        <div className="flex gap-2">
                          <Volume2 />
                          <Earth />
                        </div>
                        <button
                          onClick={() => toggleReveal(idx)}
                          className="border-gradient-primary rounded-full px-2 py-1"
                        >
                          👀{" "}
                          <span className="text-gradient-primary text-xs font-semibold">
                            Really mean
                          </span>
                        </button>
                      </div>

                      {aiResponses[idx].isRevealed &&
                        aiResponses[idx].hiddenMeaning && (
                          <p className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3 mt-1">
                            {aiResponses[idx].hiddenMeaning}
                          </p>
                        )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </>
      )}
      {showHintPanel && hintData && (
        <div className="fixed bottom-34 left-5 right-5 z-50 flex flex-col gap-2">
          {hintData.hints.map((h, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-gray-100 px-4 py-3 shadow-sm"
            >
              <p className="text-sm text-gray-700">{h}</p>
            </div>
          ))}
        </div>
      )}
      {/* 남은 턴수 */}
      <div className="text-white px-5 py-2.5 flex gap-2.5 items-center justify-center bg-gray-800/50 fixed bottom-34 left-1/2 -translate-x-1/2 w-full max-w-83.75 rounded-xl z-40">
        <Info />
        <span className=" text-sm">
          They`re waiting for your reply! ({aiResponses.length}/2)
        </span>
      </div>
      <ChatInput
        message={message}
        setMessage={setMessage}
        onSend={handleSend}
        onHintClick={() => setShowHintPanel((prev) => !prev)}
        showHint={true}
        showSituation={true}
        isHintActive={showHintPanel}
      />
      <PreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
      />
    </div>
  );
}
