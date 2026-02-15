import Link from "next/link";
import { BookUp, Heart, CalendarCheck } from "lucide-react";

interface DashboardStatsProps {
  borrowing: number;
  wishlist: number;
  dueSoon?: number;
}

export default function DashboardStats({
  borrowing,
  wishlist,
  dueSoon = 0,
}: DashboardStatsProps) {
  const items = [
    {
      label: "Borrowing",
      value: borrowing,
      icon: BookUp,
      href: "/my-profile",
    },
    {
      label: "Wishlist",
      value: wishlist,
      icon: Heart,
      href: "/wishlist",
    },
    {
      label: "Due soon",
      value: dueSoon,
      icon: CalendarCheck,
      href: "/my-profile",
    },
  ];

  return (
    <div className="dashboard-stats">
      {items.map(({ label, value, icon: Icon, href }) => (
        <Link
          key={label}
          href={href}
          className="dashboard-stat-card"
          aria-label={`${label}: ${value}`}
        >
          <Icon className="dashboard-stat-icon" />
          <span className="dashboard-stat-value">{value}</span>
          <span className="dashboard-stat-label">{label}</span>
        </Link>
      ))}
    </div>
  );
}
