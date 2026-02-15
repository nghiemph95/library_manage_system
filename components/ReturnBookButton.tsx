"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { returnBook } from "@/lib/actions/book";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { Loader2, RotateCcw } from "lucide-react";

export default function ReturnBookButton({
  borrowRecordId,
  userId,
  variant = "default",
}: {
  borrowRecordId: string;
  userId: string;
  /** "default" = full-width green; "square" = red square next to receipt */
  variant?: "default" | "square";
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleReturn = async () => {
    setLoading(true);
    try {
      const result = await returnBook({ borrowRecordId, userId });
      if (result.success) {
        toast({ title: "Book returned", description: "Thank you for returning the book." });
        router.refresh();
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" });
      }
    } finally {
      setLoading(false);
    }
  };

  if (variant === "square") {
    return (
      <button
        type="button"
        className="btn-return-inline"
        onClick={handleReturn}
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="btn-loading-spinner size-5" />
        ) : (
          <RotateCcw />
        )}
        {loading ? "Returning..." : "Return book"}
      </button>
    );
  }

  return (
    <Button
      type="button"
      className="book-overview_btn-return mt-2 w-full"
      onClick={handleReturn}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="btn-loading-spinner size-5" />
      ) : (
        <RotateCcw className="size-5" />
      )}
      {loading ? "Returning..." : "Return this book"}
    </Button>
  );
}
