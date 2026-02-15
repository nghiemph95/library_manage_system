"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { addToWaitlist } from "@/lib/actions/book";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { Bell, Loader2 } from "lucide-react";

export default function NotifyMeButton({
  bookId,
  userId,
  initialOnList,
}: {
  bookId: string;
  userId: string;
  initialOnList: boolean;
}) {
  const [onList, setOnList] = useState(initialOnList);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleClick = async () => {
    if (onList) return;
    setLoading(true);
    try {
      const result = await addToWaitlist({ bookId, userId });
      if (result.success) {
        setOnList(true);
        toast({
          title: "You're on the list",
          description: "We'll notify you when this book is available.",
        });
        router.refresh();
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" });
      }
    } finally {
      setLoading(false);
    }
  };

  if (onList) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 px-4 py-2 text-sm text-primary">
        <Bell className="size-4" />
        <span>You'll be notified when available</span>
      </div>
    );
  }

  return (
    <Button
      variant="outline"
      className="border-light-100/40 text-light-100"
      onClick={handleClick}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="btn-loading-spinner size-4" />
      ) : (
        <>
          <Bell className="mr-2 size-4" />
          Notify me when available
        </>
      )}
    </Button>
  );
}
