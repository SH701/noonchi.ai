"use client";

import { useState } from "react";
import { ChatInput } from "../common";
import { Button } from "@/components/ui/button/button";
import { useAsk } from "@/hooks/mutations/conversation/useAsk";

type Step = "askTarget" | "closeness" | "situation";

interface ChatLog {
  question: string;
  answer: string;
}

const CLOSENESS_OPTIONS = [
  { label: "Casual", value: "casual" },
  { label: "Friendly", value: "friendly" },
  { label: "Professional", value: "professional" },
  { label: "Formal", value: "formal" },
] as const;

const STEP_QUESTIONS: Record<Step, string> = {
  askTarget: "Who is this for?",
  closeness: "How close are you with them?",
  situation: "What do you want to say?",
};

export default function AskInfo() {
  const [step, setStep] = useState<Step>("askTarget");
  const [message, setMessage] = useState("");
  const [askTarget, setAskTarget] = useState("");
  const [closeness, setCloseness] = useState("");
  const [chatLogs, setChatLogs] = useState<ChatLog[]>([]);
  const { mutate: createAsk } = useAsk();

  const addLog = (question: string, answer: string) => {
    setChatLogs((prev) => [...prev, { question, answer }]);
  };

  const handleSendTarget = () => {
    if (!message.trim()) return;
    addLog(STEP_QUESTIONS.askTarget, message.trim());
    setAskTarget(message.trim());
    setMessage("");
    setStep("closeness");
  };

  const handleSelectCloseness = (value: string) => {
    const label =
      CLOSENESS_OPTIONS.find((o) => o.value === value)?.label ?? value;
    addLog(STEP_QUESTIONS.closeness, label);
    setCloseness(value);
    setMessage("");
    setStep("situation");
  };

  const handleSendSituation = () => {
    if (!message.trim()) return;
    createAsk({
      askTarget,
      closeness,
      situation: message.trim(),
    });
    setMessage("");
  };

  return (
    <div className="flex flex-col flex-1">
      {/* 대화 로그 */}
      {chatLogs.map((log, idx) => (
        <div key={idx} className="mb-6">
          <div className="flex gap-2 mb-2">
            <div className="size-8 rounded-full shrink-0 bg-gray-300" />
            <div className="rounded-tr-xl rounded-b-xl p-4 border border-gray-300 bg-white">
              <p className="text-sm">{log.question}</p>
            </div>
          </div>
          <div className="flex justify-end">
            <div className="rounded-tl-xl rounded-b-xl p-4 border border-gray-300 bg-white">
              <p className="text-sm">{log.answer}</p>
            </div>
          </div>
        </div>
      ))}

      {step === "askTarget" && (
        <>
          <div className="flex flex-col">
            <span className="text-xl font-semibold">
              {STEP_QUESTIONS.askTarget}
            </span>
            <span className="text-gray-600">
              This can be something you`re <br /> about to say or do
            </span>
          </div>
          <ChatInput
            message={message}
            setMessage={setMessage}
            onSend={handleSendTarget}
            placeholder="Type your answer..."
          />
        </>
      )}

      {step === "closeness" && (
        <>
          <div className="flex flex-col gap-2">
            <span className="text-xl font-semibold">
              {STEP_QUESTIONS.closeness}
            </span>
            <span className="text-gray-600">
              This helps me understand the right tone
            </span>
          </div>
          <div className="flex flex-col gap-3 mt-6">
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
        </>
      )}

      {step === "situation" && (
        <>
          <div className="flex flex-col">
            <span className="text-xl font-semibold">
              {STEP_QUESTIONS.situation}
            </span>
            <span className="text-gray-600">
              Describe the situation or what you want to express
            </span>
          </div>
          <ChatInput
            message={message}
            setMessage={setMessage}
            onSend={handleSendSituation}
            placeholder="Type your answer..."
          />
        </>
      )}
    </div>
  );
}
