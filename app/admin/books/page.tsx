import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { desc } from "drizzle-orm";

const AdminBooksPage = async () => {
  const allBooks = await db
    .select()
    .from(books)
    .orderBy(desc(books.createdAt));

  return (
    <section className="w-full rounded-2xl bg-white p-7">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold text-dark-400">All Books</h2>
        <Button className="bg-primary-admin" asChild>
          <Link href="/admin/books/new" className="text-white">
            + Create a New Book
          </Link>
        </Button>
      </div>

      <p className="mt-1 text-sm text-light-500">
        Manage library books with search and filters
      </p>

      {allBooks.length === 0 ? (
        <p className="mt-10 text-center text-light-500">
          No books in the library. Create your first book!
        </p>
      ) : (
        <div className="mt-7 overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse">
            <thead>
              <tr className="border-b border-light-500">
                <th className="pb-3 text-left text-sm font-semibold text-dark-400">
                  Title
                </th>
                <th className="pb-3 text-left text-sm font-semibold text-dark-400">
                  Author
                </th>
                <th className="pb-3 text-left text-sm font-semibold text-dark-400">
                  Genre
                </th>
                <th className="pb-3 text-left text-sm font-semibold text-dark-400">
                  Copies
                </th>
                <th className="pb-3 text-left text-sm font-semibold text-dark-400">
                  Available
                </th>
                <th className="pb-3 text-left text-sm font-semibold text-dark-400">
                  Added
                </th>
              </tr>
            </thead>
            <tbody>
              {allBooks.map((book) => (
                <tr
                  key={book.id}
                  className="border-b border-light-500/50 last:border-0"
                >
                  <td className="py-4">
                    <Link
                      href={`/books/${book.id}`}
                      className="text-sm font-medium text-primary-admin hover:underline"
                    >
                      {book.title}
                    </Link>
                  </td>
                  <td className="py-4 text-sm text-light-500">{book.author}</td>
                  <td className="py-4 text-sm text-light-500">{book.genre}</td>
                  <td className="py-4 text-sm text-light-500">
                    {book.totalCopies}
                  </td>
                  <td className="py-4 text-sm text-light-500">
                    {book.availableCopies}
                  </td>
                  <td className="py-4 text-sm text-light-500">
                    {book.createdAt
                      ? new Date(book.createdAt).toLocaleDateString()
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default AdminBooksPage;
