export default function BookCardSkeleton() {
  return (
    <li className="w-full xs:max-w-[10rem]">
      <div className="relative">
        <div className="book-cover_regular animate-pulse rounded-lg bg-dark-300" />
        <div className="mt-4 space-y-2">
          <div className="h-4 w-3/4 animate-pulse rounded bg-dark-300" />
          <div className="h-3 w-1/2 animate-pulse rounded bg-dark-300" />
        </div>
      </div>
    </li>
  );
}

export function BookListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <ul className="book-list">
      {Array.from({ length: count }).map((_, i) => (
        <BookCardSkeleton key={i} />
      ))}
    </ul>
  );
}
