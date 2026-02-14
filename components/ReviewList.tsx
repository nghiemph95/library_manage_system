import { Star } from "lucide-react";
import dayjs from "dayjs";
import type { ReviewWithUser } from "@/lib/actions/book";

export default function ReviewList({
  reviews: list,
}: {
  reviews: ReviewWithUser[];
}) {
  if (list.length === 0) return null;

  return (
    <ul className="space-y-4">
      {list.map((r) => (
        <li
          key={r.id}
          className="rounded-lg border border-light-100/10 bg-dark-300/50 p-4"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-medium text-white">{r.userName ?? "Anonymous"}</span>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    className={`size-4 ${
                      n <= r.rating ? "fill-amber-400 text-amber-400" : "text-light-500"
                    }`}
                  />
                ))}
              </div>
            </div>
            <span className="text-xs text-light-500">
              {r.createdAt ? dayjs(r.createdAt).format("D MMM YYYY") : ""}
            </span>
          </div>
          {r.comment && (
            <p className="mt-2 text-sm text-light-200">{r.comment}</p>
          )}
        </li>
      ))}
    </ul>
  );
}
