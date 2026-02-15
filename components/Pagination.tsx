"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  basePath = "/library",
}: PaginationProps) {
  const searchParams = useSearchParams();
  const buildUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    return `${basePath}?${params.toString()}`;
  };

  if (totalPages <= 1) return null;

  const prevPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;

  return (
    <nav
      className="mt-10 flex flex-wrap items-center justify-center gap-2"
      aria-label="Pagination"
    >
      {prevPage && (
        <Link
          href={buildUrl(prevPage)}
          className="inline-flex min-h-10 items-center justify-center rounded-lg border border-dark-400 bg-dark-200/80 px-4 text-sm font-medium text-light-200 transition-colors hover:bg-dark-400"
        >
          Previous
        </Link>
      )}
      <span className="flex items-center gap-1 px-2 text-sm text-light-200">
        Page {currentPage} of {totalPages}
      </span>
      {nextPage && (
        <Link
          href={buildUrl(nextPage)}
          className="inline-flex min-h-10 items-center justify-center rounded-lg border border-dark-400 bg-dark-200/80 px-4 text-sm font-medium text-light-200 transition-colors hover:bg-dark-400"
        >
          Next
        </Link>
      )}
    </nav>
  );
}
