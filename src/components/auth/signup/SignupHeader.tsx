export default function SignupHeader({ title }: { title: string }) {
  return (
    <div className="px-5 pt-4 pb-10  flex items-center justify-between relative mt-9">
      <h1 className="absolute left-1/2 transform -translate-x-1/2 text-xl font-semibold text-gray-800">
        {title}
      </h1>
    </div>
  );
}
