import { useUser } from "@/hooks/queries";
import Image from "next/image";

export default function Header() {
  const { data: user } = useUser();
  return (
    <div className="w-full py-6 px-7 bg-[#F2F7FF] flex justify-between">
      <div className="bg-white px-2 py-1 rounded-4xl flex gap-1">
        <Image
          src="/credits/crediticon.png"
          width={16}
          height={16}
          alt="크레딧"
        />
        <p className="text-sm font-semibold text-gray-600">
          {user?.creditPoint}
        </p>
        <p className="text-xs text-gray-400 pt-0.5">credits</p>
      </div>
    </div>
  );
}
