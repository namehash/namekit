"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="container mx-auto py-16">
      <div className="max-w-4xl flex flex-col mx-auto text-center">
        <h1 className="text-2xl font-semibold mb-2">
          Solve &apos;writer&apos;s block&apos; in your ENS registrar app
        </h1>
        <h2 className="text-lg font-regular mb-12">
          Help your users discover ENS names they love with NameGraph.
        </h2>
        <p className="mb-8">
          📔 NameGraph empowers ENS registrar apps to build new name discovery
          user experiences. Surf more than 21 million name ideas across more
          than 400,000 name collections, or generate infinite related name
          suggestions.
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
