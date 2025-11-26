"use client";

import Link from "next/link";
import {
  UserIcon,
  ChartBarIcon,
  DocumentTextIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

export default function ProfileMenuList() {
  const items = [
    {
      href: "/profile/manage",
      icon: <UserIcon className="w-6 h-6 text-gray-600" />,
      label: "Manage Account",
    },
    {
      href: "/profile/difficulty",
      icon: <ChartBarIcon className="w-6 h-6 text-gray-600" />,
      label: "Difficulty",
    },
    {
      href: "/terms",
      icon: <DocumentTextIcon className="w-6 h-6 text-gray-600" />,
      label: "Terms of Service / Licenses",
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {items.map((item, i) => (
        <Link
          key={item.label}
          href={item.href}
          className={`flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition-colors ${
            i !== items.length - 1 ? "border-b border-gray-200" : ""
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              {item.icon}
            </div>
            <span className="text-gray-900 text-base font-medium">
              {item.label}
            </span>
          </div>
          <ChevronRightIcon className="w-5 h-5 text-gray-400" />
        </Link>
      ))}
    </div>
  );
}
