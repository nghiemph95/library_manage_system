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

  return (
    <>
      <BookOverview {...bookDetails} userId={session?.user?.id as string} />

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

          {similarBooks.length > 0 && (
            <section className="mt-16 flex flex-col gap-7">
              <h3>Similar Books</h3>
              {similarBooks.length === 1 ? (
                <ul className="book-list mt-4">
                  <BookCard key={similarBooks[0].id} {...similarBooks[0]} />
                </ul>
              ) : (
                <BookList
                  title=""
                  books={similarBooks}
                  containerClassName=""
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
