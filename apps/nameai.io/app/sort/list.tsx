"use client";

import type { LabelItem } from "./page";

export function SortedList({ labels }: { labels: LabelItem[] }) {
  return (
    <ul className="space-y-3">
      {labels?.map((item) => (
        <li
          key={item.label}
          className="flex items-center justify-between bg-white p-3 border border-gray-300 rounded shadow-sm"
        >
          <span className="font-bold">{item.label}</span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {item.sortScore.toFixed(4)}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}
