"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="container mx-auto py-16">
      <div className="max-w-4xl flex flex-col mx-auto text-center">
        <h1 className="text-2xl font-semibold mb-12">
          Acknowledge the power of NameGraph SDK
        </h1>
        <p className="mb-8">
          📔 NameGraph makes it possible for your application to be connected to
          Surf more than 21 million name ideas across more than 400,000
          name collections, or generate infinite related name suggestions.
          <br />
          <br />
          🔮 Boost the ideas of your users for profile naming or anything - make
          it with a single SDK method call.
        </p>

        <ul className="flex flex-col items-center font-medium space-y-3">
          <h4 className="font-light italic">Choose between</h4>
          <li className="flex space-x-1">
            <p>📊</p>
            <Link href="/your-catalog" className="hover:underline">
              Using your own name ideas catalog
            </Link>
          </li>
          <li className="flex space-x-1">
            <p>📈</p>
            <Link href="/collections" className="hover:underline">
              Using NameGraph collections
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
