import Link from "next/link";
import Image from "next/image";
import { Session } from "next-auth";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import config from "@/lib/config";
import PortalSwitch from "@/components/PortalSwitch";

type User = {
  fullName: string;
  universityCard: string;
  role?: string | null;
} | undefined;

const Header = ({ session, user }: { session: Session; user?: User }) => {
  const isAdmin = user?.role === "ADMIN";
  const avatarUrl =
    user?.universityCard &&
    `${config.env.imagekit.urlEndpoint}/${user.universityCard}`;

  return (
    <header className="my-10 flex justify-between gap-5">
      <Link href="/">
        <Image src="/icons/logo.svg" alt="logo" width={40} height={40} />
      </Link>

      <ul className="flex flex-row items-center gap-8">
        {isAdmin && (
          <li>
            <PortalSwitch isAdmin={true} />
          </li>
        )}
        <li>
          <Link
            href="/library"
            className="text-light-200 hover:text-light-100"
          >
            Library
          </Link>
        </li>
        <li>
          <Link
            href="/wishlist"
            className="text-light-200 hover:text-light-100"
          >
            Wishlist
          </Link>
        </li>

        <li>
          <Link
            href="/my-profile"
            className="group block rounded-full outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-dark-100"
            aria-label="My profile"
          >
            <Avatar className="h-11 w-11 cursor-pointer overflow-hidden rounded-full border-2 border-primary/30 bg-dark-400 shadow-[0_4px_12px_rgba(0,0,0,0.3)] transition-all duration-300 group-hover:scale-105 group-hover:border-primary/70 group-hover:shadow-[0_6px_20px_rgba(0,0,0,0.4),0_0_24px_rgba(231,201,165,0.15)]">
              {avatarUrl && (
                <AvatarImage
                  src={avatarUrl}
                  alt={session?.user?.name || "User"}
                  className="object-cover"
                />
              )}
              <AvatarFallback className="flex h-full w-full items-center justify-center bg-gradient-to-br from-dark-600 to-dark-400 text-sm font-semibold text-primary">
                {getInitials(session?.user?.name || "IN")}
              </AvatarFallback>
            </Avatar>
          </Link>
        </li>
      </ul>
    </header>
  );
};

export default Header;
