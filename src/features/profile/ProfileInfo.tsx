import { User } from "lucide-react";
import Image from "next/image";

interface ProfileInfoProps {
  img?: string;
  name: string;
}

export default function ProfileInfo({ img, name }: ProfileInfoProps) {
  return (
    <div className="flex flex-col gap-2.5 items-center justify-center">
      {img ? (
        <Image src={img} alt="profile-image" width={105} height={68} />
      ) : (
        <User width={105} height={68} />
      )}
      <div className="flex flex-col ">
        <span className="text-3xl">{name || "사용자"}</span>

        {/* 구독 정보 */}
        <span className="text-gray-400 text-sm font-medium text-center">
          Free Plan
        </span>
      </div>
    </div>
  );
}
