import React, { ReactNode } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

import "@/styles/admin.css";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import AdminPageTransition from "@/components/admin/AdminPageTransition";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq, and, count } from "drizzle-orm";

const Layout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();

  if (!session?.user?.id) redirect("/sign-in");

  const isAdmin = await db
    .select({ isAdmin: users.role })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1)
    .then((res) => res[0]?.isAdmin === "ADMIN");

  if (!isAdmin) redirect("/");

  const [pendingResult] = await db
    .select({ count: count() })
    .from(users)
    .where(and(eq(users.status, "PENDING"), eq(users.role, "USER")));

  const pendingRequestsCount = pendingResult?.count ?? 0;

  return (
    <main className="flex min-h-screen w-full flex-row">
      <Sidebar session={session} pendingRequestsCount={pendingRequestsCount} />

      <div className="admin-container">
        <Header session={session} />
        <AdminPageTransition>{children}</AdminPageTransition>
      </div>
    </main>
  );
};
export default Layout;
