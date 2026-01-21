"use client";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider, { Settings } from "react-slick";
import { slides } from "@/data/onboarding";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { isTokenExpired, getOrCreateDeviceId } from "@/utils";
import { useAuthStore } from "@/store/auth/useAuth";
import { Button } from "../ui/button";
import { useGuest } from "@/hooks/mutations";
import React from "react";

import OnboardLoading from "./OnboardLoading";

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
  const [initialLoading, setInitialLoading] = useState(true);
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
  }, [currentSlide]);

  const handleNext = () => {
    if (currentSlide === lastIndex) {
      router.push("/login");
    } else {
      sliderRef.current?.slickNext();
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setInitialLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(async () => {
        await handleOnboardingToMain();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  if (initialLoading || loading) {
    return <OnboardLoading />;
  }
  return (
    <div className="h-screen w-full bg-white flex items-center justify-center overflow-hidden">
      <div className="w-full h-full flex flex-col mx-auto relative">
        <div className="grow">
          <Slider
            ref={sliderRef}
            {...settings}
            afterChange={(i) => setCurrentSlide(i)}
            className="dots-top"
            appendDots={(dots) => {
              const dotsArray = React.Children.toArray(dots);
              const filtered = dotsArray.slice(0, 2);
              return (
                <div className="dots-wrapper">
                  <ul className="slick-dots custom-dots">{filtered}</ul>
                </div>
              );
            }}
          >
            {slides.map((slide, i) => {
              const Content = slide.content;
              const isFormSlide = slide.id === 1 || slide.id === 2;

              return (
                <div key={slide.id} className="flex flex-col h-full">
                  <div
                    className={
                      isFormSlide
                        ? "relative flex-1 flex items-start pt-20 px-4 overflow-y-auto"
                        : "relative h-100 flex items-center justify-center"
                    }
                  >
                    <button
                      onClick={handleSkip}
                      className="absolute top-4 right-4 text-sm underline text-gray-500 z-50 cursor-pointer"
                    >
                      Skip
                    </button>
                    <Content />
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

        <div className="px-4 pb-14">
          {currentSlide !== 3 && (
            <Button variant="primary" size="lg" onClick={handleNext}>
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
