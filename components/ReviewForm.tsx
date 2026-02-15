"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { submitReview } from "@/lib/actions/book";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { Loader2, Star } from "lucide-react";

export default function ReviewForm({
  bookId,
  userId,
}: {
  bookId: string;
  userId: string;
}) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1 || rating > 5) {
      toast({ title: "Please select a rating", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const result = await submitReview({ bookId, userId, rating, comment });
      if (result.success) {
        toast({ title: "Review submitted" });
        setRating(0);
        setComment("");
        router.refresh();
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <p className="text-sm text-light-200">Your rating</p>
        <div className="mt-1 flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              className="rounded p-1 transition hover:opacity-80"
            >
              <Star
                className={`size-6 ${
                  n <= rating ? "fill-amber-400 text-amber-400" : "text-light-500"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
      <div>
        <label htmlFor="review-comment" className="text-sm text-light-200">
          Comment (optional)
        </label>
        <textarea
          id="review-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="mt-1 w-full rounded-lg border border-light-100/20 bg-dark-300 px-3 py-2 text-white placeholder:text-light-500 focus:outline-none focus:ring-1 focus:ring-primary"
          rows={3}
          placeholder="Share your thoughts..."
        />
      </div>
      <Button type="submit" disabled={loading} size="sm">
        {loading ? <Loader2 className="btn-loading-spinner size-4" /> : "Submit review"}
      </Button>
    </form>
  );
}
