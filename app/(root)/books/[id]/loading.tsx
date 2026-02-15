import NavigationLoading from "@/components/NavigationLoading";

export default function BookDetailLoading() {
  return (
    <>
      <NavigationLoading />
      <div className="mt-4 space-y-6 px-2">
        <div className="skeleton-pulse h-4 w-64 rounded" />
        <div className="flex flex-col gap-6 sm:flex-row">
          <div className="skeleton-pulse h-80 w-full min-w-[200px] rounded-lg sm:w-80" />
          <div className="flex-1 space-y-4">
            <div className="skeleton-pulse h-12 w-3/4 rounded" />
            <div className="skeleton-pulse h-5 w-48 rounded" />
            <div className="skeleton-pulse h-20 w-full rounded" />
            <div className="flex gap-2">
              <div className="skeleton-pulse h-14 w-32 rounded-lg" />
              <div className="skeleton-pulse h-14 w-28 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
