"use client";

import { useCallback } from "react";
import WelcomeIntro from "@/components/WelcomeIntro";

export default function WelcomeIntroWrapper({
  showIntro,
  children,
}: {
  showIntro: boolean;
  children: React.ReactNode;
}) {
  const onDone = useCallback(() => {
    // No-op; router.replace is called inside WelcomeIntro
  }, []);

  return (
    <>
      {showIntro && <WelcomeIntro onDone={onDone} />}
      {children}
    </>
  );
}
