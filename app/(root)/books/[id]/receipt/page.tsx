import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/database/drizzle";
import { books, borrowRecords, users } from "@/database/schema";
import { eq, and } from "drizzle-orm";
import ReceiptPrint from "./ReceiptPrint";

export default async function ReceiptPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ recordId?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const { id: bookId } = await params;
  const { recordId } = await searchParams;
  if (!recordId) redirect(`/books/${bookId}`);

  const [row] = await db
    .select({
      record: borrowRecords,
      book: books,
      user: users,
    })
    .from(borrowRecords)
    .innerJoin(books, eq(borrowRecords.bookId, books.id))
    .innerJoin(users, eq(borrowRecords.userId, users.id))
    .where(
      and(
        eq(borrowRecords.id, recordId),
        eq(borrowRecords.bookId, bookId),
        eq(borrowRecords.userId, session.user.id)
      )
    )
    .limit(1);

  if (!row) redirect(`/books/${bookId}`);

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <ReceiptPrint
        bookTitle={row.book.title}
        bookAuthor={row.book.author}
        userName={row.user.fullName}
        borrowDate={row.record.borrowDate ? new Date(row.record.borrowDate).toLocaleDateString() : ""}
        dueDate={row.record.dueDate ?? ""}
        recordId={row.record.id}
      />
    </div>
  );
}
