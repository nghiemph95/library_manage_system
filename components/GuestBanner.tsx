"use client";

import { useState, useEffect } from "react";
import { Session } from "next-auth";
import Link from "next/link";
import { X } from "lucide-react";
import { ADMIN_DEMO_CREDENTIALS_LINK } from "@/constants";

const GUEST_BANNER_DISMISSED_KEY = "guest-banner-dismissed";

export default function GuestBanner({ session }: { session: Session | null }) {
  const [mounted, setMounted] = useState(false);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    setMounted(true);
    setDismissed(
      typeof window !== "undefined" &&
        !!window.localStorage.getItem(GUEST_BANNER_DISMISSED_KEY)
    );
  }, []);

  const isGuest = !!session?.user?.isGuest;
  const show = mounted && isGuest && !dismissed;

  const handleDismiss = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(GUEST_BANNER_DISMISSED_KEY, "1");
      setDismissed(true);
    }
  };

  if (!show) return null;

  return (
    <div
      role="banner"
      className="relative flex flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-lg border border-primary/40 bg-primary/10 px-4 py-3 text-center text-sm text-white shadow-sm"
    >
      <p className="flex-1 basis-full sm:basis-auto">
        You&apos;re browsing as a guest. To try the full Admin experience,
        demo credentials are on{" "}
        <Link
          href={ADMIN_DEMO_CREDENTIALS_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold underline underline-offset-2 hover:no-underline"
        >
          Nghiêm Phạm&apos;s LinkedIn profile
        </Link>
        .
      </p>
      <button
        type="button"
        onClick={handleDismiss}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-white/80 transition hover:bg-white/20 hover:text-white"
        aria-label="Dismiss banner"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
