"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePreviewSend, usePreviewStart } from "@/hooks/mutations/";
import { ChatInput, Header } from "../common";
import { Earth, Menu, RotateCcw, SquarePen, Volume2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface AiMessage {
  content: string;
  hiddenMeaning: string;
  isRevealed: boolean;
}

export default function PreviewChat() {
  const { data, mutate, isPending } = usePreviewStart();
  const [message, setMessage] = useState("");
  const [userMessages, setUserMessages] = useState<string[]>([]);
  const [aiResponses, setAiResponses] = useState<AiMessage[]>([]);
  const [isPreviewEnded, setIsPreviewEnded] = useState(false);
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
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    mutate();
  }, [mutate]);

  const handleSend = () => {
    if (!data?.session_id || !message.trim()) return;

    setUserMessages((prev) => [...prev, message]);

    // 전송 시작할 때 빈 주머니(객체)를 배열에 미리 하나 추가합니다.
    setAiResponses((prev) => [
      ...prev,
      { content: "", hiddenMeaning: "", isRevealed: false },
    ]);

    sendMessage(
      { sessionId: data.session_id, userMessage: message },
      {
        onSuccess: (res) => {
          // 완료되면 마지막 주머니에 hiddenMeaning을 채워줍니다.
          setAiResponses((prev) => {
            const newResponses = [...prev];
            newResponses[newResponses.length - 1].hiddenMeaning =
              res.ai_hidden_meaning;
            return newResponses;
          });
          setIsPreviewEnded(res.is_preview_ended);
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

  useEffect(() => {
    if (isPreviewEnded) router.push("/preview/end");
  }, [isPreviewEnded, router]);

  return (
    <div className="min-h-screen px-5 pb-30">
      <Header leftIcon={<Menu />} center="RolePlay" rightIcon={<SquarePen />} />
      {isPending ? (
        <div>loading</div>
      ) : (
        <>
          {/* 첫 AI 메세지  */}
          <div className="flex gap-2 mb-1">
            <div className="size-8 rounded-full shrink-0 bg-gray-300" />
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-gray-600">
                {data?.scenario.ai_role}
              </span>
              <div className="flex flex-col gap-2 rounded-tr-xl rounded-b-xl p-4 border border-gray-300 bg-white mb-8">
                <p className="text-sm whitespace-pre-wrap my-1">
                  {data?.ai_message}
                </p>
              </div>
            </div>
          </div>

          {/* 대화 히스토리 */}
          {userMessages.map((userMsg, idx) => (
            <div key={idx}>
              <div className="flex justify-end mb-8">
                <div className="flex flex-col gap-2 rounded-tl-xl rounded-b-xl p-4 border border-gray-300 bg-white w-61">
                  <p className="text-sm whitespace-pre-wrap my-1">{userMsg}</p>
                  <div className="pt-2.5 border-t border-gray-200 flex justify-between">
                    <button className="flex rounded-full border border-blue-500 px-2 py-1 gap-1">
                      <Image
                        src="/chatroom/warning.png"
                        alt="feedback"
                        width={20}
                        height={20}
                      />
                      <span className="text-blue-500 text-sm">
                        View feedback
                      </span>
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
                      {data?.scenario.ai_role}
                    </span>
                    <div className="flex flex-col gap-2 rounded-tr-xl rounded-b-xl p-4 border border-gray-300 bg-white mb-8">
                      <p className="text-sm whitespace-pre-wrap my-1">
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
      <ChatInput
        message={message}
        setMessage={setMessage}
        onSend={handleSend}
      />
    </div>
  );
}
