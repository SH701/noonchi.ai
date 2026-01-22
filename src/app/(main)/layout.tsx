import Header from "@/components/mainpage/Header";

export default function MainsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full h-screen flex flex-col px-5">
      <Header />
      <div className="flex flex-col flex-1">{children}</div>
    </div>
  );
}
