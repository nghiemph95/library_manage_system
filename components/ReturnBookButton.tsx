"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { returnBook } from "@/lib/actions/book";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function ReturnBookButton({
  borrowRecordId,
  userId,
}: {
  borrowRecordId: string;
  userId: string;
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

  return (
    <Button
      variant="outline"
      size="sm"
      className="mt-2 w-full border-light-100/30 text-light-100"
      onClick={handleReturn}
      disabled={loading}
    >
      {loading ? (
        <>
          <Loader2 className="mr-1 size-4 animate-spin" />
          Returning...
        </>
      ) : (
        "I've returned this book"
      )}
    </Button>
  );
}
