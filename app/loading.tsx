import NavigationLoading from "@/components/NavigationLoading";

export default function RootLoading() {
  return (
    <>
      <NavigationLoading />
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="skeleton-pulse size-12 rounded-full" />
          <div className="flex flex-col items-center gap-2">
            <div className="skeleton-pulse h-4 w-32 rounded" />
            <div className="skeleton-pulse h-3 w-24 rounded" />
          </div>
        </div>
      </div>
    </>
  );
}
