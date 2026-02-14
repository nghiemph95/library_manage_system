import React from "react";
import { db } from "@/database/drizzle";
import { borrowRecords, books, users } from "@/database/schema";
import { eq, desc } from "drizzle-orm";

const AdminBorrowRecordsPage = async () => {
  const records = await db
    .select({
      id: borrowRecords.id,
      borrowDate: borrowRecords.borrowDate,
      dueDate: borrowRecords.dueDate,
      returnDate: borrowRecords.returnDate,
      status: borrowRecords.status,
      userName: users.fullName,
      userEmail: users.email,
      bookTitle: books.title,
      bookAuthor: books.author,
    })
    .from(borrowRecords)
    .innerJoin(users, eq(borrowRecords.userId, users.id))
    .innerJoin(books, eq(borrowRecords.bookId, books.id))
    .orderBy(desc(borrowRecords.borrowDate));

  return (
    <section className="w-full rounded-2xl bg-white p-7">
      <h2 className="text-xl font-semibold text-dark-400">Borrow Records</h2>
      <p className="mt-1 text-sm text-light-500">
        Complete borrow history with user and book details
      </p>

      {records.length === 0 ? (
        <p className="mt-10 text-center text-light-500">No borrow records yet</p>
      ) : (
        <div className="mt-7 overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse">
            <thead>
              <tr className="border-b border-light-500">
                <th className="pb-3 text-left text-sm font-semibold text-dark-400">
                  User
                </th>
                <th className="pb-3 text-left text-sm font-semibold text-dark-400">
                  Book
                </th>
                <th className="pb-3 text-left text-sm font-semibold text-dark-400">
                  Borrowed
                </th>
                <th className="pb-3 text-left text-sm font-semibold text-dark-400">
                  Due Date
                </th>
                <th className="pb-3 text-left text-sm font-semibold text-dark-400">
                  Returned
                </th>
                <th className="pb-3 text-left text-sm font-semibold text-dark-400">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr
                  key={record.id}
                  className="border-b border-light-500/50 last:border-0"
                >
                  <td className="py-4">
                    <p className="text-sm font-medium text-dark-400">
                      {record.userName}
                    </p>
                    <p className="text-xs text-light-500">{record.userEmail}</p>
                  </td>
                  <td className="py-4">
                    <p className="text-sm font-medium text-dark-400">
                      {record.bookTitle}
                    </p>
                    <p className="text-xs text-light-500">{record.bookAuthor}</p>
                  </td>
                  <td className="py-4 text-sm text-light-500">
                    {record.borrowDate
                      ? new Date(record.borrowDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="py-4 text-sm text-light-500">
                    {record.dueDate
                      ? new Date(record.dueDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="py-4 text-sm text-light-500">
                    {record.returnDate
                      ? new Date(record.returnDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="py-4">
                    <span
                      className={`rounded-full px-3 py-0.5 text-xs font-medium ${
                        record.status === "BORROWED"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {record.status}
                    </span>
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

export default AdminBorrowRecordsPage;
