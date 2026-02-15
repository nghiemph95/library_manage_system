import Link from "next/link";
import BookCard from "@/components/BookCard";
import WelcomeIntroWrapper from "@/components/WelcomeIntroWrapper";
import DashboardStats from "@/components/DashboardStats";
import DashboardShortcuts from "@/components/DashboardShortcuts";
import { auth } from "@/auth";
import {
  getBorrowedBooks,
  getWishlistBookIds,
  getNewArrivals,
  getPopularBooks,
} from "@/lib/actions/book";

interface HomeProps {
  searchParams: Promise<{ welcome?: string }>;
}

const Home = async ({ searchParams }: HomeProps) => {
  const session = await auth();
  const params = await searchParams;
  const showWelcomeIntro = params?.welcome === "1";
  const userId = session?.user?.id ?? undefined;

  const [borrowedAll, wishlistBookIds, newArrivals, popularBooks] =
    await Promise.all([
      userId ? getBorrowedBooks(userId) : [],
      userId ? getWishlistBookIds(userId) : [],
      getNewArrivals(4),
      getPopularBooks(4),
    ]);

  const borrowingCount = borrowedAll.length;
  const wishlistCount = wishlistBookIds.length;
  const dueSoonCount = borrowedAll.filter(
    (b) => b.daysLeft !== undefined && b.daysLeft <= 7
  ).length;
  const borrowedBooks = borrowedAll.slice(0, 3);

  const displayName =
    session?.user?.name?.split(" ")[0] || session?.user?.email?.split("@")[0] || "there";

  return (
    <WelcomeIntroWrapper showIntro={showWelcomeIntro}>
      <section className="dashboard-home">
        <h1 className="font-bebas-neue text-4xl text-white xs:text-5xl">
          Welcome back, {displayName}
        </h1>
        <p className="mt-1 text-light-200">Your library at a glance</p>

        {userId && (
          <>
            <DashboardStats
              borrowing={borrowingCount}
              wishlist={wishlistCount}
              dueSoon={dueSoonCount}
            />
            <DashboardShortcuts />
          </>
        )}

        {userId && borrowedBooks.length > 0 && (
          <section className="mt-10">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="dashboard-section-title">Your borrowed books</h2>
              <Link href="/my-profile" className="dashboard-section-link">
                View all
              </Link>
            </div>
            <ul className="book-list mt-4">
              {borrowedBooks.map((book) => (
                <BookCard
                  key={book.id}
                  {...book}
                  userId={userId}
                  inWishlist={wishlistBookIds.includes(book.id)}
                />
              ))}
            </ul>
          </section>
        )}

        <section className="mt-10">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="dashboard-section-title">New arrivals</h2>
            <Link href="/library" className="dashboard-section-link">
              See all
            </Link>
          </div>
          {newArrivals.length > 0 ? (
            <ul className="book-list mt-4">
              {newArrivals.map((book) => (
                <BookCard
                  key={book.id}
                  {...book}
                  userId={userId}
                  inWishlist={userId ? wishlistBookIds.includes(book.id) : undefined}
                />
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-light-200">No books yet.</p>
          )}
        </section>

        <section className="mt-10">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="dashboard-section-title">Popular</h2>
            <Link href="/library" className="dashboard-section-link">
              See all
            </Link>
          </div>
          {popularBooks.length > 0 ? (
            <ul className="book-list mt-4">
              {popularBooks.map((book) => (
                <BookCard
                  key={book.id}
                  {...book}
                  userId={userId}
                  inWishlist={userId ? wishlistBookIds.includes(book.id) : undefined}
                />
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-light-200">No data yet.</p>
          )}
        </section>
      </section>
    </WelcomeIntroWrapper>
  );
};

export default Home;
