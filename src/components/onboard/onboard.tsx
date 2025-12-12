"use client";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider, { Settings } from "react-slick";
import { slides } from "@/data/onboarding";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import { isTokenExpired, getOrCreateDeviceId } from "@/utils/auth";
import { useAuthStore } from "@/store/auth/useAuth";
import { Button } from "../ui/button";
import { useGuest } from "@/hooks/mutations/useGuest";
import React from "react";
import Loading from "@/components/loading/loading";

export const settings: Settings = {
  dots: true,
  infinite: false,
  speed: 400,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
  draggable: false,
  swipe: false,
  dotsClass: "slick-dots custom-dots",
};

export default function Onboard() {
  const router = useRouter();
  const sliderRef = useRef<Slider>(null);
  const [loading, setLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const accessToken = useAuthStore((s) => s.accessToken);
  const setAccessToken = useAuthStore((s) => s.setTokens);

  const { mutateAsync: guestLogin } = useGuest();
  const lastIndex = slides.length - 1;

  const handleSkip = () => {
    sliderRef.current?.slickGoTo(slides.length - 1);
  };

  const handleOnboardingToMain = async () => {
    try {
      if (accessToken && !isTokenExpired(accessToken)) {
        router.push("/main");
        return;
      }

      const deviceId = getOrCreateDeviceId();
      const newToken = await guestLogin(deviceId);

      setAccessToken(newToken.accessToken, null);

      router.push("/main");
    } catch (error) {
      console.error("인증 처리 중 오류:", error);
      alert("로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  useEffect(() => {
    if (currentSlide === 3) {
      const timer = setTimeout(async () => {
        setLoading(true);
        await handleOnboardingToMain();
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [currentSlide]); // ✅ 수정: handleOnboardingToMain 의존성 제거 (무한 루프 방지)

  const handleNext = () => {
    if (currentSlide === lastIndex) {
      router.push("/login");
    } else {
      sliderRef.current?.slickNext();
    }
  };

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(async () => {
        await handleOnboardingToMain();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [loading]); // ✅ 수정: 의존성 단순화

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="h-screen w-full bg-white flex items-center justify-center overflow-hidden">
      <div className="w-full h-full flex flex-col mx-auto relative">
        <div className="grow">
          <Slider
            ref={sliderRef}
            {...settings}
            afterChange={(i) => setCurrentSlide(i)}
            className={
              currentSlide === 1 || currentSlide === 2
                ? "dots-top"
                : "dots-hidden"
            }
            appendDots={(dots) => {
              if (currentSlide === 0 || currentSlide === 3) {
                return <div style={{ display: "none" }} />;
              }
              const dotsArray = React.Children.toArray(dots);
              const filtered = dotsArray.slice(1, 3);
              return (
                <div className="dots-wrapper">
                  <ul className="slick-dots custom-dots">{filtered}</ul>
                </div>
              );
            }}
          >
            {slides.map((slide, i) => {
              const Icon = slide.icon;
              const isFormSlide = slide.id === 2 || slide.id === 3;

              return (
                <div key={slide.id} className="flex flex-col h-full">
                  <div
                    className={
                      isFormSlide
                        ? "relative flex-1 flex items-start pt-20 px-4 overflow-y-auto"
                        : "relative h-100 flex items-center justify-center"
                    }
                  >
                    {i !== slides.length - 1 && (
                      <button
                        onClick={handleSkip}
                        className="absolute top-4 right-4 text-sm underline text-gray-500 z-50"
                      >
                        Skip
                      </button>
                    )}
                    <Icon />
                  </div>
                  {!isFormSlide && (
                    <>
                      <div className="w-full mx-auto max-w-76 flex flex-col items-center justify-center text-center mt-10">
                        <h2 className="text-center text-2xl font-semibold leading-tight text-[#111827]">
                          {slide?.title}
                        </h2>
                      </div>
                      <div className="w-full flex flex-col items-center text-center mx-auto ">
                        <p className="text-[#9CA3AF] mt-2 mb-3 text-sm leading-snug">
                          {slide?.desc}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </Slider>
        </div>

        <div className="px-4">
          {currentSlide !== 3 && (
            <Button variant="primary" size="lg" onClick={handleNext}>
              Next
            </Button>
          )}
        </div>
        <div className="pb-6">
          <p
            className={`text-center text-sm text-gray-500 mt-6 ${
              currentSlide === 0 ? "visible" : "invisible"
            }`}
          >
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-blue-500 hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
