import React from "react";
import { Button } from "@/components/ui/button";
import { signOut } from "@/auth";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/database/drizzle";
import { books, borrowRecords } from "@/database/schema";
import { eq, and } from "drizzle-orm";
import dayjs from "dayjs";
import BookCard from "@/components/BookCard";

const getBorrowedBooks = async (userId: string): Promise<BorrowedBook[]> => {
  const records = await db
    .select({
      book: books,
      dueDate: borrowRecords.dueDate,
    })
    .from(borrowRecords)
    .innerJoin(books, eq(borrowRecords.bookId, books.id))
    .where(
      and(
        eq(borrowRecords.userId, userId),
        eq(borrowRecords.status, "BORROWED")
      )
    );

  return records.map(({ book, dueDate }) => {
    const due = dayjs(dueDate);
    const daysLeft = due.diff(dayjs(), "day");
    return {
      ...book,
      isLoanedBook: true,
      dueDate: dueDate ?? undefined,
      daysLeft: daysLeft >= 0 ? daysLeft : 0,
    } as BorrowedBook;
  });
};

const MyProfilePage = async () => {
  const session = await auth();

  if (!session?.user?.id) redirect("/sign-in");

  const borrowedBooks = await getBorrowedBooks(session.user.id);

  return (
    <>
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
        ) : borrowedBooks.length === 1 ? (
          <ul className="book-list mt-8">
            <BookCard key={borrowedBooks[0].id} {...borrowedBooks[0]} />
          </ul>
        ) : (
          <ul className="book-list mt-8">
            {borrowedBooks.map((book) => (
              <BookCard key={book.id} {...book} />
            ))}
          </ul>
        )}
      </section>
    </>
  );
};

export default MyProfilePage;
