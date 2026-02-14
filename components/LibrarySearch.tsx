"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { Input } from "@/components/ui/input";

interface Props {
  genres: string[];
}

const LibrarySearch = ({ genres }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const search = searchParams.get("search") ?? "";
  const genre = searchParams.get("genre") ?? "";

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
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
      <form onSubmit={handleSearch} className="search">
        <Input
          key={search}
          name="search"
          placeholder="Search by title, author..."
          defaultValue={search}
          className="search-input border-0 bg-transparent"
        />
      </form>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => updateParams("genre", "")}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            !genre
              ? "bg-primary text-dark-100"
              : "bg-dark-300 text-light-100 hover:bg-dark-600"
          }`}
        >
          All
        </button>
        {genres.map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => updateParams("genre", g)}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              genre === g
                ? "bg-primary text-dark-100"
                : "bg-dark-300 text-light-100 hover:bg-dark-600"
            }`}
          >
            {g}
          </button>
        ))}
      </div>
      {isPending && (
        <p className="text-sm text-light-500">Loading...</p>
      )}
    </div>
  );
};

export default LibrarySearch;
