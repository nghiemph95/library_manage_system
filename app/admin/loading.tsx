import NavigationLoading from "@/components/NavigationLoading";

export default function AdminLoading() {
  return (
    <>
      <NavigationLoading />
      <div className="mt-4 space-y-4 p-4">
        <div className="skeleton-pulse h-8 w-48 rounded" />
        <div className="skeleton-pulse h-64 w-full rounded-lg" />
      </div>
    </>
  );
}
