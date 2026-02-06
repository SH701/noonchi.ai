import Link from "next/link";
import { ReactNode } from "react";

interface ProfileMenuItem {
  label: string;
  href: string;
  icon?: ReactNode;
}

interface ProfileMenuListProps {
  title: string;
  items: ProfileMenuItem[];
}

export default function ProfileMenuList({
  title,
  items,
}: ProfileMenuListProps) {
  return (
    <div>
      <p className="text-sm text-gray-600 pb-2 pl-1">{title}</p>
      <div className="bg-white rounded-2xl p-4 flex flex-col gap-4 text-sm cursor-pointer">
        {items.map((item, idx) => (
          <div key={idx}>
            <Link href={item.href} className="flex items-center gap-3">
              {item.icon && <span>{item.icon}</span>}
              {item.label}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
