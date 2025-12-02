import Image from "next/image";
export default function Page() {
  return (
    <div className="flex flex-col gap-5 items-center justify-center w-screen min-h-screen bg-blue-600">
      <span className="text-white  font-medium leading-5">
        Sound natural, connect deeply
      </span>
      <Image src="/etc/mainLogo.png" alt="메인 로고" width={200} height={120} />
    </div>
  );
}
