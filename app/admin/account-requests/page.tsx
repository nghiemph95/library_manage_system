import React from "react";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq, and, desc } from "drizzle-orm";
import AccountRequestActions from "@/components/admin/AccountRequestActions";

const AdminAccountRequestsPage = async () => {
  // Only show PENDING users with role USER (exclude ADMIN - root users)
  const pendingUsers = await db
    .select()
    .from(users)
    .where(and(eq(users.status, "PENDING"), eq(users.role, "USER")))
    .orderBy(desc(users.createdAt));

  return (
    <section className="w-full rounded-2xl bg-white p-7">
      <h2 className="text-xl font-semibold text-dark-400">Account Requests</h2>
      <p className="mt-1 text-sm text-light-500">
        Approve or reject user registration requests
      </p>

      {pendingUsers.length === 0 ? (
        <p className="mt-10 text-center text-light-500">
          No pending account requests
        </p>
      ) : (
        <div className="mt-7 overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse">
            <thead>
              <tr className="border-b border-light-500">
                <th className="pb-3 text-left text-sm font-semibold text-dark-400">
                  Name
                </th>
                <th className="pb-3 text-left text-sm font-semibold text-dark-400">
                  Email
                </th>
                <th className="pb-3 text-left text-sm font-semibold text-dark-400">
                  University ID
                </th>
                <th className="pb-3 text-left text-sm font-semibold text-dark-400">
                  Requested
                </th>
                <th className="pb-3 text-left text-sm font-semibold text-dark-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {pendingUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-light-500/50 last:border-0"
                >
                  <td className="py-4 text-sm font-medium text-dark-400">
                    {user.fullName}
                  </td>
                  <td className="py-4 text-sm text-light-500">{user.email}</td>
                  <td className="py-4 text-sm text-light-500">
                    {user.universityId}
                  </td>
                  <td className="py-4 text-sm text-light-500">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="py-4">
                    <AccountRequestActions userId={user.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default AdminAccountRequestsPage;
