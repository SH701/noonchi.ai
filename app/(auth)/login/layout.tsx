export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-[812px] w-[375px] mx-auto bg-white overflow-y-hidden">
      {children}
    </div>
  );
}
