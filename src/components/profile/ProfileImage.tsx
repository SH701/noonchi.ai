import { User } from "lucide-react";
import Image from "next/image";

const FACES = {
  face0: "/characters/character1.png",
  face1: "/characters/character2.png",
  face2: "/characters/character3.png",
  face3: "/characters/character4.png",
};

export default function ProfileImage({ src }: { src?: string }) {
  const isUrl = src?.startsWith("http") || src?.startsWith("/");
  if (!src) {
    return <User className="w-15 h-15 bg-gray-300 rounded-full p-3" />;
  }
  if (isUrl) {
    return (
      <Image
        src={src!}
        alt="프로필"
        width={120}
        height={120}
        className="rounded-full object-cover"
      />
    );
  }

  const Face = src ? FACES[src as keyof typeof FACES] : null;

  if (Face)
    return (
      <Image
        src={Face}
        alt="프로필"
        width={120}
        height={120}
        className="w-30 h-30 rounded-full"
      />
    );

  return <div className="w-30 h-30 bg-gray-200 rounded-full" />;
}
