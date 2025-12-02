"use client";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider, { Settings } from "react-slick";
import { slides } from "@/data/onboarding";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ActionButton from "../ui/button/ActionButton";
import { isTokenExpired, guestLogin, getOrCreateDeviceId } from "@/utils/auth";
import { useAuthStore } from "@/store/auth";

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
  const [currentSlide, setCurrentSlide] = useState(0);
  const { accessToken, setAccessToken } = useAuthStore();

  const handleSkip = () => {
    sliderRef.current?.slickGoTo(slides.length - 1);
  };
  const handleOnboardingToMain = async () => {
    try {
      if (accessToken && !isTokenExpired(accessToken)) {
        console.log("유효한 access token 존재 - 메인으로 이동");
        router.push("/main");
        return;
      }

      const deviceId = getOrCreateDeviceId();

      const NewToken = await guestLogin(deviceId);

      setAccessToken(NewToken);

      router.push("/main");
    } catch (error) {
      console.error("인증 처리 중 오류:", error);
      alert("로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };
  const handleNext = () => {
    if (currentSlide === 4) {
      router.push("/login");
    } else {
      sliderRef.current?.slickNext();
    }
  };
  useEffect(() => {
    if (currentSlide === 3) {
      const timer = setTimeout(() => {
        handleOnboardingToMain();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [currentSlide]);
  return (
    <div className="h-screen w-full bg-white flex items-center justify-center overflow-hidden">
      <div className="w-full h-full flex flex-col mx-auto relative">
        <div className="grow">
          <Slider
            ref={sliderRef}
            {...settings}
            afterChange={(i) => setCurrentSlide(i)}
          >
            {slides.map((slide, i) => (
              <div key={slide.id} className="flex flex-col h-full">
                <div
                  className={`relative h-[400px] flex items-center justify-center ${
                    slide.id !== 1 && slide.id !== 5 ? "bg-[#EFF6FF]" : ""
                  }`}
                >
                  {i !== slides.length - 1 && (
                    <button
                      onClick={handleSkip}
                      className="absolute top-4 right-4 text-sm underline text-gray-500 z-50"
                    >
                      Skip
                    </button>
                  )}
                  {slide.icon && <slide.icon />}
                  {slide.img && (
                    <Image
                      src={slide.img}
                      alt="image"
                      width={340}
                      height={295}
                    />
                  )}
                </div>

                <div className="w-full mx-auto max-w-76 flex flex-col items-center justify-center text-center mt-10">
                  <h2
                    className={`text-center text-2xl font-semibold leading-tight text-[#111827] ${
                      slide.id === 3 ? "tracking-tight" : ""
                    }`}
                  >
                    {slide.title}
                  </h2>
                  {slide.id === 4 && (
                    <div className="text-center text-2xl font-semibold leading-tight text-[#111827] ">
                      <div>Powered by K-AI,</div>
                      <div>trained for Korean culture</div>
                    </div>
                  )}
                </div>
                <div
                  className={`w-full flex flex-col items-center text-center mx-auto ${
                    slide.id === 4 ? "max-w-[350px]" : "max-w-[300px]"
                  }`}
                >
                  <p className="text-[#9CA3AF] mt-2 mb-3 text-sm leading-snug">
                    {slide.desc}
                  </p>
                </div>
              </div>
            ))}
          </Slider>
        </div>

        <div className="px-4">
          {currentSlide !== 3 && (
            <ActionButton onClick={handleNext}>Next</ActionButton>
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
