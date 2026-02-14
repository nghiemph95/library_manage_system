import React from "react";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { eq, and, ne } from "drizzle-orm";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import BookOverview from "@/components/BookOverview";
import BookVideo from "@/components/BookVideo";
import BookList from "@/components/BookList";
import BookCard from "@/components/BookCard";
import ReviewForm from "@/components/ReviewForm";
import ReviewList from "@/components/ReviewList";
import { isOnWaitlist, isInWishlist, getReviewsForBook, getWishlistBookIds } from "@/lib/actions/book";
import Link from "next/link";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const [book] = await db
    .select({ title: books.title, description: books.description })
    .from(books)
    .where(eq(books.id, id))
    .limit(1);
  if (!book) return { title: "Book not found" };
  return {
    title: `${book.title} | BookWise`,
    description: book.description.slice(0, 160),
  };
}

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  const session = await auth();

  const [bookDetails] = await db
    .select()
    .from(books)
    .where(eq(books.id, id))
    .limit(1);

  if (!bookDetails) redirect("/404");

  const similarBooks = (await db
    .select()
    .from(books)
    .where(and(eq(books.genre, bookDetails.genre), ne(books.id, id)))
    .limit(6)) as Book[];

  const userId = session?.user?.id ?? "";
  const [onWaitlist, inWishlist, reviewsList, wishlistBookIds] = await Promise.all([
    userId ? isOnWaitlist({ bookId: id, userId }) : false,
    userId ? isInWishlist({ bookId: id, userId }) : false,
    getReviewsForBook(id),
    userId ? getWishlistBookIds(userId) : [] as string[],
  ]);

  return (
    <>
      <nav className="mb-6 flex items-center gap-2 text-sm text-light-200">
        <Link href="/library" className="hover:text-primary">Library</Link>
        <span>/</span>
        <span className="text-light-100">{bookDetails.genre}</span>
        <span>/</span>
        <span className="text-white">{bookDetails.title}</span>
      </nav>

      <BookOverview
        {...bookDetails}
        userId={userId}
        onWaitlist={onWaitlist}
        inWishlist={inWishlist}
      />

      <div className="book-details">
        <div className="flex-[1.5]">
          <section className="flex flex-col gap-7">
            <h3>Video</h3>
            <BookVideo videoUrl={bookDetails.videoUrl} />
          </section>
          <section className="mt-10 flex flex-col gap-7">
            <h3>Summary</h3>
            <div className="space-y-5 text-xl text-light-100">
              {bookDetails.summary.split("\n").map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </section>

          <section className="mt-16 flex flex-col gap-7">
            <h3>Reviews</h3>
            {userId && <ReviewForm bookId={id} userId={userId} />}
            <ReviewList reviews={reviewsList} />
          </section>

          {similarBooks.length > 0 && (
            <section className="mt-16 flex flex-col gap-7">
              <h3>Similar Books</h3>
              {similarBooks.length === 1 ? (
                <ul className="book-list mt-4">
                  <BookCard
                    key={similarBooks[0].id}
                    {...similarBooks[0]}
                    userId={userId}
                    inWishlist={userId ? wishlistBookIds.includes(similarBooks[0].id) : undefined}
                  />
                </ul>
              ) : (
                <BookList
                  title=""
                  books={similarBooks}
                  containerClassName=""
                  wishlistBookIds={wishlistBookIds}
                  userId={userId}
                />
              )}
            </section>
          )}
        </div>
      </div>
    </>
  );
};
export default Page;
