export default function Part({
  title,
  desc,
  desc2,
  icon,
}: {
  title: string;
  desc: string;
  desc2?: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="space-y-3 ">
      <div className="flex gap-2">
        {icon}
        <h3 className="text-gray-900 text-base font-semibold leading-[140%] ">
          {title}
        </h3>
      </div>
      <div className="bg-white rounded-2xl border border-gray-200 p-4">
        <p className=" text-gray-700 text-sm font-medium leading-[140%] whitespace-pre-line ">
          {desc}
        </p>
        {desc2 && (
          <>
          <div className="pt-5 flex gap-4 border-t border-gray-200 "/>
            <p className="text-blue-500 bg-blue-100 size-8 flex items-center justify-center shrink-0 font-semibold rounded-full text-sm leading-[140%]">
              Try
            </p>
            <p className="text-gray-700 text-sm  leading-[140%]">
              {desc2}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
