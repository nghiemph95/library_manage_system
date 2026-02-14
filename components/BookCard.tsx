import React from "react";
import Link from "next/link";
import BookCover from "@/components/BookCover";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";

const BookCard = ({
  id,
  title,
  genre,
  coverColor,
  coverUrl,
  isLoanedBook = false,
  daysLeft,
  dueDate,
}: Book) => (
  <li className={cn(isLoanedBook && "xs:w-52 w-full")}>
    <Link
      href={`/books/${id}`}
      className={cn(isLoanedBook && "w-full flex flex-col items-center")}
    >
      <BookCover coverColor={coverColor} coverImage={coverUrl} />

      <div className={cn("mt-4", !isLoanedBook && "xs:max-w-40 max-w-28")}>
        <p className="book-title">{title}</p>
        <p className="book-genre">{genre}</p>
      </div>

      {isLoanedBook && (
        <div className="mt-3 w-full space-y-2">
          <div className="flex flex-col gap-0.5">
            <div className="book-loaned">
              <Image
                src="/icons/calendar.svg"
                alt="calendar"
                width={18}
                height={18}
                className="object-contain"
              />
              <p className="text-light-100">
                {daysLeft !== undefined
                  ? daysLeft === 0
                    ? "Due today"
                    : daysLeft === 1
                      ? "1 day left to return"
                      : `${daysLeft} days left to return`
                  : "11 days left to return"}
              </p>
            </div>
            {dueDate && (
              <p className="pl-6 text-xs text-light-500">
                Due date: {dayjs(dueDate).format("D MMM YYYY")}
              </p>
            )}
          </div>

          <Button className="book-btn">Download receipt</Button>
        </div>
      )}
    </Link>
  </li>
);

export default BookCard;
