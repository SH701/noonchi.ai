import { TopicRes } from "@/types/topics";
import Image from "next/image";



export default function InterviewSection({ imageUrl,name,category,description }: TopicRes) {
  return (
    <div className="relative w-full aspect-square max-w-83.75 mx-auto">
      <Image
        src={imageUrl || "/default-image.jpg"}
        alt="topic's photo"
        fill
        className="object-cover rounded-3xl"
      />
      <div className="" />
      <div className="absolute top-4 left-4">
        <span className="text-gray-600 px-3 py-2 bg-white/50 text-sm  rounded-3xl border border-gray-200">
          {name}
        </span>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-auto bg-gray backdrop-blur-sm rounded-b-3xl flex flex-col p-4 text-white">
        <span className="text-3xl font-semibold">{category}</span>
        <span className="text-sm font-medium">{description}</span>
      </div>
    </div>
  );
}
