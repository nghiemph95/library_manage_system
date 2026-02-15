import NavigationLoading from "@/components/NavigationLoading";

export default function MyProfileLoading() {
  return (
    <>
      <NavigationLoading />
      <div className="mt-4 space-y-6 px-2">
        <div className="skeleton-pulse h-12 w-40 rounded-lg" />
        <div className="skeleton-pulse h-8 w-56 rounded" />
        <div className="flex flex-wrap gap-5">
          {[1, 2].map((i) => (
            <div key={i} className="skeleton-pulse h-80 w-[160px] rounded-lg" />
          ))}
        </div>
      </div>
    </>
  );
}
