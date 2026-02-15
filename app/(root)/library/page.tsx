import BookList from "@/components/BookList";
import BookCard from "@/components/BookCard";
import LibrarySearch from "@/components/LibrarySearch";
import { db } from "@/database/drizzle";
import { books, borrowRecords } from "@/database/schema";
import { desc, ilike, or, and, eq, sql, inArray } from "drizzle-orm";
import { Suspense } from "react";
import { auth } from "@/auth";
import {
  getWishlistBookIds,
  getBooksFilteredPaginated,
  type LibrarySort,
} from "@/lib/actions/book";
import EmptyState from "@/components/EmptyState";
import EmptyBooksIllustration from "@/components/illustrations/EmptyBooks";
import Pagination from "@/components/Pagination";
import { LIBRARY_PAGE_SIZE } from "@/constants";

interface Props {
  searchParams: Promise<{ search?: string; genre?: string; sort?: string; page?: string }>;
}

const LibraryPage = async ({ searchParams }: Props) => {
  const params = await searchParams;
  const search = params.search?.trim() ?? "";
  const genre = params.genre ?? "";
  const sort = (params.sort ?? "newest") as LibrarySort;
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const session = await auth();
  const userId = session?.user?.id ?? undefined;

  const genresResult = await db
    .selectDistinct({ genre: books.genre })
    .from(books)
    .orderBy(books.genre);
  const genres = genresResult.map((r) => r.genre).filter(Boolean);

  const wishlistBookIds = userId ? await getWishlistBookIds(userId) : [];

  const showHighlights = !search && !genre;
  let newArrivals: Book[] = [];
  let trendingBooks: Book[] = [];
  if (showHighlights) {
    newArrivals = (await db
      .select()
      .from(books)
      .orderBy(desc(books.createdAt))
      .limit(6)) as Book[];
    const popularRows = await db
      .select({
        bookId: borrowRecords.bookId,
        count: sql<number>`count(*)::int`,
      })
      .from(borrowRecords)
      .groupBy(borrowRecords.bookId)
      .orderBy(desc(sql`count(*)`))
      .limit(6);
    if (popularRows.length > 0) {
      const ids = popularRows.map((r) => r.bookId);
      trendingBooks = (await db
        .select()
        .from(books)
        .where(inArray(books.id, ids))) as Book[];
    }
  }

  const { books: filteredBooks, total } = await getBooksFilteredPaginated({
    search,
    genre,
    sort,
    page,
    pageSize: LIBRARY_PAGE_SIZE,
  });

  const totalPages = Math.max(1, Math.ceil(total / LIBRARY_PAGE_SIZE));

  return (
    <section>
      <h1 className="font-bebas-neue text-4xl text-light-100">Library</h1>

      <Suspense fallback={<div className="my-4 h-10 animate-pulse rounded bg-dark-300" />}>
        <LibrarySearch genres={genres} />
      </Suspense>

      {showHighlights && newArrivals.length > 0 && (
        <div className="mt-10">
          <h2 className="dashboard-section-title flex items-center gap-2 border-l-4 border-primary pl-3 font-bebas-neue text-2xl text-light-100">
            New arrivals
          </h2>
          <BookList
            books={newArrivals}
            containerClassName="mt-4"
            wishlistBookIds={wishlistBookIds}
            userId={userId}
          />
        </div>
      )}

      {showHighlights && trendingBooks.length > 0 && (
        <div className="mt-10">
          <h2 className="dashboard-section-title flex items-center gap-2 border-l-4 border-primary pl-3 font-bebas-neue text-2xl text-light-100">
            Popular
          </h2>
          <BookList
            books={trendingBooks}
            containerClassName="mt-4"
            wishlistBookIds={wishlistBookIds}
            userId={userId}
          />
        </div>
      )}

      <div className={showHighlights ? "mt-10" : "mt-8"}>
        {showHighlights && (
          <h2 className="dashboard-section-title flex items-center gap-2 border-l-4 border-primary pl-3 font-bebas-neue text-2xl text-light-100">
            All books
          </h2>
        )}
        {filteredBooks.length === 0 ? (
          (search || genre || sort !== "newest" || page > 1) ? (
            <EmptyState
              illustration={<EmptyBooksIllustration className="text-primary/50" />}
              title="No books found"
              description="Try different keywords, genres, or clear filters."
              actionHref="/library"
              actionLabel="Clear filters"
            />
          ) : null
        ) : (
          <>
            {filteredBooks.length === 1 ? (
              <ul className="book-list mt-4">
                <BookCard
                  key={filteredBooks[0].id}
                  {...filteredBooks[0]}
                  userId={userId}
                  inWishlist={userId ? wishlistBookIds.includes(filteredBooks[0].id) : undefined}
                />
              </ul>
            ) : (
              <BookList
                title=""
                books={filteredBooks}
                containerClassName={showHighlights ? "mt-4" : ""}
                wishlistBookIds={wishlistBookIds}
                userId={userId}
              />
            )}
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              basePath="/library"
            />
          </>
        )}
      </div>
    </section>
  );
};

export default LibraryPage;
