import React from "react";
import BookCard from "./BookCard";

interface Props {
  title?: string;
  books: Book[];
  containerClassName?: string;
  showAsLoaned?: boolean;
}

const BookList = ({
  title = "",
  books,
  containerClassName,
  showAsLoaned,
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
          <BookCard key={book.id} {...book} />
        ))}
      </ul>
    </section>
  );
};
export default BookList;
