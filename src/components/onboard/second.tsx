"use client";

import { usePreferenceStore } from "@/store/preference/usePreference";
import Image from "next/image";

const levelImg = {
  BEGINNER: "/circle/circle1.png",
  INTERMEDIATE: "/circle/circle2.png",
  ADVANCED: "/circle/circle3.png",
};

const levelDescription = {
  BEGINNER:
    "I know basic polite words, but I'm not sure when or how to use honorifics.",
  INTERMEDIATE:
    "I can use -요 endings, but I’m not confident in using formal or respectful language correctly.",
  ADVANCED:
    "I understand and use honorifics naturally depending on context or relationship.",
} as const;

export default function Second() {
  const koreanLevel = usePreferenceStore((s) => s.koreanLevel);
  const setKoreanLevel = usePreferenceStore((s) => s.setKoreanLevel);

  return (
    <div className="px-4 pt-4 h-full flex flex-col">
      <div className="flex-1 flex flex-col">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Please select your <br /> Korean level
        </h1>
        <p className="text-gray-400 mb-8">
          Tell us how comfortable you are <br /> chatting in Korean!
        </p>

        <div className="space-y-4">
          {(["BEGINNER", "INTERMEDIATE", "ADVANCED"] as const).map((lvl) => (
            <div
              key={lvl}
              onClick={() => setKoreanLevel(lvl)}
              className="flex items-center p-4 cursor-pointer transition-all border rounded-xl gap-4"
              style={{
                borderColor: koreanLevel === lvl ? "#316CEC" : "#E5E7EB",
                background: koreanLevel === lvl ? "#EFF6FF" : "#F9FAFB",
              }}
            >
              <div className="shrink-0 w-12 h-12 rounded-full overflow-hidden">
                <Image
                  src={levelImg[lvl]}
                  alt={lvl}
                  width={48}
                  height={48}
                  className={koreanLevel === lvl ? "" : "opacity-60"}
                />
              </div>

              <div className="flex flex-col text-left">
                <h2 className="font-semibold text-lg text-gray-900">
                  {lvl.charAt(0) + lvl.slice(1).toLowerCase()}
                </h2>
                <p className="text-sm text-gray-500 leading-snug">
                  {levelDescription[lvl]}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
