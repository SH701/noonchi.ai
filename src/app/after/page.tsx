"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { useAuthStore } from "@/store/auth";
import { Level, Interest } from "@/store/auth";
import ProfileChange from "@/components/afterlogin/profilechange";
import Image from "next/image";
import Loading from "./loading";

const levelImg: Record<Level, string> = {
  BEGINNER: "/circle/circle1.png",
  INTERMEDIATE: "/circle/circle2.png",
  ADVANCED: "/circle/circle3.png",
};

const INTEREST_OPTIONS: Interest[] = [
  "💬 Daily",
  "💼 Business",
  "✈️ Travel",
  "🎬 K-Drama",
  "🎵 K-Pop",
  "🙇‍♂️ Etiquette",
  "🔥 Internet Slang",
  "🥘 Food",
  "🍜 Ordering",
  "💄 Beauty",
  "👁️‍🗨️ Gathering",
] as const;
export default function AfterPage() {
  const router = useRouter();

  // Zustand selectors
  const accessToken = useAuthStore((s) => s.accessToken);
  const koreanLevel = useAuthStore((s) => s.koreanLevel);
  const profileImageUrl = useAuthStore((s) => s.profileImageUrl);
  const interests = useAuthStore((s) => s.interests);

  const setKoreanLevel = useAuthStore((s) => s.setKoreanLevel);
  const setInterests = useAuthStore((s) => s.setInterests);

  const sliderRef = useRef<Slider>(null);

  const [current, setCurrent] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit =
    current < 2 || (koreanLevel && profileImageUrl && interests.length > 0);

  // 초기 로딩 애니메이션
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const settings: Settings = {
    dots: false,
    infinite: false,
    speed: 400,
    slidesToShow: 1,
    arrows: false,
    draggable: false,
    swipe: false,
    afterChange: (i) => setCurrent(i),
  };

  const onNext = () => {
    if (current < 2) {
      sliderRef.current?.slickNext();
    } else {
      submitProfile();
    }
  };

  // ------------------------------------
  // 🔥 프로필 저장 API
  // ------------------------------------
  const submitProfile = async () => {
    setError(null);
    setSubmitting(true);

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

      const res = await fetch("/api/users/me/profile", {
        method: "PUT",
        credentials: "include",
        headers,
        body: JSON.stringify({
          koreanLevel,
          profileImageUrl,
          interests,
        }),
      });

      const ct = res.headers.get("content-type") || "";
      const data = ct.includes("application/json")
        ? await res.json()
        : await res.text();

      if (!res.ok) {
        setError(
          typeof data === "string"
            ? data
            : data?.message || "설정에 실패했습니다."
        );
        return;
      }

      router.replace("/main");
    } catch (err) {
      console.error(err);
      setError("알 수 없는 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  // ------------------------------------
  // UI 상태
  // ------------------------------------
  if (loading || submitting) return <Loading />;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 bg-white">
        <div className="flex items-center justify-between">
          <h1 className="text-gray-900 text-xl font-semibold">Profile Setup</h1>
          <button
            onClick={() => router.push("/main")}
            className="text-gray-500 hover:text-gray-700 text-sm transition-colors"
          >
            Skip
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center">
        <div className="flex-1 relative h-full w-[375px] overflow-x-hidden">
          <Slider ref={sliderRef} {...settings} className="h-full">
            {/* Step 1 - Korean Level */}
            <div className="px-4 pt-4 h-full flex flex-col">
              <div className="flex-1 flex flex-col">
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                  Please select your <br /> Korean level
                </h1>
                <p className="text-gray-400 mb-8">
                  Tell us how comfortable you are <br /> chatting in Korean!
                </p>

                <div className="space-y-4">
                  {(["BEGINNER", "INTERMEDIATE", "ADVANCED"] as Level[]).map(
                    (lvl) => (
                      <div
                        key={lvl}
                        onClick={() => setKoreanLevel(lvl)}
                        className="flex items-center p-4 cursor-pointer transition-all border rounded-xl"
                        style={{
                          borderColor:
                            koreanLevel === lvl ? "#316CEC" : "#E5E7EB",
                          background:
                            koreanLevel === lvl ? "#EFF6FF" : "#F9FAFB",
                        }}
                      >
                        <div className="flex-shrink-0 w-12 h-12 rounded-full overflow-hidden mr-4">
                          <Image
                            src={levelImg[lvl]}
                            alt={lvl}
                            width={48}
                            height={48}
                            className={koreanLevel === lvl ? "" : "opacity-60"}
                          />
                        </div>

                        <div className="flex-1">
                          <h2 className="font-semibold text-lg text-gray-900">
                            {lvl.charAt(0) + lvl.slice(1).toLowerCase()}
                          </h2>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Step 2 - Profile Picker */}
            <div className="px-4 h-full flex flex-col">
              <div className="flex-1 flex flex-col items-start">
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                  Choose your profile
                </h1>
                <p className="text-gray-400 mb-8">
                  Select an avatar that represents you!
                </p>
                <ProfileChange />
              </div>
            </div>

            {/* Step 3 - Interests */}
            <div className="px-4 pt-4 h-full flex flex-col">
              <div className="flex-1 flex flex-col items-start">
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                  Please select your <br /> interests
                </h1>
                <p className="text-gray-400 mb-8">
                  Choose topics you`d like to chat about!
                </p>

                <div className="flex flex-wrap gap-3">
                  {INTEREST_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        const next = interests.includes(opt)
                          ? interests.filter((x) => x !== opt)
                          : [...interests, opt];
                        setInterests(next);
                      }}
                      className="flex items-center text-sm font-medium border px-4 py-2 rounded-full"
                      style={{
                        borderColor: interests.includes(opt as Interest)
                          ? "#316CEC"
                          : "#E5E7EB",
                        background: interests.includes(opt as Interest)
                          ? "#EFF6FF"
                          : "#FFFFFF",
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Slider>
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white">
        <button
          disabled={!canSubmit}
          onClick={onNext}
          className={`w-full h-[92px] text-lg font-semibold transition-colors ${
            canSubmit
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-[#BFDBFE] text-[#EFF6FF] cursor-not-allowed"
          }`}
          style={{
            paddingBottom: "calc(env(safe-area-inset-bottom) + 16px)",
          }}
        >
          {current === 2 ? "Start" : "Next"}
        </button>
      </div>
    </div>
  );
}
