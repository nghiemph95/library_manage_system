import { NextResponse } from "next/server";
import { getBorrowReminderCandidates } from "@/lib/actions/book";
import config from "@/lib/config";

/**
 * Borrow reminder cron – call from Vercel Cron or external scheduler.
 * Sends reminders for borrows due today or overdue via Resend (RESEND_TOKEN in .env).
 * Set CRON_SECRET in env and pass ?secret=CRON_SECRET or Authorization: Bearer CRON_SECRET.
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const url = new URL(request.url);
  const secret = url.searchParams.get("secret") || authHeader?.replace("Bearer ", "");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && secret !== cronSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const resendToken = config.env.resendToken;

  try {
    const candidates = await getBorrowReminderCandidates();
    const results: { email: string; sent: boolean; message?: string }[] = [];

    for (const c of candidates) {
      if (resendToken) {
        try {
          const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${resendToken}`,
            },
            body: JSON.stringify({
              from: process.env.RESEND_FROM_EMAIL || "BookWise <onboarding@resend.dev>",
              to: [c.userEmail],
              subject: `Reminder: Return "${c.bookTitle}" by ${c.dueDate}`,
              text: `Hi ${c.userName}, please return "${c.bookTitle}" by ${c.dueDate}. Thank you!`,
            }),
          });
          const data = await res.json();
          results.push({
            email: c.userEmail,
            sent: res.ok,
            message: data.id || data.message,
          });
        } catch (e) {
          results.push({ email: c.userEmail, sent: false, message: String(e) });
        }
      } else {
        console.log(
          `[Borrow reminder] Would send to ${c.userEmail}: "${c.bookTitle}" due ${c.dueDate}`
        );
        results.push({ email: c.userEmail, sent: false, message: "No RESEND_TOKEN" });
      }
    }

    return NextResponse.json({
      ok: true,
      count: candidates.length,
      results,
    });
  } catch (error) {
    console.error("[Borrow reminder cron]", error);
    return NextResponse.json(
      { error: "Failed to run borrow reminder" },
      { status: 500 }
    );
  }
}
