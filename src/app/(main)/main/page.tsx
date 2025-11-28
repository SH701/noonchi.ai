"use client";

import Image from "next/image";
import { useState } from "react";
import { topicsByCategory } from "@/data/topics";
import { useRouter } from "next/navigation";
import TopicButton from "@/components/ui/button/TopicButton";

export default function Main() {
  const sliders = [
    { id: 1, img: "/etc/interviewImage.png" },
    { id: 2, img: "/etc/interviewImage.png" },
    { id: 3, img: "/etc/interviewImage.png" },
  ];

  const [activeIndex, setActiveIndex] = useState(1);
  const [category, setCategory] =
    useState<keyof typeof topicsByCategory>("Career");

  const topics = topicsByCategory[category];
  const router = useRouter();
  return (
    <>
      <div className="w-full py-6 px-7 bg-white">
        <Image
          src="/etc/mainLogo.png"
          width={112}
          height={24}
          alt="Main Logo"
        />
      </div>
      <div className=" bg-[#F2F7FF] min-h-screen pb-40">
        <div className={`flex flex-col items-center  pt-6 pb-4`}>
          <h2
            className={`text-2xl font-bold text-gray-900 mb-4 w-full text-left px-5`}
          >
            Recommended
          </h2>
          <div
            className={`relative px-5 overflow-hidden mb-6 flex items-center justify-center w-full`}
          >
            <div className="flex gap-4 overflow-x-visible px-4">
              {sliders.map((s, index) => {
                const isActive = activeIndex === index;
                return (
                  <div
                    key={s.id}
                    onClick={() => setActiveIndex(index)}
                    className={`
              relative w-[280px] h-[212px] rounded-xl overflow-hidden shadow-lg 
              transition-all duration-300 cursor-pointer
              ${isActive ? "scale-100 opacity-100" : "scale-95 opacity-40"}
            `}
                  >
                    <div
                      className="relative w-full h-full"
                      onClick={() => router.push("/main/create/interview")}
                    >
                      <Image
                        src={s.img}
                        alt="사진"
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="absolute top-4 left-4 bg-black/30 px-2 py-1 rounded-md text-xs text-white">
                      Career
                    </div>

                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white text-xl font-semibold">
                        Job Interview
                      </h3>
                      <p className="text-gray-300 text-xs">
                        Experience real Korean interview situations
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            className="w-[286px] h-13 flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 cursor-pointer text-white font-medium "
            onClick={() => router.push("/main/create/interview")}
          >
            Start Chatting
          </button>
        </div>
        <div className="px-5">
          <p className="text-xl text-gray-800 font-semibold py-3">Topic</p>
          <div className="flex gap-1 mb-5 w-full">
            <TopicButton
              label="Career"
              active={category === "Career"}
              onClick={() => setCategory("Career")}
            />
            <TopicButton
              label="Greeting"
              active={category === "Greeting"}
              onClick={() => setCategory("Greeting")}
            />
            <TopicButton
              label="K POP"
              active={category === "KPOP"}
              onClick={() => setCategory("KPOP")}
            />
          </div>
          <div className="w-full">
            {topics.map((topic) => (
              <div
                key={topic.id}
                className="flex items-center gap-5 p-3 bg-white hover:shadow-md 
               transition-shadow cursor-pointer border border-gray-200 mb-2 rounded-lg"
                onClick={() => router.push("/main/create/roleplay")}
              >
                <div className="text-blue-600 font-semibold text-base">
                  {topic.id}
                </div>

                <div className="shrink-0">
                  <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg text-2xl">
                    {topic.icon}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-base font-semibold text-gray-900 mb-1 leading-6">
                    {topic.title}
                  </h4>
                  <p className="text-xs text-gray-600 leading-4">
                    {topic.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
