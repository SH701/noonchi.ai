export default function RoleplayHistorySkeleton() {
  const skeletonCards = Array.from({ length: 6});
  return (
    <div className="w-full">
      <div className="flex gap-3 overflow-x-auto animate-pulse">
        {skeletonCards.map((_, index) => (
          <div
            key={index}
            className="rounded-2xl size-32 shrink-0 bg-gray-400"
          ></div>
        ))}
      </div>
    </div>
  );
}
