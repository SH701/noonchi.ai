"use client";

import Image from "next/image";
import { useState } from "react";
import { topicsByCategory } from "@/data/topics";
import { useRouter } from "next/navigation";
import TopicButton from "@/components/ui/button/TopicButton";
import Link from "next/link";
import ComingSoonModal from "@/components/etc/Comingsoon";

export default function Main() {
  const sliders = [
    { id: 1, img: "/etc/interview.png" },
    { id: 2, img: "/etc/interview.png" },
    { id: 3, img: "/etc/interview.png" },
  ];

  const [activeIndex, setActiveIndex] = useState(1);
  const [category, setCategory] =
    useState<keyof typeof topicsByCategory>("Popular");

  const topics = topicsByCategory[category];
  const router = useRouter();
  const [showComingSoon, setShowComingSoon] = useState(false);

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
          <div
            className={`relative px-5 overflow-hidden flex items-center justify-center w-full`}
          >
            <div className="flex gap-4 overflow-x-visible px-4">
              {sliders.map((s, index) => {
                const isActive = activeIndex === index;
                return (
                  <div
                    key={s.id}
                    onClick={() => setActiveIndex(index)}
                    className={`
              relative w-[288px] h-[344px] rounded-xl overflow-hidden shadow-lg 
              transition-all duration-300 cursor-pointer
              ${isActive ? "scale-100 opacity-100" : "scale-95 opacity-40"}
            `}
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={s.img}
                        alt="사진"
                        fill
                        className="object-cover"
                        onClick={() => router.push("/main/create/interview")}
                      />
                    </div>

                    <div className="absolute top-4 left-4 bg-black/20 px-2 py-1 rounded-md text-xs text-white">
                      Career
                    </div>
                    <div className="absolute bottom-13 right-4">
                      <Image
                        src="/etc/chat.png"
                        alt="사진"
                        width={32}
                        height={32}
                      />
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white text-xl font-semibold pb-2">
                        Interview Coach
                      </h3>
                      <p className="text-gray-300 text-xs">
                        Real Korean interview questions <br /> from your resume.
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="px-5">
          <div className="flex justify-between">
            <p className="text-xl text-gray-800 font-semibold pb-3">Topic</p>
            <Link href="/main/topicall">
              <p className="text-[13px] font-medium text-gray-400">View all</p>
            </Link>
          </div>
          <div className="flex gap-1 mb-5 w-full">
            <TopicButton
              label="Career"
              active={category === "Popular"}
              onClick={() => setCategory("Popular")}
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
          <div className="grid grid-cols-2 gap-4 w-full py-4">
            <div
              className="flex items-center justify-center bg-white rounded-xl  cursor-pointer hover:shadow-md transition-colors min-h-40"
              onClick={() => setShowComingSoon(true)}
            >
              <span className="text-blue-600 font-semibold ">
                + Create Chat
              </span>
            </div>

            {topics.map((topic) => (
              <div
                key={topic.id}
                className="flex flex-col bg-white border border-gray-200 rounded-xl p-4 
        cursor-pointer hover:shadow-md transition-shadow min-h-40
        justify-between"
                onClick={() => router.push("/main/create/roleplay")}
              >
                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-base font-semibold text-gray-900 leading-tight flex-1 pr-2">
                    {topic.title}
                  </h4>
                  <div className="text-2xl shrink-0">{topic.icon}</div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 leading-snug">
                    {topic.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <ComingSoonModal
          isOpen={showComingSoon}
          onClose={() => setShowComingSoon(false)}
        />
      </div>
    </>
  );
}
