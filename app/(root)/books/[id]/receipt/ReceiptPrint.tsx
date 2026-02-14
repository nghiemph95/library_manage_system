"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ReceiptPrint({
  bookTitle,
  bookAuthor,
  userName,
  borrowDate,
  dueDate,
  recordId,
}: {
  bookTitle: string;
  bookAuthor: string;
  userName: string;
  borrowDate: string;
  dueDate: string;
  recordId: string;
}) {
  return (
    <div className="receipt-root rounded-xl border border-light-100/20 bg-dark-200 p-6 print:border-0 print:bg-white print:text-black">
      <h1 className="text-xl font-bold text-white print:text-black">Borrow receipt</h1>
      <p className="mt-1 text-xs text-light-500 print:text-gray-600">BookWise Library</p>
      <dl className="mt-6 space-y-2 text-sm">
        <div>
          <dt className="text-light-500 print:text-gray-600">Borrow ID</dt>
          <dd className="font-mono text-white print:text-black">{recordId}</dd>
        </div>
        <div>
          <dt className="text-light-500 print:text-gray-600">Book</dt>
          <dd className="text-white print:text-black">{bookTitle}</dd>
          <dd className="text-light-200 print:text-gray-700">by {bookAuthor}</dd>
        </div>
        <div>
          <dt className="text-light-500 print:text-gray-600">Borrower</dt>
          <dd className="text-white print:text-black">{userName}</dd>
        </div>
        <div>
          <dt className="text-light-500 print:text-gray-600">Borrow date</dt>
          <dd className="text-white print:text-black">{borrowDate}</dd>
        </div>
        <div>
          <dt className="text-light-500 print:text-gray-600">Due date</dt>
          <dd className="text-white print:text-black">{dueDate}</dd>
        </div>
      </dl>
      <div className="mt-8 flex gap-3 print:hidden">
        <Button onClick={() => window.print()} className="flex-1">
          Print / Save as PDF
        </Button>
        <Button asChild variant="outline">
          <Link href="/my-profile">Back to My Profile</Link>
        </Button>
      </div>
    </div>
  );
}
