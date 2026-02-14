"use server";

import { auth } from "@/auth";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";

export const approveUser = async (userId: string) => {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  const [adminUser] = await db
    .select({ role: users.role })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  if (adminUser?.role !== "ADMIN") {
    return { success: false, error: "Unauthorized" };
  }

  const [targetUser] = await db
    .select({ id: users.id, status: users.status })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!targetUser) {
    return { success: false, error: "User not found" };
  }

  if (targetUser.status !== "PENDING") {
    return { success: false, error: "User is not pending" };
  }

  try {
    await db
      .update(users)
      .set({ status: "APPROVED" })
      .where(eq(users.id, userId));

    return { success: true };
  } catch (error) {
    console.error("Approve user error:", error);
    return { success: false, error: "Failed to approve user" };
  }
};

export const rejectUser = async (userId: string) => {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  const [adminUser] = await db
    .select({ role: users.role })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  if (adminUser?.role !== "ADMIN") {
    return { success: false, error: "Unauthorized" };
  }

  const [targetUser] = await db
    .select({ id: users.id, status: users.status })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!targetUser) {
    return { success: false, error: "User not found" };
  }

  if (targetUser.status !== "PENDING") {
    return { success: false, error: "User is not pending" };
  }

  try {
    await db
      .update(users)
      .set({ status: "REJECTED" })
      .where(eq(users.id, userId));

    return { success: true };
  } catch (error) {
    console.error("Reject user error:", error);
    return { success: false, error: "Failed to reject user" };
  }
};
