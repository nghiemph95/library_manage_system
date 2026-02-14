import React from "react";
import Image from "next/image";
import BookCover from "@/components/BookCover";
import BorrowBook from "@/components/BorrowBook";
import NotifyMeButton from "@/components/NotifyMeButton";
import WishlistButton from "@/components/WishlistButton";
import ShareBookButton from "@/components/ShareBookButton";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import config from "@/lib/config";

interface Props extends Book {
  userId: string;
  onWaitlist?: boolean;
  inWishlist?: boolean;
}
const BookOverview = async ({
  title,
  author,
  genre,
  rating,
  totalCopies,
  availableCopies,
  description,
  coverColor,
  coverUrl,
  id,
  userId,
  onWaitlist = false,
  inWishlist = false,
}: Props) => {
  // Fetch the user from the database
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  const isGuest =
    !!config.env.guestEmail && user?.email === config.env.guestEmail;

  // Admin can always borrow; other users need APPROVED status; guest cannot borrow
  const canBorrow =
    availableCopies > 0 &&
    !isGuest &&
    (user?.role === "ADMIN" || user?.status === "APPROVED");
  const borrowingEligibility = {
    isEligible: canBorrow,
    message: isGuest
      ? "Sign in with a real account to borrow books"
      : availableCopies <= 0
        ? "Book is not available"
        : "You are not eligible to borrow this book",
  };
  return (
    <section className="book-overview">
      <div className="flex flex-1 flex-col gap-5">
        <h1>{title}</h1>

        <div className="book-info">
          <p>
            By <span className="font-semibold text-light-200">{author}</span>
          </p>

          <p>
            Category{" "}
            <span className="font-semibold text-light-200">{genre}</span>
          </p>

          <div className="flex flex-row gap-1">
            <Image src="/icons/star.svg" alt="star" width={22} height={22} />
            <p>{rating}</p>
          </div>
        </div>

        <div className="book-copies">
          <p>
            Total Books <span>{totalCopies}</span>
          </p>

          <p>
            Available Books <span>{availableCopies}</span>
          </p>
        </div>

        <p className="book-description">{description}</p>

        <div className="flex flex-wrap items-center gap-2">
          {user && (
            <BorrowBook
              bookId={id}
              userId={userId}
              isGuest={isGuest}
              borrowingEligibility={borrowingEligibility}
            />
          )}
          {userId && availableCopies === 0 && (
            <NotifyMeButton
              bookId={id}
              userId={userId}
              initialOnList={onWaitlist}
            />
          )}
          {userId && (
            <WishlistButton
              bookId={id}
              userId={userId}
              initialInWishlist={inWishlist}
              variant="button"
            />
          )}
          <ShareBookButton title={title} bookId={id} />
        </div>
      </div>

      <div className="relative flex flex-1 justify-center">
        <div className="relative">
          <BookCover
            variant="wide"
            className="z-10"
            coverColor={coverColor}
            coverImage={coverUrl}
          />

          <div className="absolute left-16 top-10 rotate-12 opacity-40 max-sm:hidden">
            <BookCover
              variant="wide"
              coverColor={coverColor}
              coverImage={coverUrl}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookOverview;
