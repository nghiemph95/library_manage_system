import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getWishlistBooks } from "@/lib/actions/book";
import BookList from "@/components/BookList";
import BookCard from "@/components/BookCard";
import EmptyState from "@/components/EmptyState";
import EmptyWishlistIllustration from "@/components/illustrations/EmptyWishlist";

export default async function WishlistPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const wishlistBooks = await getWishlistBooks(session.user.id);
  const wishlistBookIds = wishlistBooks.map((b) => b.id);

  return (
    <section>
      <h1 className="font-bebas-neue text-4xl text-light-100">
        My Wishlist
        {wishlistBooks.length > 0 && (
          <span className="ml-2 text-2xl text-light-200">({wishlistBooks.length} books)</span>
        )}
      </h1>
      {wishlistBooks.length === 0 ? (
        <EmptyState
          illustration={<EmptyWishlistIllustration className="text-primary/40" />}
          title="No books in wishlist"
          description="Browse the library and click the heart on a book to add it here."
          actionHref="/library"
          actionLabel="Discover books"
        />
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
