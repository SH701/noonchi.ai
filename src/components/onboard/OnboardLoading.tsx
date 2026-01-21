import Image from "next/image";

export default function OnboardLoading() {
  return (
    <div className=" md:w-max-[375px] w-full flex flex-col gap-5 items-center justify-start pt-40  min-h-screen ">
      <Image src="/etc/auth.png" alt="auth" width={217} height={40} />
    </div>
  );
}
