import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signOut } from "@/auth";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/database/drizzle";
import { books, borrowRecords } from "@/database/schema";
import { eq, and, desc } from "drizzle-orm";
import dayjs from "dayjs";
import BookCard from "@/components/BookCard";
import { getBorrowedBooks } from "@/lib/actions/book";
import { ADMIN_DEMO_CREDENTIALS_LINK } from "@/constants";
import config from "@/lib/config";

interface BorrowHistoryItem {
  book: Book;
  borrowDate: string | null;
  returnDate: string | null;
}

const getBorrowHistory = async (userId: string): Promise<BorrowHistoryItem[]> => {
  const records = await db
    .select({
      book: books,
      borrowDate: borrowRecords.borrowDate,
      returnDate: borrowRecords.returnDate,
    })
    .from(borrowRecords)
    .innerJoin(books, eq(borrowRecords.bookId, books.id))
    .where(
      and(
        eq(borrowRecords.userId, userId),
        eq(borrowRecords.status, "RETURNED")
      )
    )
    .orderBy(desc(borrowRecords.returnDate))
    .limit(20);
  return records.map(({ book, borrowDate, returnDate }) => ({
    book,
    borrowDate: borrowDate ? dayjs(borrowDate).format("YYYY-MM-DD") : null,
    returnDate: returnDate ?? null,
  }));
};

const MyProfilePage = async () => {
  const session = await auth();

  if (!session?.user?.id) redirect("/sign-in");

  const userId = session.user.id;
  const [borrowedBooks, borrowHistory] = await Promise.all([
    getBorrowedBooks(userId, 100),
    getBorrowHistory(userId),
  ]);
  const isGuest =
    !!config.env.guestEmail && session.user?.email === config.env.guestEmail;

  return (
    <>
      {isGuest && (
        <div className="mb-8 rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm text-light-100">
          <p className="font-medium text-white">
            Want to try the Admin experience?
          </p>
          <p className="mt-1">
            Demo username and password are on{" "}
            <Link
              href={ADMIN_DEMO_CREDENTIALS_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary underline underline-offset-2 hover:no-underline"
            >
              Nghiêm Phạm&apos;s LinkedIn profile
            </Link>
            . Log out and sign in with those credentials to access the admin portal.
          </p>
        </div>
      )}

      <form
        action={async () => {
          "use server";

          await signOut();
        }}
        className="mb-10"
      >
        <Button>Logout</Button>
      </form>

      <section>
        <h2 className="font-bebas-neue text-4xl text-light-100">
          Borrowed Books
        </h2>

        {borrowedBooks.length === 0 ? (
          <p className="mt-6 text-light-200">
            You haven&apos;t borrowed any books yet. Visit the{" "}
            <a href="/library" className="text-primary underline">
              Library
            </a>{" "}
            to borrow books.
          </p>
        ) : (
          <ul className="book-list mt-8">
            {borrowedBooks.map((book) => (
              <li key={book.id} className="flex flex-col items-center">
                <BookCard {...book} userId={userId} />
              </li>
            ))}
          </ul>
        )}
      </section>

      {borrowHistory.length > 0 && (
        <section className="mt-16">
          <h2 className="font-bebas-neue text-4xl text-light-100">
            Borrow history
          </h2>
          <p className="mt-1 text-sm text-light-200">
            Books you&apos;ve returned
          </p>
          <ul className="book-list mt-6">
            {borrowHistory.map(({ book, borrowDate, returnDate }) => (
              <li key={`${book.id}-${returnDate}`}>
                <BookCard {...book} />
                <p className="mt-2 text-center text-xs text-light-500">
                  Borrowed {borrowDate} · Returned {returnDate}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
};

export default MyProfilePage;
