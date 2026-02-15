/** Heart + book for wishlist empty state */
export default function EmptyWishlistIllustration({ className }: { className?: string }) {
  return (
    <svg
      width="100"
      height="100"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M50 85C50 85 15 60 15 35C15 22 25 12 50 12C75 12 85 22 85 35C85 60 50 85 50 85Z"
        fill="currentColor"
        className="text-primary/30"
      />
      <path
        d="M35 55V25l8 4v30l-8-4zM52 52V22l8 4v30l-8-4z"
        fill="currentColor"
        className="text-dark-400/50"
      />
    </svg>
  );
}
