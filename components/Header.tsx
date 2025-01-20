// "use client";
import Link from "next/link";
import Image from "next/image";
import { signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import { Session } from "next-auth";
// import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";

const Header = ({ session }: { session: Session }) => {
  // const pathname = usePathname();
  return (
    <header className="my-10 flex justify-between gap-5">
      <Link href="/">
        <Image src="/icons/logo.svg" alt="logo" width={40} height={40} />
      </Link>

      <ul className="flex flex-row items-center gap-8">
        <li>
          <form
            action={async () => {
              "use server";

              await signOut();
            }}
            className="mb-10"
          >
            <Button>Logout</Button>
          </form>
        </li>
        <li>
          <Link href="/library" className="text-light-200">
            Library
          </Link>
        </li>

        <li>
          <Link href="/my-profile">
            <Avatar>
              <AvatarFallback>{session?.user?.name}</AvatarFallback>
            </Avatar>
          </Link>
        </li>
      </ul>
    </header>
  );
};

export default Header;
