import { ReactNode } from "react";
import Header from "@/components/Header";
import GuestBanner from "@/components/GuestBanner";
import Footer from "@/components/Footer";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { getWishlistBookIds } from "@/lib/actions/book";

const Layout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();

  if (!session) redirect("/sign-in");

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, session?.user?.id!))
    .limit(1);

  const wishlistCount = session?.user?.id
    ? (await getWishlistBookIds(session.user.id)).length
    : 0;

  after(async () => {
    if (!user?.id) return;

    if (user.lastActivityDate === new Date().toISOString().slice(0, 10))
      return;

    await db
      .update(users)
      .set({ lastActivityDate: new Date().toISOString().slice(0, 10) })
      .where(eq(users.id, user.id));
  });

  return (
    <main className="root-container">
      <div className="mx-auto min-w-0 w-full max-w-7xl">
        <Header
          session={session}
          user={
            user
              ? {
                  fullName: user.fullName,
                  universityCard: user.universityCard,
                  role: user.role ?? undefined,
                }
              : undefined
          }
          wishlistCount={wishlistCount}
        />

        <div className="mt-20 flex min-h-[calc(100vh-8rem)] flex-col pb-24">
          <div className="px-2">
            <GuestBanner session={session} />
          </div>
          <div className="mt-4 flex-1 page-transition-in">{children}</div>
        </div>
        <Footer />
      </div>
    </main>
  );
};

export default Layout;
