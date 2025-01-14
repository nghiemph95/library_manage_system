import BookList from "@/components/BookList";
import BookOverview from "@/components/BookOverview";
import { sampleBooks } from "@/constants";

const Home = () => {
  return (
    <>
      <BookOverview {...sampleBooks[0]} />

      <BookList
        title="Latest Books"
        // books={latestBooks.slice(1)}
        books={sampleBooks}
        containerClassName="mt-28"
      />
    </>
  );
};

export default Home;
