import Link from "next/link";
import { ReactNode } from "react";

interface EmptyStateProps {
  illustration: ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onClear?: () => void;
  clearLabel?: string;
}

export default function EmptyState({
  illustration,
  title,
  description,
  actionLabel,
  actionHref,
  onClear,
  clearLabel,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dark-300/60 bg-dark-200/40 px-6 py-12 text-center">
      <div className="mb-4 flex justify-center opacity-90">{illustration}</div>
      <h3 className="font-bebas-neue text-2xl text-light-100 xs:text-3xl">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-light-200">{description}</p>
      )}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {actionHref && actionLabel && (
          <Link
            href={actionHref}
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-5 font-bebas-neue text-base tracking-wide text-dark-100 transition-colors hover:bg-primary/90"
          >
            {actionLabel}
          </Link>
        )}
        {onClear && clearLabel && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-dark-400 bg-transparent px-5 text-sm font-medium text-light-200 transition-colors hover:bg-dark-400"
          >
            {clearLabel}
          </button>
        )}
      </div>
    </div>
  );
}
