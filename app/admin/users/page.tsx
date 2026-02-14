import React from "react";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { desc } from "drizzle-orm";

const AdminUsersPage = async () => {
  const allUsers = await db
    .select({
      id: users.id,
      fullName: users.fullName,
      email: users.email,
      status: users.status,
      role: users.role,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(desc(users.createdAt));

  return (
    <section className="w-full rounded-2xl bg-white p-7">
      <h2 className="text-xl font-semibold text-dark-400">All Users</h2>
      <p className="mt-1 text-sm text-light-500">
        View and manage all registered users
      </p>

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
                Status
              </th>
              <th className="pb-3 text-left text-sm font-semibold text-dark-400">
                Role
              </th>
              <th className="pb-3 text-left text-sm font-semibold text-dark-400">
                Joined
              </th>
            </tr>
          </thead>
          <tbody>
            {allUsers.map((user) => (
              <tr
                key={user.id}
                className="border-b border-light-500/50 last:border-0"
              >
                <td className="py-4 text-sm font-medium text-dark-400">
                  {user.fullName}
                </td>
                <td className="py-4 text-sm text-light-500">{user.email}</td>
                <td className="py-4">
                  <span
                    className={`rounded-full px-3 py-0.5 text-xs font-medium ${
                      user.status === "APPROVED"
                        ? "bg-green-100 text-green-800"
                        : user.status === "PENDING"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="py-4 text-sm text-light-500">{user.role}</td>
                <td className="py-4 text-sm text-light-500">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AdminUsersPage;
