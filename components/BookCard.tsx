import React from "react";
import Link from "next/link";
import BookCover from "@/components/BookCover";
import WishlistButton from "@/components/WishlistButton";
import ReturnBookButton from "@/components/ReturnBookButton";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";

interface BookCardProps extends Book {
  userId?: string;
  inWishlist?: boolean;
}

const BookCard = ({
  id,
  title,
  genre,
  coverColor,
  coverUrl,
  isLoanedBook = false,
  daysLeft,
  dueDate,
  borrowRecordId,
  availableCopies,
  totalCopies,
  userId,
  inWishlist = false,
}: BookCardProps) => (
  <li className={cn(isLoanedBook && "xs:w-52 w-full")}>
    <div
      className={cn(
        isLoanedBook && "w-full flex flex-col items-center",
        !isLoanedBook && "relative"
      )}
    >
      {userId && !isLoanedBook && (
        <div className="absolute right-0 top-0 z-10">
          <WishlistButton
            bookId={id}
            userId={userId}
            initialInWishlist={inWishlist}
            size="sm"
          />
        </div>
      )}
      <Link
        href={`/books/${id}`}
        className={cn(!isLoanedBook && "block")}
      >
        <BookCover coverColor={coverColor} coverImage={coverUrl} />
        <div className={cn("mt-4", !isLoanedBook && "xs:max-w-40 max-w-28")}>
          <p className="book-title">{title}</p>
          <p className="book-genre">{genre}</p>
        </div>
      </Link>

      {isLoanedBook && (
        <div className="mt-3 w-full space-y-2">
          <div className="flex flex-col gap-0.5">
            <div
              className={`book-loaned rounded-lg px-2 py-1 ${
                daysLeft !== undefined && daysLeft <= 7
                  ? "bg-amber-500/20 text-amber-200"
                  : "bg-dark-300/60 text-light-100"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Image
                  src="/icons/calendar.svg"
                  alt="calendar"
                  width={18}
                  height={18}
                  className="object-contain"
                />
                <span className="font-medium">
                  {daysLeft !== undefined
                    ? daysLeft === 0
                      ? "Due today"
                      : daysLeft === 1
                        ? "1 day left"
                        : `${daysLeft} days left`
                    : "—"}
                </span>
              </div>
            </div>
            {dueDate && (
              <p className="pl-1 text-xs text-light-500">
                Due: {dayjs(dueDate).format("D MMM YYYY")}
              </p>
            )}
          </div>
          <div className="book-card-actions">
            {borrowRecordId ? (
              <Link href={`/books/${id}/receipt?recordId=${borrowRecordId}`} className="w-full">
                <Button className="book-btn w-full whitespace-nowrap">Download receipt</Button>
              </Link>
            ) : (
              <Button className="book-btn w-full whitespace-nowrap" disabled>Download receipt</Button>
            )}
            {borrowRecordId && userId && (
              <ReturnBookButton
                borrowRecordId={borrowRecordId}
                userId={userId}
                variant="square"
              />
            )}
          </div>
        </div>
      )}

      {!isLoanedBook && totalCopies !== undefined && (
        <div className="mt-1">
          {availableCopies === 0 ? (
            <span className="rounded bg-rose-500/20 px-2 py-0.5 text-xs text-rose-400">Out of stock</span>
          ) : availableCopies <= 2 ? (
            <span className="rounded bg-amber-500/20 px-2 py-0.5 text-xs text-amber-400">{availableCopies} left</span>
          ) : null}
        </div>
      )}
    </div>
  </li>
);

export default BookCard;
