import BookList from "@/components/BookList";
import BookCard from "@/components/BookCard";
import LibrarySearch from "@/components/LibrarySearch";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { desc, ilike, or, and, eq } from "drizzle-orm";
import { Suspense } from "react";

interface Props {
  searchParams: Promise<{ search?: string; genre?: string }>;
}

const LibraryPage = async ({ searchParams }: Props) => {
  const params = await searchParams;
  const search = params.search?.trim() ?? "";
  const genre = params.genre ?? "";

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

  return (
    <section>
      <h1 className="font-bebas-neue text-4xl text-light-100">Library</h1>

      <Suspense fallback={<div className="my-4 h-10 animate-pulse rounded bg-dark-300" />}>
        <LibrarySearch genres={genres} />
      </Suspense>

      {filteredBooks.length === 0 ? (
        <p className="mt-6 text-light-200">
          No books found. Try adjusting your search or filter.
        </p>
      ) : filteredBooks.length === 1 ? (
        <ul className="book-list mt-8">
          <BookCard key={filteredBooks[0].id} {...filteredBooks[0]} />
        </ul>
      ) : (
        <BookList title="" books={filteredBooks} containerClassName="" />
      )}
    </section>
  );
};

export default LibraryPage;
