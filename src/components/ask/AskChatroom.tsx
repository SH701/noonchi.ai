"use client";

import { Earth, Lightbulb, Volume2 } from "lucide-react";
import { useMessageTTS, useMessageTranslate } from "@/hooks/mutations";
import { ChatMsg } from "@/types/messages";

type AskChatroomProps = {
  messages: ChatMsg[];
  feedbackOpenId: number | null;
  handleFeedbacks: (messageId: number) => void;
};

export default function AskChatroom({ messages }: AskChatroomProps) {
  const { mutate: TTS } = useMessageTTS();
  const { mutate: translate } = useMessageTranslate();

  return (
    <>
      {messages.map((m) => {
        if (m.type === "USER") {
          return (
            <div key={m.messageId} className="flex justify-end mt-2 mb-4">
              <div className="rounded-tl-xl rounded-b-xl p-4 border border-gray-300 bg-white max-w-61">
                <p className="text-sm">{m.content}</p>
              </div>
            </div>
          );
        }

        return (
          <div key={m.messageId} className="flex gap-2 mb-4 flex-col">
            {m.askApproachTip && (
              <div className="flex flex-col">
                <span className="text-xl font-semibold">
                  Here is the best way to say it
                </span>
                <span className="text-gray-600">{m.askApproachTip}</span>
              </div>
            )}
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-2 rounded-tr-xl rounded-b-xl p-4 border border-gray-300 bg-white mb-1 max-w-61">
                <p className="text-sm my-1">{m.content}</p>
                <div className="flex justify-between pt-3 border-t border-gray-200">
                  <div className="flex gap-2">
                    <button onClick={() => TTS(String(m.messageId))}>
                      <Volume2 size={20} />
                    </button>
                    <button onClick={() => translate(String(m.messageId))}>
                      <Earth size={20} />
                    </button>
                  </div>
                </div>
              </div>
              {m.askCulturalInsight && (
                <div className="flex flex-col gap-1 text-sm">
                  <div className="flex gap-1 text-blue-600">
                    <Lightbulb size={14} /> Cultural Insights
                  </div>
                  {m.askCulturalInsight}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
}
