import { RoleplayHeader } from "@/features/roleplay";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <RoleplayHeader />
      <div className="flex flex-col flex-1">{children}</div>
    </>
  );
}
