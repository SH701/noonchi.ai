"use client";

import { useEffect, useRef, useState } from "react";
import { ChatInput } from "../common";
import { Button } from "@/components/ui/button/button";
import { useAsk } from "@/hooks/mutations/conversation/useAsk";
import { useAskMessages } from "@/hooks/mutations/messages/useAskMessages";
import { Spinner } from "../ui/spinner";
import { Earth, Lightbulb, Volume2 } from "lucide-react";
import { useMessageTranslate, useMessageTTS } from "@/hooks/mutations";

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
  const { data: res, mutate: createAsk, isPending } = useAsk();
  const { messages, sendMessage, isAIResponding } =
    useAskMessages(conversationId);
  const { mutate: TTS } = useMessageTTS();
  const { mutate: translate } = useMessageTranslate();

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
  const handleTTS = () => {
    if (!res?.messageId) return;
    TTS(String(res.messageId));
  };
  const handleTranslate = () => {
    if (!res?.messageId) return;
    translate(String(res.messageId));
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

      {res?.content && (
        <div className="flex gap-2 mb-1 flex-col">
          <div className="flex flex-col">
            <span className="text-xl font-semibold">
              Here is the best way to say it
            </span>
            <span className="text-gray-600">{res?.askApproachTip}</span>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2 rounded-tr-xl rounded-b-xl p-4 border border-gray-300 bg-white mb-5 max-w-61">
              <p className="text-sm  my-1">{res?.content || "..."}</p>
              <div className="flex justify-between pt-3 border-t border-gray-200">
                <div className="flex gap-2">
                  <Volume2 onClick={handleTTS} />
                  <Earth onClick={handleTranslate} />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-1 text-sm">
              <div className="flex gap-1 text-blue-600">
                <Lightbulb size={14} /> Cultural Insights
              </div>
              {res?.askCulturalInsight}
            </div>
          </div>
        </div>
      )}

      {/* 이후 대화 메시지 */}
      {messages.slice(7).map((m) => (
        <div
          key={m.messageId}
          className={`flex ${m.type === "USER" ? "justify-end" : "justify-start"} mt-2 mb-4`}
        >
          <div
            className={`p-4 border border-gray-300 bg-white max-w-61 ${
              m.type === "USER"
                ? "rounded-tl-xl rounded-b-xl"
                : "rounded-tr-xl rounded-b-xl"
            }`}
          >
            <p className="text-sm">{m.content}</p>
          </div>
        </div>
      ))}

      {isAIResponding && (
        <div className="flex flex-col gap-2 justify-center items-center pt-4">
          <Spinner />
          <span>Processing AI...</span>
        </div>
      )}

      <div ref={bottomRef} />

      {(step === "situation" || step === "chat") && (
        <ChatInput
          message={message}
          setMessage={setMessage}
          onSend={step === "chat" ? handleSendMessage : handleSendSituation}
          disabled={step === "chat" ? isAIResponding : isPending}
          placeholder={
            step === "chat" ? "Type your message..." : "Type your answer..."
          }
        />
      )}
    </div>
  );
}
