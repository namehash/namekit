"use client";

interface NameItem {
  name: string;
  interestingScore: number;
}

export function List({ names }: { names: NameItem[] }) {
  return (
    <ul className="space-y-2">
      {names?.map((item, index) => (
        <li
          key={item.name}
          className="flex items-center justify-between bg-white p-3 rounded shadow"
        >
          <span className="font-bold">{item.name}</span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {item.interestingScore.toFixed(4)}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}
