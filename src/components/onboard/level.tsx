import { usePreferenceStore } from "@/store/preference/usePreference";

const levelDescription = {
  BEGINNER:
    "I know basic polite words, but I'm not sure when or how to use honorifics.",
  INTERMEDIATE:
    "I can use -요 endings, but I’m not confident in using formal or respectful language correctly.",
  ADVANCED:
    "I understand and use honorifics naturally depending on context or relationship.",
} as const;

export default function Level() {
  const koreanLevel = usePreferenceStore((s) => s.koreanLevel);
  const setKoreanLevel = usePreferenceStore((s) => s.setKoreanLevel);

  return (
    <div className=" pt-4 h-full flex flex-col">
      <div className="flex-1 flex flex-col">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Please select your <br /> Korean level
        </h1>
        <p className="text-gray-400 mb-4.5">
          Tell us how comfortable you are <br /> chatting in Korean!
        </p>

        <div className="space-y-4">
          {(["BEGINNER", "INTERMEDIATE", "ADVANCED"] as const).map((lvl) => (
            <div
              key={lvl}
              onClick={() => setKoreanLevel(lvl)}
              className="flex w-full items-center px-4 py-5 cursor-pointer transition-all border rounded-2xl gap-4 bg-white"
              style={{
                borderColor: koreanLevel === lvl ? "#527AFF" : "#E5E7EB",
                background: koreanLevel === lvl ? "#DBEAFE" : "",
              }}
            >
              <div className="flex flex-col text-left">
                <span className="font-semibold text-lg">
                  {lvl.charAt(0) + lvl.slice(1).toLowerCase()}
                </span>
                <span className="text-sm text-gray-500 leading-snug">
                  {levelDescription[lvl]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
