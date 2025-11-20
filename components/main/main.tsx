"use client";

import Link from "next/link";
import { useState } from "react";

const CONTENT_PADDING = "px-4";
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

  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const renderModal = () => {
    if (!open) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
        <div className="bg-white rounded-xl shadow-2xl p-6 w-11/12 max-w-[343px]">
          <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">
            This feature is coming soon
          </h3>
          <p className="text-base text-gray-700 mb-6 text-center">
            Sorry for the inconvenience. <br />
            We’re preparing a better experience for you
          </p>
          <button
            onClick={() => setOpen(false)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className=" bg-[#F2F7FF]">
      <div className={`flex flex-col ${CONTENT_PADDING} pt-6 pb-4`}>
        <h2
          className={`text-2xl font-bold text-gray-900 mb-4 w-full text-left`}
        >
          Recommended
        </h2>

        <div
          className={`relative overflow-hidden mb-6 flex items-center justify-center ${CONTENT_WIDTH_CLASS}`}
        >
          <div className="relative w-full h-[212px] rounded-xl overflow-hidden shadow-lg">
            <img
              src="/etc/interviewImage.png"
              alt="Job Interview"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <span className="inline-block backdrop-blur-sm rounded-full px-2 py-0.5 text-xs font-medium text-white">
                Career
              </span>
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="text-white text-xl font-semibold mb-1">
                Job Interview
              </h3>
              <p className="text-gray-300 text-xs ">
                Experience real Korean interview situations
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/main/custom"
          className={`flex justify-center mt-3 ${CONTENT_WIDTH_CLASS}`}
        >
          <button className="w-full h-13 bg-blue-600 hover:bg-blue-700 text-blue-50 font-medium py-4 rounded-lg ">
            Start Chatting
          </button>
        </Link>
      </div>

      <div className={`flex flex-col ${CONTENT_PADDING} py-4`}>
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

      {renderModal()}
    </div>
  );
}
