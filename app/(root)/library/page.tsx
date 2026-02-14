import BookList from "@/components/BookList";
import BookCard from "@/components/BookCard";
import LibrarySearch from "@/components/LibrarySearch";
import { db } from "@/database/drizzle";
import { books, borrowRecords } from "@/database/schema";
import { desc, ilike, or, and, eq, sql, inArray } from "drizzle-orm";
import { Suspense } from "react";
import { auth } from "@/auth";
import { getWishlistBookIds } from "@/lib/actions/book";

interface Props {
  searchParams: Promise<{ search?: string; genre?: string }>;
}

const LibraryPage = async ({ searchParams }: Props) => {
  const params = await searchParams;
  const search = params.search?.trim() ?? "";
  const genre = params.genre ?? "";
  const session = await auth();
  const userId = session?.user?.id ?? undefined;

  const conditions = [];
  if (search) {
    const pattern = `%${search}%`;
    conditions.push(or(ilike(books.title, pattern), ilike(books.author, pattern))!);
  }
  if (genre) {
    conditions.push(eq(books.genre, genre));
  }

  const filteredBooks = (await db
    .select()
    .from(books)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(books.createdAt))) as Book[];

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

  return (
    <section>
      <h1 className="font-bebas-neue text-4xl text-light-100">Library</h1>

      <Suspense fallback={<div className="my-4 h-10 animate-pulse rounded bg-dark-300" />}>
        <LibrarySearch genres={genres} />
      </Suspense>

      {showHighlights && newArrivals.length > 0 && (
        <div className="mt-10">
          <h2 className="font-bebas-neue text-2xl text-light-100">New arrivals</h2>
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
          <h2 className="font-bebas-neue text-2xl text-light-100">Popular</h2>
          <BookList
            books={trendingBooks}
            containerClassName="mt-4"
            wishlistBookIds={wishlistBookIds}
            userId={userId}
          />
        </div>
      )}

      {filteredBooks.length === 0 ? (
        search || genre ? (
          <p className="mt-6 text-light-200">
            No books found. Try adjusting your search or filter.
          </p>
        ) : null
      ) : (
        <div className={showHighlights ? "mt-10" : "mt-8"}>
          {showHighlights && <h2 className="font-bebas-neue text-2xl text-light-100">All books</h2>}
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
        </div>
      )}
    </section>
  );
};

export default LibraryPage;
