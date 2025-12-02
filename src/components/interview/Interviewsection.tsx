import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
export default function Interviewsection() {
  const sliders = [
    { id: 1, img: "/etc/interview.png" },
    { id: 2, img: "/etc/interview.png" },
    { id: 3, img: "/etc/interview.png" },
  ];
  const [activeIndex, setActiveIndex] = useState(1);
  const router = useRouter();
  return (
    <div className={`flex flex-col items-center pt-6 pb-4`}>
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
                      ${
                        isActive
                          ? "scale-100 opacity-100"
                          : "scale-95 opacity-40"
                      }
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

                <div className="absolute top-4 left-4 bg-black/20 px-2 py-1 rounded-md text-sm text-white">
                  Career
                </div>
                <div className="absolute top-4 right-4 bg-black/20 px-2 py-1 rounded-md text-sm text-white">
                  Best
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
                  <p className="text-[10px] font-semibold text-blue-400">
                    60 Credit
                  </p>
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
  );
}
