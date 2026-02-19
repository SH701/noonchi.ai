export default function ChatLoading() {
  return (
    <div className="flex mb-4 gap-2 justify-start">
      <div className="max-w-[75%]">
        <div className="flex flex-col gap-2 rounded-xl p-4 ">
          <div className="flex items-center gap-2">
            <span className="typing-dot animate-pulse w-2 h-2 bg-gray-500 rounded-full"></span>
            <span className="typing-dot animate-pulse w-2 h-2 bg-gray-500 rounded-full delay-150"></span>
            <span className="typing-dot animate-pulse w-2 h-2 bg-gray-500 rounded-full delay-300"></span>
          </div>
        </div>
      </div>
    </div>
  );
}
