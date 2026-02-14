"use client";

import { useState } from "react";
import { addToWishlist, removeFromWishlist } from "@/lib/actions/book";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { Heart, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function WishlistButton({
  bookId,
  userId,
  initialInWishlist,
  className,
  size = "default",
  variant = "icon",
}: {
  bookId: string;
  userId: string;
  initialInWishlist: boolean;
  className?: string;
  size?: "default" | "sm";
  /** "icon" = heart only (e.g. on cards); "button" = full button with label like Share/Notify */
  variant?: "icon" | "button";
}) {
  const [inWishlist, setInWishlist] = useState(initialInWishlist);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    try {
      const result = inWishlist
        ? await removeFromWishlist({ bookId, userId })
        : await addToWishlist({ bookId, userId });
      if (result.success) {
        setInWishlist(!inWishlist);
        toast({
          title: inWishlist ? "Removed from wishlist" : "Added to wishlist",
        });
        router.refresh();
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" });
      }
    } finally {
      setLoading(false);
    }
  };

  if (variant === "button") {
    return (
      <Button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className={cn("book-overview_btn", className)}
        aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
      >
        {loading ? (
          <Loader2 className="size-5 animate-spin" />
        ) : (
          <Heart
            className={cn("size-5", inWishlist && "fill-current")}
          />
        )}
        {inWishlist ? "In wishlist" : "Add to wishlist"}
      </Button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={cn(
        "rounded-full p-2 transition-colors hover:bg-white/10 disabled:opacity-50",
        inWishlist && "text-rose-500",
        size === "sm" && "p-1.5",
        className
      )}
      aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      {loading ? (
        <Loader2 className={cn("animate-spin", size === "sm" ? "size-4" : "size-5")} />
      ) : (
        <Heart
          className={cn(size === "sm" ? "size-4" : "size-5", inWishlist && "fill-current")}
        />
      )}
    </button>
  );
}
