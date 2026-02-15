/** Simple book stack illustration for empty states */
export default function EmptyBooksIllustration({ className }: { className?: string }) {
  return (
    <svg
      width="120"
      height="80"
      viewBox="0 0 120 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M20 60V20l12 5v40l-12-5z"
        fill="currentColor"
        className="text-dark-400/60"
      />
      <path
        d="M44 58V18l12 5v40l-12-5z"
        fill="currentColor"
        className="text-dark-400/50"
      />
      <path
        d="M68 56V16l12 5v40l-12-5z"
        fill="currentColor"
        className="text-primary/40"
      />
      <path
        d="M92 54V14l12 5v40l-12-5z"
        fill="currentColor"
        className="text-dark-400/60"
      />
      <circle cx="60" cy="42" r="8" fill="currentColor" className="text-dark-400/30" />
    </svg>
  );
}
