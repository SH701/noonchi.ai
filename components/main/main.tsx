"use client";

import { useState } from "react";
import ComingSoon from "@/components/modal/Comingsoon";
import Image from "next/image";
import { useRouter } from "next/navigation";
const CONTENT_WIDTH_CLASS = "w-full";

export default function MainPage() {
  const topics = [
    {
      id: 1,
      icon: "👨‍💼",
      title: "Job Interview",
      description: "Practice answering real Korean interview questions.",
    },
    {
      id: 2,
      icon: "☕",
      title: "Workplace Small Talk",
      description: "Improve casual yet polite conversations with coworkers.",
    },
    {
      id: 3,
      icon: "👥",
      title: "Team Meeting Interaction",
      description: "Practice sharing opinions, participating in discussions.",
    },
    {
      id: 4,
      icon: "🆘",
      title: "Asking for Help at Work",
      description:
        "Learn how to request assistance or clarification in a polite way.",
    },
    {
      id: 5,
      icon: "👨‍💼",
      title: "Talking to Your Manager",
      description:
        "Learn how to request assitance or clarification in a polite way.",
    },
  ];
  const sliders = [
    { id: 1, img: "/etc/interviewImage.png" },
    { id: 2, img: "/etc/interviewImage.png" },
    { id: 3, img: "/etc/interviewImage.png" },
  ];
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(1);
  const handleClick = () => {
    setOpen(true);
  };
  const router = useRouter();

  return (
    <div className=" bg-[#F2F7FF] min-h-screen pb-[140px]">
      <div className={`flex flex-col items-center  pt-6 pb-4`}>
        <h2
          className={`text-2xl font-bold text-gray-900 mb-4 w-full text-left px-5`}
        >
          Recommended
        </h2>

        <div
          className={`relative px-5 overflow-hidden mb-6 flex items-center justify-center ${CONTENT_WIDTH_CLASS}`}
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
                  <div className="relative w-full h-full">
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
          onClick={() => router.push("/main/custom")}
        >
          Start Chatting
        </button>
      </div>

      <div className={`flex flex-col px-5  py-4`}>
        <div
          className={`flex items-center justify-between mb-4 ${CONTENT_WIDTH_CLASS}`}
        >
          <h3 className="text-xl font-bold text-gray-900">Topics</h3>
          <button className="text-gray-600 text-sm font-medium">
            View all
          </button>
        </div>

        <div
          className={`flex gap-2 mb-6 overflow-x-auto pb-2 ${CONTENT_WIDTH_CLASS}`}
        >
          <button className="px-2 py-1 bg-gray-800 text-white rounded-full text-sm font-medium whitespace-nowrap">
            Career
          </button>
          <button className="px-2 py-1 bg-white text-gray-700 rounded-full text-sm font-medium whitespace-nowrap border border-gray-200">
            Greeting
          </button>
          <button className="px-2 py-1 bg-white text-gray-700 rounded-full text-sm font-medium whitespace-nowrap border border-gray-200">
            K POP
          </button>
          <button className="px-2 py-1 bg-white text-gray-700 rounded-full text-sm font-medium whitespace-nowrap border border-gray-200">
            + Create
          </button>
        </div>

        <div className={CONTENT_WIDTH_CLASS}>
          {topics.map((topic) => (
            <div
              key={topic.id}
              className="flex items-center gap-5 p-3 bg-white hover:shadow-md transition-shadow cursor-pointer border border-gray-200 mb-2 rounded-lg"
              onClick={handleClick}
            >
              <div className=" text-blue-600 font-semibold text-base items-center justify-center leading-6">
                {topic.id}
              </div>
              <div className="flex-shrink-0">
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

      <ComingSoon isOpen={open} onClose={() => setOpen(false)} />
    </div>
  );
}
