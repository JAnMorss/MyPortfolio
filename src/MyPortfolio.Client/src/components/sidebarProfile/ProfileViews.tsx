"use client";

import { Users } from "lucide-react";

type ProfileViewsProps = {
  count: number;
};

export default function ProfileViews({ count }: ProfileViewsProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
      <Users className="w-4 h-4" />
      <span className="font-semibold text-gray-900 dark:text-gray-100">{count}</span>
      portfolio views
    </div>
  );
}