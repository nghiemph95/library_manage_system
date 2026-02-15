import NavigationLoading from "@/components/NavigationLoading";

export default function RootSegmentLoading() {
  return (
    <>
      <NavigationLoading />
      <div className="mt-4 space-y-6 px-2">
        <div className="skeleton-pulse h-10 w-64 rounded-lg" />
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton-pulse h-24 rounded-xl" />
          ))}
        </div>
        <div className="flex gap-3">
          <div className="skeleton-pulse h-11 w-28 rounded-lg" />
          <div className="skeleton-pulse h-11 w-24 rounded-lg" />
        </div>
        <div className="space-y-4">
          <div className="skeleton-pulse h-8 w-48 rounded" />
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton-pulse h-52 min-w-[120px] rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
