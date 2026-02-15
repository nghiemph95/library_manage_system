import NavigationLoading from "@/components/NavigationLoading";
import { BookListSkeleton } from "@/components/BookCardSkeleton";

export default function LibraryLoading() {
  return (
    <>
      <NavigationLoading />
      <div className="mt-4 space-y-6">
        <div className="h-10 w-32 animate-pulse rounded-lg bg-dark-300" />
        <div className="h-14 w-full animate-pulse rounded-xl bg-dark-300" />
        <div className="h-8 w-40 animate-pulse rounded bg-dark-300" />
        <BookListSkeleton count={8} />
      </div>
    </>
  );
}
