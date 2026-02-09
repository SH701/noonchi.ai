"use client";

import { useEffect, useRef, useState } from "react";
import { ChatInput } from "../common";
import { Button } from "@/components/ui/button/button";
import { useAsk } from "@/hooks/mutations/conversation/useAsk";
import { useAskMessages } from "@/hooks/mutations/messages/useAskMessages";
import { Spinner } from "../ui/spinner";
import AskChatroom from "./AskChatroom";

type Step = "askTarget" | "closeness" | "situation" | "chat";

const STEPS: Step[] = ["askTarget", "closeness", "situation", "chat"];

const CLOSENESS_OPTIONS = [
  { label: "Casual", value: "casual" },
  { label: "Friendly", value: "friendly" },
  { label: "Professional", value: "professional" },
  { label: "Formal", value: "formal" },
] as const;

const STEP_QUESTIONS: Record<string, string> = {
  askTarget: "Who is this for?",
  closeness: "How close are you with them?",
  situation: "What do you want to say?",
};

export default function AskInfo() {
  const [step, setStep] = useState<Step>("askTarget");
  const [message, setMessage] = useState("");
  const [askTarget, setAskTarget] = useState("");
  const [closeness, setCloseness] = useState("");
  const [situation, setSituation] = useState("");
  const [conversationId, setConversationId] = useState<number>();
  const { mutate: createAsk, isPending } = useAsk();
  const {
    messages,
    sendMessage,
    feedbackOpenId,
    handleFeedbacks,
    isAIResponding,
  } = useAskMessages(conversationId);

  const bottomRef = useRef<HTMLDivElement>(null);

  const currentStepIdx = STEPS.indexOf(step);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, step]);

  const handleSendTarget = () => {
    if (!message.trim()) return;
    setAskTarget(message.trim());
    setMessage("");
    setStep("closeness");
  };

  const handleSelectCloseness = (value: string) => {
    setCloseness(value);
    setMessage("");
    setStep("situation");
  };

  const handleSendSituation = () => {
    if (!message.trim() || isPending || conversationId) return;
    setSituation(message.trim());
    createAsk(
      {
        askTarget,
        closeness,
        situation: message.trim(),
      },
      {
        onSuccess: (data) => {
          setConversationId(data.conversationId);
          setStep("chat");
        },
      },
    );
    setMessage("");
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !conversationId) return;
    await sendMessage(message.trim());
    setMessage("");
  };

  return (
    <div className="flex flex-col flex-1 overflow-y-auto pb-32">
      {/* 타겟 */}
      <div className="flex flex-col mb-6">
        <span className="text-xl font-semibold">
          {STEP_QUESTIONS.askTarget}
        </span>
        <span className="text-gray-600">
          This can be something you`re <br /> about to say or do
        </span>
        {askTarget && (
          <div className="flex justify-end mt-2">
            <div className="flex flex-col gap-2 rounded-tl-xl rounded-b-xl p-4 border border-gray-300 bg-white w-61">
              <p className="text-sm">{askTarget}</p>
            </div>
          </div>
        )}
        {step === "askTarget" && (
          <ChatInput
            message={message}
            setMessage={setMessage}
            onSend={handleSendTarget}
            placeholder="Type your answer..."
          />
        )}
      </div>

      {/* 가까움 정도 */}
      {currentStepIdx >= 1 && (
        <div className="flex flex-col gap-2 mb-6">
          <span className="text-xl font-semibold">
            {STEP_QUESTIONS.closeness}
          </span>
          <span className="text-gray-600">
            This helps me understand the right tone
          </span>
          {closeness ? (
            <div className="flex justify-end mt-2">
              <div className="rounded-tl-xl rounded-b-xl p-4 border border-gray-300 bg-white">
                <p className="text-sm">
                  {CLOSENESS_OPTIONS.find((o) => o.value === closeness)
                    ?.label ?? closeness}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3 mt-4">
              {CLOSENESS_OPTIONS.map((option) => (
                <Button
                  key={option.value}
                  variant="outline"
                  size="lg"
                  onClick={() => handleSelectCloseness(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 상황 */}
      {currentStepIdx >= 2 && (
        <div className="flex flex-col mb-6">
          <span className="text-xl font-semibold">
            {STEP_QUESTIONS.situation}
          </span>
          <span className="text-gray-600">
            Describe the situation or what you want to express
          </span>
          {situation && (
            <div className="flex justify-end mt-2">
              <div className="rounded-tl-xl rounded-b-xl p-4 border border-gray-300 bg-white">
                <p className="text-sm">{situation}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 로딩 */}
      {isPending && (
        <div className="flex flex-col gap-2 justify-center items-center pt-4">
          <Spinner />
          <span>Processing AI...</span>
        </div>
      )}

      {/* 채팅 영역 */}
      {conversationId && (
        <AskChatroom
          messages={messages}
          feedbackOpenId={feedbackOpenId}
          handleFeedbacks={handleFeedbacks}
        />
      )}
      {isAIResponding && (
        <div className="flex flex-col gap-2 justify-center items-center pt-4">
          <Spinner />
          <span>Processing AI...</span>
        </div>
      )}

      <div ref={bottomRef} />

      
      {step === "situation"  && (
        <ChatInput
          message={message}
          setMessage={setMessage}
          onSend={handleSendSituation}
          placeholder="Type your answer..."
        />
      )}
      {step === "chat" && (
        <ChatInput
          message={message}
          setMessage={setMessage}
          onSend={handleSendMessage}
          disabled={isAIResponding}
          placeholder="Type your message..."
        />
      )}
    </div>
  );
}
