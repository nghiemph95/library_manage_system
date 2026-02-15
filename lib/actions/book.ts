"use server";

import { db } from "@/database/drizzle";
import {
  books,
  borrowRecords,
  users,
  waitlist,
  wishlists,
  reviews,
} from "@/database/schema";
import { eq, and, desc, asc, sql, inArray, or, ilike, lte } from "drizzle-orm";
import dayjs from "dayjs";

const GUEST_EMAIL = process.env.GUEST_EMAIL;

export const borrowBook = async (params: BorrowBookParams) => {
  const { userId, bookId } = params;

  try {
    if (GUEST_EMAIL) {
      const [user] = await db
        .select({ email: users.email })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);
      if (user?.email === GUEST_EMAIL) {
        return {
          success: false,
          error:
            "Guest accounts cannot borrow books. Please sign in with a real account to borrow.",
        };
      }
    }

    const book = await db
      .select({ availableCopies: books.availableCopies })
      .from(books)
      .where(eq(books.id, bookId))
      .limit(1);

    if (!book.length || book[0].availableCopies <= 0) {
      return {
        success: false,
        error: "Book is not available for borrowing",
      };
    }

    const dueDate = dayjs().add(7, "day").toDate().toDateString();

    const record = await db.insert(borrowRecords).values({
      userId,
      bookId,
      dueDate,
      status: "BORROWED",
    });

    await db
      .update(books)
      .set({ availableCopies: book[0].availableCopies - 1 })
      .where(eq(books.id, bookId));

    return {
      success: true,
      data: JSON.parse(JSON.stringify(record)),
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      error: "An error occurred while borrowing the book",
    };
  }
};

export const returnBook = async (params: {
  borrowRecordId: string;
  userId: string;
}) => {
  const { borrowRecordId, userId } = params;
  try {
    const [record] = await db
      .select()
      .from(borrowRecords)
      .where(
        and(
          eq(borrowRecords.id, borrowRecordId),
          eq(borrowRecords.userId, userId),
          eq(borrowRecords.status, "BORROWED")
        )
      )
      .limit(1);
    if (!record) {
      return { success: false, error: "Borrow record not found or already returned." };
    }
    const today = dayjs().format("YYYY-MM-DD");
    await db
      .update(borrowRecords)
      .set({ status: "RETURNED", returnDate: today })
      .where(eq(borrowRecords.id, borrowRecordId));
    const [book] = await db
      .select({ availableCopies: books.availableCopies })
      .from(books)
      .where(eq(books.id, record.bookId))
      .limit(1);
    if (book) {
      await db
        .update(books)
        .set({ availableCopies: book.availableCopies + 1 })
        .where(eq(books.id, record.bookId));
    }
    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Failed to return book." };
  }
};

export const getBorrowedBooks = async (
  userId: string,
  limit?: number
): Promise<BorrowedBook[]> => {
  const records = await db
    .select({
      book: books,
      dueDate: borrowRecords.dueDate,
      recordId: borrowRecords.id,
    })
    .from(borrowRecords)
    .innerJoin(books, eq(borrowRecords.bookId, books.id))
    .where(
      and(
        eq(borrowRecords.userId, userId),
        eq(borrowRecords.status, "BORROWED")
      )
    )
    .limit(limit ?? 100);

  return records.map(({ book, dueDate, recordId }) => {
    const due = dayjs(dueDate);
    const daysLeft = due.diff(dayjs(), "day");
    return {
      ...book,
      isLoanedBook: true,
      dueDate: dueDate ?? undefined,
      daysLeft: daysLeft >= 0 ? daysLeft : 0,
      borrowRecordId: recordId,
    } as BorrowedBook;
  });
};

export type LibrarySort = "newest" | "popular" | "title";

export const getBooksFilteredPaginated = async (params: {
  search?: string;
  genre?: string;
  sort?: LibrarySort;
  page?: number;
  pageSize?: number;
}): Promise<{ books: Book[]; total: number }> => {
  const { search = "", genre = "", sort = "newest", page = 1, pageSize = 12 } = params;
  const conditions = [];
  if (search.trim()) {
    const pattern = `%${search.trim()}%`;
    conditions.push(or(ilike(books.title, pattern), ilike(books.author, pattern))!);
  }
  if (genre) {
    conditions.push(eq(books.genre, genre));
  }
  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const totalResult = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(books)
    .where(whereClause);
  const total = totalResult[0]?.count ?? 0;

  const offset = (page - 1) * pageSize;
  let orderByClause = desc(books.createdAt);
  if (sort === "title") {
    orderByClause = asc(books.title);
  }
  if (sort === "popular") {
    const rows = await db
      .select()
      .from(books)
      .where(whereClause)
      .orderBy(
        desc(
          sql`(SELECT count(*)::int FROM borrow_records WHERE borrow_records.book_id = ${books.id})`
        )
      )
      .limit(pageSize)
      .offset(offset);
    return { books: rows as Book[], total };
  }

  const rows = await db
    .select()
    .from(books)
    .where(whereClause)
    .orderBy(orderByClause)
    .limit(pageSize)
    .offset(offset);
  return { books: rows as Book[], total };
};

export const getNewArrivals = async (limit: number): Promise<Book[]> => {
  const rows = await db
    .select()
    .from(books)
    .orderBy(desc(books.createdAt))
    .limit(limit);
  return rows as Book[];
};

export const getPopularBooks = async (limit: number): Promise<Book[]> => {
  const popularRows = await db
    .select({
      bookId: borrowRecords.bookId,
      count: sql<number>`count(*)::int`,
    })
    .from(borrowRecords)
    .groupBy(borrowRecords.bookId)
    .orderBy(desc(sql`count(*)`))
    .limit(limit);
  if (popularRows.length === 0) return [];
  const ids = popularRows.map((r) => r.bookId);
  const rows = await db
    .select()
    .from(books)
    .where(inArray(books.id, ids));
  return rows as Book[];
};

export const addToWaitlist = async (params: {
  bookId: string;
  userId: string;
}) => {
  try {
    await db.insert(waitlist).values({
      userId: params.userId,
      bookId: params.bookId,
    });
    return { success: true };
  } catch (e) {
    return { success: false, error: "Already on waitlist or failed to add." };
  }
};

export const removeFromWaitlist = async (params: {
  bookId: string;
  userId: string;
}) => {
  try {
    await db
      .delete(waitlist)
      .where(
        and(
          eq(waitlist.userId, params.userId),
          eq(waitlist.bookId, params.bookId)
        )
      );
    return { success: true };
  } catch (e) {
    return { success: false, error: "Failed to remove from waitlist." };
  }
};

export const isOnWaitlist = async (params: {
  bookId: string;
  userId: string;
}): Promise<boolean> => {
  const [row] = await db
    .select({ id: waitlist.id })
    .from(waitlist)
    .where(
      and(
        eq(waitlist.userId, params.userId),
        eq(waitlist.bookId, params.bookId)
      )
    )
    .limit(1);
  return !!row;
};

export const isInWishlist = async (params: {
  bookId: string;
  userId: string;
}): Promise<boolean> => {
  const [row] = await db
    .select({ id: wishlists.id })
    .from(wishlists)
    .where(
      and(
        eq(wishlists.userId, params.userId),
        eq(wishlists.bookId, params.bookId)
      )
    )
    .limit(1);
  return !!row;
};

export const getWishlistBookIds = async (userId: string): Promise<string[]> => {
  const rows = await db
    .select({ bookId: wishlists.bookId })
    .from(wishlists)
    .where(eq(wishlists.userId, userId));
  return rows.map((r) => r.bookId);
};

export const getWishlistBooks = async (userId: string): Promise<Book[]> => {
  const rows = await db
    .select({ book: books })
    .from(wishlists)
    .innerJoin(books, eq(wishlists.bookId, books.id))
    .where(eq(wishlists.userId, userId))
    .orderBy(desc(wishlists.createdAt));
  return rows.map((r) => r.book) as Book[];
};

export const addToWishlist = async (params: {
  bookId: string;
  userId: string;
}) => {
  try {
    await db.insert(wishlists).values({
      userId: params.userId,
      bookId: params.bookId,
    });
    return { success: true };
  } catch (e) {
    return { success: false, error: "Already in wishlist or failed to add." };
  }
};

export const removeFromWishlist = async (params: {
  bookId: string;
  userId: string;
}) => {
  try {
    await db
      .delete(wishlists)
      .where(
        and(
          eq(wishlists.userId, params.userId),
          eq(wishlists.bookId, params.bookId)
        )
      );
    return { success: true };
  } catch (e) {
    return { success: false, error: "Failed to remove from wishlist." };
  }
};

export const submitReview = async (params: {
  bookId: string;
  userId: string;
  rating: number;
  comment?: string;
}) => {
  const { bookId, userId, rating, comment } = params;
  if (rating < 1 || rating > 5) {
    return { success: false, error: "Rating must be between 1 and 5." };
  }
  try {
    const existing = await db
      .select({ id: reviews.id })
      .from(reviews)
      .where(and(eq(reviews.bookId, bookId), eq(reviews.userId, userId)))
      .limit(1);
    if (existing.length > 0) {
      await db
        .update(reviews)
        .set({ rating, comment: comment ?? null })
        .where(eq(reviews.id, existing[0].id));
    } else {
      await db.insert(reviews).values({
        userId,
        bookId,
        rating,
        comment: comment ?? null,
      });
    }
    return { success: true };
  } catch (e) {
    return { success: false, error: "Failed to submit review." };
  }
};

export type ReviewWithUser = {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: Date | null;
  userName: string | null;
};

/** For cron: borrow records due in 1 day or overdue, with user email and book title. */
export const getBorrowReminderCandidates = async (): Promise<
  { recordId: string; userEmail: string; userName: string; bookTitle: string; dueDate: string }[]
> => {
  const tomorrow = dayjs().add(1, "day").format("YYYY-MM-DD");
  const rows = await db
    .select({
      recordId: borrowRecords.id,
      userEmail: users.email,
      userName: users.fullName,
      bookTitle: books.title,
      dueDate: borrowRecords.dueDate,
    })
    .from(borrowRecords)
    .innerJoin(books, eq(borrowRecords.bookId, books.id))
    .innerJoin(users, eq(borrowRecords.userId, users.id))
    .where(
      and(
        eq(borrowRecords.status, "BORROWED"),
        lte(borrowRecords.dueDate, tomorrow)
      )
    );
  return rows.map((r) => ({
    recordId: r.recordId,
    userEmail: r.userEmail,
    userName: r.userName,
    bookTitle: r.bookTitle,
    dueDate: r.dueDate,
  }));
};

/** Returns current borrow record id if user has this book borrowed (for receipt link). */
export const getCurrentBorrowRecordId = async (
  userId: string,
  bookId: string
): Promise<string | null> => {
  const [row] = await db
    .select({ id: borrowRecords.id })
    .from(borrowRecords)
    .where(
      and(
        eq(borrowRecords.userId, userId),
        eq(borrowRecords.bookId, bookId),
        eq(borrowRecords.status, "BORROWED")
      )
    )
    .limit(1);
  return row?.id ?? null;
};

export const getAverageRatingForBook = async (
  bookId: string
): Promise<{ average: number; count: number } | null> => {
  const [row] = await db
    .select({
      average: sql<number>`coalesce(round(avg(${reviews.rating})::numeric, 1), 0)`,
      count: sql<number>`count(*)::int`,
    })
    .from(reviews)
    .where(eq(reviews.bookId, bookId))
    .groupBy(reviews.bookId);
  if (!row || row.count === 0) return null;
  return { average: Number(row.average), count: row.count };
};

export const getReviewsForBook = async (
  bookId: string
): Promise<ReviewWithUser[]> => {
  const rows = await db
    .select({
      id: reviews.id,
      rating: reviews.rating,
      comment: reviews.comment,
      createdAt: reviews.createdAt,
      userName: users.fullName,
    })
    .from(reviews)
    .innerJoin(users, eq(reviews.userId, users.id))
    .where(eq(reviews.bookId, bookId))
    .orderBy(desc(reviews.createdAt))
    .limit(50);
  return rows.map((r) => ({
    id: r.id,
    rating: r.rating,
    comment: r.comment,
    createdAt: r.createdAt,
    userName: r.userName,
  }));
};
