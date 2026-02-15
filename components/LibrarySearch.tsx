"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { LIBRARY_SORT_OPTIONS } from "@/constants";
import { Search } from "lucide-react";

interface Props {
  genres: string[];
}

const LibrarySearch = ({ genres }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const search = searchParams.get("search") ?? "";
  const genre = searchParams.get("genre") ?? "";
  const sort = searchParams.get("sort") ?? "newest";

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      startTransition(() => {
        router.push(`/library?${params.toString()}`);
      });
    },
    [router, searchParams]
  );

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchValue = (formData.get("search") as string)?.trim() ?? "";
    updateParams("search", searchValue);
  };

  return (
    <div className="mb-10 space-y-4">
      <form onSubmit={handleSearch} className="search flex items-center gap-2 rounded-xl border border-dark-300/80 bg-dark-200/60 px-3 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20">
        <Search className="size-5 shrink-0 text-light-500" aria-hidden />
        <Input
          key={search}
          name="search"
          placeholder="Search by title, author..."
          defaultValue={search}
          className="search-input flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0"
        />
      </form>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => updateParams("genre", "")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              !genre
                ? "bg-primary text-dark-100"
                : "border border-dark-400 bg-dark-300/80 text-light-100 hover:bg-dark-600"
            }`}
          >
            All
          </button>
          {genres.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => updateParams("genre", g)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                genre === g
                  ? "bg-primary text-dark-100"
                  : "border border-dark-400 bg-dark-300/80 text-light-100 hover:bg-dark-600"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
        <span className="text-light-500">·</span>
        <select
          value={sort}
          onChange={(e) => updateParams("sort", e.target.value)}
          className="rounded-lg border border-dark-400 bg-dark-300/80 px-3 py-2 text-sm font-medium text-light-100 outline-none focus:ring-2 focus:ring-primary/40"
          aria-label="Sort by"
        >
          {LIBRARY_SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      {isPending && (
        <p className="text-sm text-light-500">Loading...</p>
      )}
    </div>
  );
};

export default LibrarySearch;
