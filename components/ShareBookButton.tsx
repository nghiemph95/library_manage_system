"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function ShareBookButton({
  title,
  bookId,
}: {
  title: string;
  bookId: string;
}) {
  const [copied, setCopied] = useState(false);

  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/books/${bookId}`
      : "";

  const handleShare = async () => {
    if (typeof window === "undefined") return;
    const shareUrl = `${window.location.origin}/books/${bookId}`;
    const text = `Check out "${title}" on BookWise: ${shareUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `BookWise: ${title}`,
          text,
          url: shareUrl,
        });
        toast({ title: "Shared successfully" });
      } catch (err) {
        copyToClipboard(shareUrl);
      }
    } else {
      copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = (shareUrl: string) => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      toast({ title: "Link copied to clipboard" });
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <Button
      className="book-overview_btn"
      onClick={handleShare}
    >
      {copied ? (
        <Check className="size-5" />
      ) : (
        <Share2 className="size-5" />
      )}
      {copied ? "Copied!" : "Share"}
    </Button>
  );
}
