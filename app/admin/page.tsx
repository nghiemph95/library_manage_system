import React from "react";
import Link from "next/link";
import { db } from "@/database/drizzle";
import { users, books, borrowRecords } from "@/database/schema";
import { eq, and, count } from "drizzle-orm";

const AdminDashboardPage = async () => {
  const [usersCount] = await db
    .select({ count: count() })
    .from(users);

  const [booksCount] = await db
    .select({ count: count() })
    .from(books);

  const [borrowsCount] = await db
    .select({ count: count() })
    .from(borrowRecords)
    .where(eq(borrowRecords.status, "BORROWED"));

  const [pendingUsersCount] = await db
    .select({ count: count() })
    .from(users)
    .where(and(eq(users.status, "PENDING"), eq(users.role, "USER")));

  const stats = [
    {
      label: "Total Users",
      count: usersCount?.count ?? 0,
      href: "/admin/users",
    },
    {
      label: "Total Books",
      count: booksCount?.count ?? 0,
      href: "/admin/books",
    },
    {
      label: "Active Borrows",
      count: borrowsCount?.count ?? 0,
      href: "/admin/borrow-records",
    },
    {
      label: "Pending Requests",
      count: pendingUsersCount?.count ?? 0,
      href: "/admin/account-requests",
    },
  ];

  return (
    <section className="w-full space-y-10">
      <h1 className="text-2xl font-semibold text-dark-400">Analytics Dashboard</h1>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <div className="stat cursor-pointer transition-shadow hover:shadow-md">
              <div className="stat-info">
                <p className="stat-label">{stat.label}</p>
              </div>
              <p className="stat-count">{stat.count}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default AdminDashboardPage;
