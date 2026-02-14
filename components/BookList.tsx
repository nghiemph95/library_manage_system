import React from "react";
import BookCard from "./BookCard";

interface Props {
  title?: string;
  books: Book[];
  containerClassName?: string;
  showAsLoaned?: boolean;
  wishlistBookIds?: string[];
  userId?: string;
}

const BookList = ({
  title = "",
  books,
  containerClassName,
  showAsLoaned,
  wishlistBookIds = [],
  userId,
}: Props) => {
  if (books.length === 0) return null;
  if (books.length === 1 && !showAsLoaned) return null;

  return (
    <section className={containerClassName}>
      {title && (
        <h2 className="font-bebas-neue text-4xl text-light-100">{title}</h2>
      )}

      <ul className={showAsLoaned ? "book-list mt-8" : "book-list"}>
        {books.map((book) => (
          <BookCard
            key={book.id}
            {...book}
            userId={userId}
            inWishlist={userId ? wishlistBookIds.includes(book.id) : undefined}
          />
        ))}
      </ul>
    </section>
  );
};
export default BookList;
