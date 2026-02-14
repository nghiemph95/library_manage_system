"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface Props {
  isAdmin: boolean;
  variant?: "default" | "admin";
}

const PortalSwitch = ({ isAdmin, variant = "default" }: Props) => {
  const pathname = usePathname();
  const isUsersPortal = pathname?.startsWith("/admin");

  if (!isAdmin) return null;

  const activeClass =
    variant === "admin"
      ? "bg-primary-admin text-white"
      : "bg-primary text-dark-100";

  const inactiveClass =
    variant === "admin"
      ? "text-dark-400 hover:text-dark-200"
      : "text-light-200 hover:text-light-100";

  const trackClass =
    variant === "admin"
      ? "bg-light-600"
      : "bg-dark-300";

  return (
    <div className={cn("flex items-center rounded-lg p-0.5", trackClass)}>
      <Link
        href="/library"
        className={cn(
          "rounded-md px-4 py-2 text-sm font-medium transition-colors",
          !isUsersPortal ? activeClass : inactiveClass
        )}
      >
        Books
      </Link>
      <Link
        href="/admin/users"
        className={cn(
          "rounded-md px-4 py-2 text-sm font-medium transition-colors",
          isUsersPortal ? activeClass : inactiveClass
        )}
      >
        Users
      </Link>
    </div>
  );
};

export default PortalSwitch;
