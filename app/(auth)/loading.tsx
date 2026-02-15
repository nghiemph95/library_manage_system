import NavigationLoading from "@/components/NavigationLoading";

export default function AuthLoading() {
  return (
    <>
      <NavigationLoading />
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="skeleton-pulse size-14 rounded-full" />
      </div>
    </>
  );
}
