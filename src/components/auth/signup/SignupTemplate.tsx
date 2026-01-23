"use client";

export default function SignupTemplate({
  header,
  children,
  footer,
}: {
  header: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col  mx-auto pb-12">
      {header}
      <div className="flex-1 px-6 py-8 space-y-4 ">{children}</div>
      {footer && (
        <div className="flex justify-center items-center">{footer}</div>
      )}
    </div>
  );
}
