"use client";

import CustomForm from "./CustomForm";
import { CameraIcon } from "@/assets/svgr";

export default function CustomSection() {
  return (
    <div className="flex flex-col relative w-full overflow-x-hidden">
      <div className="w-full flex justify-center">
        <div className="w-full max-w-93.75 ">
          <div className="relative w-full aspect-square max-w-83.75 mx-auto flex items-center justify-center bg-white/30 rounded-3xl border border-white mb-8">
            <div className="rounded-full bg-white/50 p-6 border border-white">
              <CameraIcon className="text-gray-500 " />
            </div>
            <div className="px-3 py-2 bg-white/50 border border-gray-200 rounded-full absolute top-4 left-4">
              <span className="text-gray-600 text-[13px] font-medium">
                Custom
              </span>
            </div>
            <div className="flex flex-col gap-2 absolute left-4 bottom-4">
              <span className="text-2xl font-semibold text-gray-900">
                Custom Role playing
              </span>
              <span className="text-sm font-medium text-gray-700">
                Please upload the photo you want
              </span>
            </div>
          </div>
          <div>
            <p className="font-semibold pb-5">Conversation Context</p>
            <CustomForm AiRole="" myRole="" onSubmit={() => {}} />
          </div>
        </div>
      </div>
    </div>
  );
}
