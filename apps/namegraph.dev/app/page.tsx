"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto py-16">
      <div className="max-w-4xl flex flex-col mx-auto">
        <h1 className="text-2xl font-semibold mb-12">
          Welcome to NameGraph mini-apps
        </h1>
        <p className="mb-8">
          Here you will be able to access different examples of how you can make
          usage of NameGraph SDK
        </p>

        <ul>
          <h2 className="mb-4 font-medium">Mini-apps:</h2>
          <li className="flex space-x-1">
            <p>+</p>
            <Link href="/ideate" className="underline">
              Ideate
            </Link>
          </li>
          <li className="flex space-x-1">
            <p>+</p>
            <Link href="/scramble" className="underline">
              Scramble
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
