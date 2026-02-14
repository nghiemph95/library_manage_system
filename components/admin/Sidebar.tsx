"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { adminSideBarLinks } from "@/constants";
import Link from "next/link";
import { cn, getInitials } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Session } from "next-auth";

const ACCOUNT_REQUESTS_ROUTE = "/admin/account-requests";

const Sidebar = ({
  session,
  pendingRequestsCount = 0,
}: {
  session: Session;
  pendingRequestsCount?: number;
}) => {
  const pathname = usePathname();
  const [navigatingTo, setNavigatingTo] = useState<string | null>(null);
  const showBadge = pendingRequestsCount > 0;

  useEffect(() => {
    setNavigatingTo(null);
  }, [pathname]);

  return (
    <div className="admin-sidebar">
      <div>
        <div className="logo">
          <Image
            src="/icons/admin/logo.svg"
            alt="logo"
            height={37}
            width={37}
          />
          <h1>BookWise</h1>
        </div>

        <div className="mt-10 flex flex-col gap-5">
          {adminSideBarLinks.map((link) => {
            const isSelected =
              (link.route !== "/admin" &&
                pathname.includes(link.route) &&
                link.route.length > 1) ||
              pathname === link.route;
            const isAccountRequests = link.route === ACCOUNT_REQUESTS_ROUTE;

            const isActive =
              (isSelected && !navigatingTo) || navigatingTo === link.route;

            return (
              <Link
                href={link.route}
                key={link.route}
                onClick={() => setNavigatingTo(link.route)}
                prefetch={true}
              >
                <div
                  className={cn(
                    "link",
                    isActive && "bg-primary-admin shadow-sm",
                    navigatingTo === link.route && "admin-sidebar__link-loading"
                  )}
                >
                  <div className="relative size-5 shrink-0">
                    <Image
                      src={link.img}
                      alt="icon"
                      fill
                      className={`${isActive ? "brightness-0 invert" : ""} object-contain`}
                    />
                    {isAccountRequests && showBadge && (
                      <span
                        className="admin-sidebar__badge-dot md:hidden"
                        aria-hidden
                      />
                    )}
                  </div>

                  <p
                    className={cn(
                      "flex items-center gap-2 min-w-0",
                      isActive ? "text-white" : "text-dark"
                    )}
                  >
                    <span className="truncate">{link.text}</span>
                    {isAccountRequests && showBadge && (
                      <span
                        className="admin-sidebar__badge"
                        title={`${pendingRequestsCount} pending request${pendingRequestsCount !== 1 ? "s" : ""}`}
                      >
                        {pendingRequestsCount > 99
                          ? "99+"
                          : pendingRequestsCount}
                      </span>
                    )}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="user">
        <Avatar>
          <AvatarFallback className="bg-amber-100">
            {getInitials(session?.user?.name || "IN")}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col max-md:hidden">
          <p className="font-semibold text-dark-200">{session?.user?.name}</p>
          <p className="text-xs text-light-500">{session?.user?.email}</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
