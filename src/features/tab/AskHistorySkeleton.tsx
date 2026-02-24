export default function AskHistorySkeleton() {
  const skeletonItems = Array.from({ length: 6 });
  return (
    <div className="flex flex-col gap-2 animate-pulse">
      {skeletonItems.map((_, index) => (
        <div key={index} className="p-3 bg-white/10 rounded-lg">
          <div className="flex flex-col gap-1.5">
            <div className="h-3.5 w-16 bg-gray-500 rounded" />
            <div className="h-3 w-32 bg-gray-600 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
