import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getWishlistBooks } from "@/lib/actions/book";
import BookList from "@/components/BookList";
import BookCard from "@/components/BookCard";
import Link from "next/link";

export default async function WishlistPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const wishlistBooks = await getWishlistBooks(session.user.id);
  const wishlistBookIds = wishlistBooks.map((b) => b.id);

  return (
    <section>
      <h1 className="font-bebas-neue text-4xl text-light-100">My Wishlist</h1>
      {wishlistBooks.length === 0 ? (
        <p className="mt-6 text-light-200">
          You haven&apos;t added any books to your wishlist. Browse the{" "}
          <Link href="/library" className="text-primary underline">
            Library
          </Link>{" "}
          and click the heart on a book to add it.
        </p>
      ) : wishlistBooks.length === 1 ? (
        <ul className="book-list mt-8">
          <BookCard
            {...wishlistBooks[0]}
            userId={session.user.id}
            inWishlist={true}
          />
        </ul>
      ) : (
        <BookList
          books={wishlistBooks}
          containerClassName="mt-8"
          wishlistBookIds={wishlistBookIds}
          userId={session.user.id}
        />
      )}
    </section>
  );
}
