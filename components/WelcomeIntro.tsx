"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { BookOpen, BookMarked } from "lucide-react";

const INTRO_DURATION_MS = 2200;
const FADE_OUT_MS = 500;

export default function WelcomeIntro({ onDone }: { onDone: () => void }) {
  const router = useRouter();
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => {
      setExiting(true);
    }, INTRO_DURATION_MS);
    const t2 = setTimeout(() => {
      onDone();
      router.replace("/");
    }, INTRO_DURATION_MS + FADE_OUT_MS);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onDone, router]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-dark-100 px-4 transition-opacity duration-[500ms] ${
        exiting ? "opacity-0" : "opacity-100"
      }`}
      aria-hidden
    >
      {/* Floating decorations */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute left-[15%] top-[25%] text-primary/40"
          style={{
            animation: "welcome-float 3s ease-in-out infinite",
            animationDelay: "0.2s",
          }}
        >
          <BookOpen className="size-10" strokeWidth={1.5} />
        </div>
        <div
          className="absolute right-[18%] top-[30%] text-primary/30"
          style={{
            animation: "welcome-float 3.2s ease-in-out infinite",
            animationDelay: "0.5s",
          }}
        >
          <BookMarked className="size-8" strokeWidth={1.5} />
        </div>
        <div
          className="absolute bottom-[28%] left-[20%] text-primary/25"
          style={{
            animation: "welcome-float 2.8s ease-in-out infinite",
            animationDelay: "0.8s",
          }}
        >
          <BookOpen className="size-7" strokeWidth={1.5} />
        </div>
        <div
          className="absolute bottom-[25%] right-[22%] text-primary/35"
          style={{
            animation: "welcome-float 3.1s ease-in-out infinite",
            animationDelay: "0.3s",
          }}
        >
          <BookMarked className="size-9" strokeWidth={1.5} />
        </div>
      </div>

      {/* Logo + text */}
      <div className="relative z-10 flex flex-col items-center gap-4">
        <div
          className="flex items-center gap-2"
          style={{
            animation: "welcome-logo-in 0.7s ease-out forwards",
          }}
        >
          <Image
            src="/icons/logo.svg"
            alt=""
            width={56}
            height={56}
            className="drop-shadow-[0_0_20px_rgba(231,201,165,0.4)]"
          />
          <span
            className="font-bebas-neue text-4xl tracking-wide text-primary sm:text-5xl"
            style={{ textShadow: "0 0 24px rgba(231,201,165,0.3)" }}
          >
            BookWise
          </span>
        </div>

        <p
          className="text-center text-lg text-light-100 sm:text-xl"
          style={{
            animation: "welcome-text-in 0.6s ease-out 0.35s forwards",
            opacity: 0,
          }}
        >
          Welcome back
        </p>

        <p
          className="text-center text-sm text-light-200"
          style={{
            animation: "welcome-text-in 0.5s ease-out 0.6s forwards",
            opacity: 0,
          }}
        >
          Your library is ready
        </p>
      </div>
    </div>
  );
}
