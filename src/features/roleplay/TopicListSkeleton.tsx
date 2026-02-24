export default function TopicListSkeleton() {
  const skeletonCards = Array.from({ length: 5 });

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 gap-4 w-full pb-10 animate-pulse" >
        {skeletonCards.map((_, index) => (
          <div
            key={index}
            className="relative flex flex-col rounded-xl w-41 h-41 overflow-hidden bg-gray-200 animate-pulse"
          >
            <div className="absolute top-3 right-3 size-6 bg-gray-300 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
