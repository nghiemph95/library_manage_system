import Link from "next/link";
import { BookOpen, Heart, User } from "lucide-react";

export default function DashboardShortcuts() {
  const links = [
    { href: "/library", label: "Library", icon: BookOpen },
    { href: "/wishlist", label: "Wishlist", icon: Heart },
    { href: "/my-profile", label: "My profile", icon: User },
  ];

  return (
    <div className="dashboard-shortcuts">
      {links.map(({ href, label, icon: Icon }) => (
        <Link key={href} href={href} className="dashboard-shortcut-btn">
          <Icon className="size-5" />
          {label}
        </Link>
      ))}
    </div>
  );
}
