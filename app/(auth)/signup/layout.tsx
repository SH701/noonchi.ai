export const metadata = { title: "Sign up" };

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white overflow-hidden">{children}</div>
  );
}
