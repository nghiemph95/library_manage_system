import BookList from "@/components/BookList";
import BookOverview from "@/components/BookOverview";
import WelcomeIntroWrapper from "@/components/WelcomeIntroWrapper";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { auth } from "@/auth";
import { desc } from "drizzle-orm";

interface HomeProps {
  searchParams: Promise<{ welcome?: string }>;
}

const Home = async ({ searchParams }: HomeProps) => {
  const session = await auth();
  const params = await searchParams;
  const showWelcomeIntro = params?.welcome === "1";

  const latestBooks = (await db
    .select()
    .from(books)
    .limit(10)
    .orderBy(desc(books.createdAt))) as Book[];

  return (
    <WelcomeIntroWrapper showIntro={showWelcomeIntro}>
      <BookOverview {...latestBooks[0]} userId={session?.user?.id as string} />

      <BookList
        title="Latest Books"
        books={latestBooks.slice(1)}
        containerClassName="mt-28"
      />
    </WelcomeIntroWrapper>
  );
};

export default Home;
