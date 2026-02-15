import NavigationLoading from "@/components/NavigationLoading";

export default function WishlistLoading() {
  return (
    <>
      <NavigationLoading />
      <div className="mt-4 space-y-6 px-2">
        <div className="skeleton-pulse h-10 w-48 rounded-lg" />
        <div className="flex flex-wrap gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton-pulse h-72 w-[140px] rounded-lg" />
          ))}
        </div>
      </div>
    </>
  );
}
